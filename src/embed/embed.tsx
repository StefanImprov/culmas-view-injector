import "@/index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProductInjector } from "@/components/ProductInjector";
import { Theme, defaultThemes } from "@/types/theme";
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

function ensureCssInShadow(shadow: ShadowRoot, _href: string) {
  const id = "culmas-css-shadow";
  const existing = shadow.querySelector<HTMLStyleElement>(`style#${id}`);
  if (existing) return existing;
  
  // Create style element and inject CSS directly
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    /* Base Tailwind styles */
    *, ::before, ::after {
      --tw-border-spacing-x: 0;
      --tw-border-spacing-y: 0;
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-rotate: 0;
      --tw-skew-x: 0;
      --tw-skew-y: 0;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-pan-x: ;
      --tw-pan-y: ;
      --tw-pinch-zoom: ;
      --tw-scroll-snap-strictness: proximity;
      --tw-gradient-from-position: ;
      --tw-gradient-via-position: ;
      --tw-gradient-to-position: ;
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      --tw-gradient-to: rgb(255 255 255 / 0);
      --tw-gradient-from: rgb(255 255 255 / 0);
      --tw-gradient-to: rgb(255 255 255 / 0);
      --tw-ordinal: ;
      --tw-slashed-zero: ;
      --tw-numeric-figure: ;
      --tw-numeric-spacing: ;
      --tw-numeric-fraction: ;
      --tw-ring-inset: ;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-color: rgb(59 130 246 / 0.5);
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-ring-shadow: 0 0 #0000;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-colored: 0 0 #0000;
      --tw-blur: ;
      --tw-brightness: ;
      --tw-contrast: ;
      --tw-grayscale: ;
      --tw-hue-rotate: ;
      --tw-invert: ;
      --tw-saturate: ;
      --tw-sepia: ;
      --tw-drop-shadow: ;
      --tw-backdrop-blur: ;
      --tw-backdrop-brightness: ;
      --tw-backdrop-contrast: ;
      --tw-backdrop-grayscale: ;
      --tw-backdrop-hue-rotate: ;
      --tw-backdrop-invert: ;
      --tw-backdrop-opacity: ;
      --tw-backdrop-saturate: ;
      --tw-backdrop-sepia: ;
    }
    
    .culmas-widget-container {
      /* CSS variables for theming */
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 262 83% 58%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96%;
      --secondary-foreground: 222.2 84% 4.9%;
      --muted: 210 40% 96%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96%;
      --accent-foreground: 222.2 84% 4.9%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 262 83% 58%;
      --radius: 0.5rem;
      
      /* Font and base styles */
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      tab-size: 4;
      color: hsl(var(--foreground));
      background-color: hsl(var(--background));
    }
    
    /* Utility classes */
    .fixed { position: fixed !important; }
    .absolute { position: absolute !important; }
    .relative { position: relative !important; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .left-\\[50\\%\\] { left: 50%; }
    .top-\\[50\\%\\] { top: 50%; }
    .right-4 { right: 1rem; }
    .top-4 { top: 1rem; }
    .z-50 { z-index: 50; }
    .grid { display: grid; }
    .w-full { width: 100%; }
    .max-w-lg { max-width: 32rem; }
    .max-w-2xl { max-width: 42rem; }
    .translate-x-\\[-50\\%\\] { transform: translateX(-50%); }
    .translate-y-\\[-50\\%\\] { transform: translateY(-50%); }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .space-x-3 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.75rem; }
    .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
    .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-sm { border-radius: 0.125rem; }
    .border { border-width: 1px; border-color: hsl(var(--border)); }
    .p-6 { padding: 1.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .pt-4 { padding-top: 1rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .leading-none { line-height: 1; }
    .leading-relaxed { line-height: 1.625; }
    .tracking-tight { letter-spacing: -0.025em; }
    .opacity-70 { opacity: 0.7; }
    .transition-opacity { transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1); }
    .transition-all { transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); }
    .duration-200 { transition-duration: 200ms; }
    .duration-300 { transition-duration: 300ms; }
    
    /* Color utilities */
    .bg-background { background-color: hsl(var(--background)) !important; }
    .bg-black\\/80 { background-color: rgb(0 0 0 / 0.8) !important; }
    .text-foreground { color: hsl(var(--foreground)) !important; }
    .text-muted-foreground { color: hsl(var(--muted-foreground)) !important; }
    .text-primary { color: hsl(var(--primary)) !important; }
    .bg-primary { background-color: hsl(var(--primary)) !important; }
    .text-white { color: rgb(255 255 255) !important; }
    .bg-accent { background-color: hsl(var(--accent)) !important; }
    .text-accent-foreground { color: hsl(var(--accent-foreground)) !important; }
    .bg-green-100 { background-color: rgb(220 252 231) !important; }
    .text-green-800 { color: rgb(22 101 52) !important; }
    .bg-red-100 { background-color: rgb(254 226 226) !important; }
    .text-red-800 { color: rgb(153 27 27) !important; }
    
    /* Interactive states */
    .hover\\:opacity-100:hover { opacity: 1; }
    .hover\\:scale-105:hover { transform: scale(1.05); }
    .hover\\:shadow-glow:hover { box-shadow: 0 0 30px hsl(var(--primary) / 0.3); }
    
    /* Focus states */
    .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
    .focus\\:ring-2:focus { box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
    .focus\\:ring-ring:focus { --tw-ring-color: hsl(var(--ring)); }
    .focus\\:ring-offset-2:focus { --tw-ring-offset-width: 2px; }
    
    /* Layout utilities */
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-end { justify-content: flex-end; }
    .text-center { text-align: center; }
    .border-t { border-top-width: 1px; border-top-color: hsl(var(--border)); }
    .rounded-full { border-radius: 9999px; }
    .overflow-hidden { overflow: hidden; }
    .object-cover { object-fit: cover; }
    .transform { transform: var(--tw-transform); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1); }
    
    /* Responsive utilities */
    @media (min-width: 640px) {
      .sm\\:rounded-lg { border-radius: 0.5rem; }
      .sm\\:text-left { text-align: left; }
    }
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    
    /* Animation keyframes */
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(10px); }
    }
    @keyframes zoom-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes zoom-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.95); }
    }
    
    /* Animation utilities */
    .animate-in { animation-fill-mode: forwards; }
    .animate-out { animation-fill-mode: forwards; }
    .fade-in-0 { animation: fade-in 0.15s ease-out; }
    .fade-out-0 { animation: fade-out 0.15s ease-out; }
    .zoom-in-95 { animation: zoom-in 0.15s ease-out; }
    .zoom-out-95 { animation: zoom-out 0.15s ease-out; }
    
    /* Dark mode support */
    .culmas-widget-container.dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
      --card: 222.2 84% 4.9%;
      --card-foreground: 210 40% 98%;
      --popover: 222.2 84% 4.9%;
      --popover-foreground: 210 40% 98%;
      --muted: 217.2 32.6% 17.5%;
      --muted-foreground: 215 20.2% 65.1%;
      --accent: 217.2 32.6% 17.5%;
      --accent-foreground: 210 40% 98%;
      --border: 217.2 32.6% 17.5%;
      --input: 217.2 32.6% 17.5%;
    }
    
    .culmas-widget-container.dark .bg-green-100 { background-color: rgb(20 83 45) !important; }
    .culmas-widget-container.dark .text-green-800 { color: rgb(187 247 208) !important; }
    .culmas-widget-container.dark .bg-red-100 { background-color: rgb(127 29 29) !important; }
    .culmas-widget-container.dark .text-red-800 { color: rgb(252 165 165) !important; }
  `;
  
  shadow.appendChild(style);
  return style;
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
  ensureCssInShadow(shadow, "");

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

  // Render the widget (no routers/toasters/globals)
  const root = createRoot(mount);
  root.render(
    <PortalProvider container={shadow as unknown as HTMLElement}>
      <ThemeProvider widgetMode={true} rootEl={themeContainer as HTMLElement} initialTheme={initialTheme}>
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