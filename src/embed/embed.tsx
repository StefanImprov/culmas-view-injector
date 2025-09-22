import "@/index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProductInjector } from "@/components/ProductInjector";
import { Theme, defaultThemes } from "@/types/theme";
import { PortalProvider } from "@/embed/portal-provider";
import { TenantProvider, TenantConfig, useTenant } from "@/contexts/TenantContext";

type WidgetConfig = {
  container: string;                   // CSS selector
  apiUrl: string;
  templateIds?: string;
  venueIds?: string;
  themeJson?: string;                  // JSON string from data-theme
  domain?: string;                     // Domain from data-domain
};

function parseTheme(themeJson?: string): Theme | undefined {
  if (!themeJson) return undefined;
  try {
    const customTheme = JSON.parse(themeJson);
    console.log('🎨 Custom theme parsed:', customTheme);
    
    // Find the matching default theme as base
    const defaultTheme = defaultThemes.find(t => t.id === customTheme.id) || defaultThemes[0];
    console.log('🎨 Using default base theme:', defaultTheme.id);
    
    // Merge custom theme with default theme, ensuring all properties exist
    const mergedTheme: Theme = {
      id: customTheme.id || defaultTheme.id,
      name: customTheme.name || defaultTheme.name,
      style: customTheme.style || defaultTheme.style,
      colors: {
        primary: customTheme.colors?.primary || defaultTheme.colors.primary,
        primaryForeground: customTheme.colors?.primaryForeground || defaultTheme.colors.primaryForeground,
        primaryGlow: customTheme.colors?.primaryGlow || defaultTheme.colors.primaryGlow,
        gradientPrimary: customTheme.colors?.gradientPrimary || defaultTheme.colors.gradientPrimary,
        secondary: customTheme.colors?.secondary || defaultTheme.colors.secondary,
        secondaryForeground: customTheme.colors?.secondaryForeground || defaultTheme.colors.secondaryForeground,
        background: customTheme.colors?.background || defaultTheme.colors.background,
        foreground: customTheme.colors?.foreground || defaultTheme.colors.foreground,
        card: customTheme.colors?.card || defaultTheme.colors.card,
        cardForeground: customTheme.colors?.cardForeground || defaultTheme.colors.cardForeground,
        border: customTheme.colors?.border || defaultTheme.colors.border,
        accent: customTheme.colors?.accent || defaultTheme.colors.accent,
        accentForeground: customTheme.colors?.accentForeground || defaultTheme.colors.accentForeground,
        muted: customTheme.colors?.muted || defaultTheme.colors.muted,
        mutedForeground: customTheme.colors?.mutedForeground || defaultTheme.colors.mutedForeground,
      },
      design: {
        borderRadius: customTheme.design?.borderRadius || defaultTheme.design.borderRadius,
        shadowIntensity: customTheme.design?.shadowIntensity || defaultTheme.design.shadowIntensity,
        hoverEffects: customTheme.design?.hoverEffects !== undefined ? customTheme.design.hoverEffects : defaultTheme.design.hoverEffects,
        gradients: customTheme.design?.gradients !== undefined ? customTheme.design.gradients : defaultTheme.design.gradients,
      }
    };
    
    console.log('🎨 Final merged theme:', mergedTheme);
    return mergedTheme;
  } catch (error) {
    console.error('🎨 Theme parsing failed:', error);
    return undefined;
  }
}

function ensureCssInShadow(shadow: ShadowRoot, href: string) {
  const id = "culmas-css-shadow";
  const existing = shadow.querySelector<HTMLLinkElement>(`link#${id}`);
  if (existing) return existing;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href; // e.g. https://stefanimprov.github.io/culmas-view-injector/index.css?v=1
  shadow.appendChild(link);
  return link;
}

function mountOne(scriptEl: HTMLScriptElement) {
  const cfg: WidgetConfig = {
    container: scriptEl.getAttribute("data-container") || "#culmas-products",
    apiUrl: scriptEl.getAttribute("data-api-url") || "",
    templateIds: scriptEl.getAttribute("data-template-ids") || "",
    venueIds: scriptEl.getAttribute("data-venue-ids") || "",
    themeJson: scriptEl.getAttribute("data-theme") || "",
    domain: scriptEl.getAttribute("data-domain") || ""
  };

  const host = document.querySelector<HTMLElement>(cfg.container);
  if (!host) {
    console.warn("[CulmasEmbed] Container not found:", cfg.container);
    return;
  }

  // Shadow DOM isolation
  const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
  // inject our stylesheet INTO the shadow
  ensureCssInShadow(shadow, "https://stefanimprov.github.io/culmas-view-injector/embed/culmas-embed.css?v=1");

  // Create a theme container that wraps all widget content
  let themeContainer = shadow.getElementById("culmas-theme-container");
  if (!themeContainer) {
    themeContainer = document.createElement("div");
    themeContainer.id = "culmas-theme-container";
    themeContainer.className = "culmas-widget-container";
    shadow.appendChild(themeContainer);
  }

  // Create a mount point inside the theme container
  let mount = themeContainer.querySelector("#culmas-mount");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "culmas-mount";
    themeContainer.appendChild(mount);
  }

  // Parse theme if provided
  const initialTheme = parseTheme(cfg.themeJson);
  console.log('🎨 Widget initializing with theme:', initialTheme?.id || 'default');

  // Create tenant config from widget config
  const createTenantConfig = (cfg: WidgetConfig): TenantConfig => {
    // Use provided domain, or extract from apiUrl as fallback
    let domain = "";
    let bookingUrl = "";
    
    if (cfg.domain) {
      // Use the explicitly provided domain
      domain = cfg.domain;
      bookingUrl = `https://${domain}`;
      console.log('🔧 Using provided domain:', domain);
    } else {
      // Fallback: extract domain from apiUrl (e.g., "https://api.dev.culmas.io/" -> "dev.culmas.io")
      try {
        const url = new URL(cfg.apiUrl);
        // Convert api.dev.culmas.io to dev.culmas.io
        domain = url.hostname.replace(/^api\./, '');
        bookingUrl = `https://${domain}`;
        console.log('🔧 Derived domain from apiUrl:', domain);
      } catch (error) {
        console.warn('🔧 Could not parse domain from apiUrl:', cfg.apiUrl);
        domain = "dev.culmas.io";
        bookingUrl = "https://dev.culmas.io";
      }
    }

    return {
      name: "Widget Client",
      apiUrl: cfg.apiUrl,
      domain,
      bookingUrl
    };
  };

  const tenantConfig = createTenantConfig(cfg);
  console.log('🔧 Widget tenant config:', tenantConfig);

  // Widget wrapper that initializes tenant config
  const WidgetWrapper: React.FC = () => {
    return (
      <TenantProvider>
        <TenantConfigInitializer config={tenantConfig}>
          <ThemeProvider widgetMode={true} rootEl={themeContainer as HTMLElement} initialTheme={initialTheme}>
            <ProductInjector
              apiUrl={cfg.apiUrl}
              templateIds={cfg.templateIds ? cfg.templateIds.split(',') : undefined}
              venueIds={cfg.venueIds ? cfg.venueIds.split(',') : undefined}
            />
          </ThemeProvider>
        </TenantConfigInitializer>
      </TenantProvider>
    );
  };

  // Component to initialize tenant config
  const TenantConfigInitializer: React.FC<{ config: TenantConfig; children: React.ReactNode }> = ({ config, children }) => {
    const { updateConfig } = useTenant();
    
    React.useEffect(() => {
      updateConfig(config);
    }, [config, updateConfig]);
    
    return <>{children}</>;
  };

  // Render the widget (no routers/toasters/globals)
  const root = createRoot(mount);
  root.render(
    <PortalProvider container={shadow as unknown as HTMLElement}>
      <WidgetWrapper />
    </PortalProvider>
  );
}

// Auto-mount for any <script data-culmas-widget>
export function mountAll() {
  const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[data-culmas-widget="true"]'));
  scripts.forEach(mountOne);
}

// Immediately mount on load
try { mountAll(); } catch (e) { console.error("[CulmasEmbed] mount error", e); }