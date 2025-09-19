import "@/index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProductInjector } from "@/components/ProductInjector";
import { Theme } from "@/types/theme";
import { PortalProvider } from "@/embed/portal-provider";

type WidgetConfig = {
  container: string;                   // CSS selector
  apiUrl: string;
  templateIds?: string;
  venueIds?: string;
  themeJson?: string;                  // JSON string from data-theme
};

function parseTheme(themeJson?: string): Theme | undefined {
  if (!themeJson) return undefined;
  try { return JSON.parse(themeJson); } catch { return undefined; }
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
    themeJson: scriptEl.getAttribute("data-theme") || ""
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

  // Create a mount point inside the shadow root
  let mount = shadow.getElementById("culmas-mount");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "culmas-mount";
    shadow.appendChild(mount);
  }

  // Parse theme if provided
  const initialTheme = parseTheme(cfg.themeJson);

  // Render the widget (no routers/toasters/globals)
  const root = createRoot(mount);
  root.render(
    <PortalProvider container={shadow as unknown as HTMLElement}>
      <ThemeProvider widgetMode={true} rootEl={mount as HTMLElement} initialTheme={initialTheme}>
        <ProductInjector
          apiUrl={cfg.apiUrl}
          templateIds={cfg.templateIds ? cfg.templateIds.split(',') : undefined}
          venueIds={cfg.venueIds ? cfg.venueIds.split(',') : undefined}
        />
      </ThemeProvider>
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