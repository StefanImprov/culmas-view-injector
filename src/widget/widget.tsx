import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductInjector } from '../components/ProductInjector';
import { ThemeProvider } from '../components/ThemeProvider';
import { Toaster } from '../components/ui/toaster';
import { TooltipProvider } from '../components/ui/tooltip';
import './widget-styles.css';

// Widget configuration interface
interface WidgetConfig {
  container: string;
  apiUrl?: string;
  templateIds?: string[];
  venueIds?: string[];
  theme?: any;
}

// Global widget class
class CulmasWidget {
  private queryClient: QueryClient;
  private mountedInstances: Map<string, any> = new Map();

  constructor() {
    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  }

  // Apply theme to widget container
  private applyWidgetTheme(container: HTMLElement, theme: any) {
    if (!theme?.colors) return;

    // Apply color variables with widget prefix
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      container.style.setProperty(`--cw-${cssVarName}`, value as string);
    });
    
    // Apply design variables
    if (theme.design) {
      container.style.setProperty('--cw-radius', theme.design.borderRadius || '0.75rem');
      
      // Apply shadow intensity
      const shadowIntensity = theme.design.shadowIntensity || 'medium';
      switch (shadowIntensity) {
        case 'subtle':
          container.style.setProperty('--cw-shadow-glow', '0 0 20px hsl(var(--cw-primary-glow) / 0.2)');
          break;
        case 'medium':
          container.style.setProperty('--cw-shadow-glow', '0 0 30px hsl(var(--cw-primary-glow) / 0.3)');
          break;
        case 'strong':
          container.style.setProperty('--cw-shadow-glow', '0 0 40px hsl(var(--cw-primary-glow) / 0.4)');
          break;
      }
      
      // Apply gradients
      if (theme.design.gradients) {
        const primary = theme.colors.primary;
        const gradientPrimary = theme.colors.gradientPrimary || theme.colors.primaryGlow;
        container.style.setProperty('--cw-gradient-primary', 
          `linear-gradient(135deg, hsl(${primary}), hsl(${gradientPrimary}))`);
      } else {
        container.style.setProperty('--cw-gradient-primary', 
          `hsl(${theme.colors.primary})`);
      }
      
      // Apply transitions
      if (theme.design.hoverEffects) {
        container.style.setProperty('--cw-transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
      } else {
        container.style.setProperty('--cw-transition-smooth', 'all 0.15s ease');
      }
    }
  }

  // Initialize widget in a container
  init(config: WidgetConfig) {
    const container = document.querySelector(config.container);
    if (!container) {
      console.error(`CulmasWidget: Container ${config.container} not found`);
      return;
    }

    // Create scoped container with widget prefix
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'culmas-widget-container';
    container.appendChild(widgetContainer);

    // Apply theme to widget container
    if (config.theme) {
      this.applyWidgetTheme(widgetContainer, config.theme);
    }

    const root = createRoot(widgetContainer);
    
    const WidgetApp = () => (
      <QueryClientProvider client={this.queryClient}>
        <TooltipProvider>
          <ProductInjector
            templateIds={config.templateIds}
            venueIds={config.venueIds}
            apiUrl={config.apiUrl}
            className="culmas-widget"
          />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );

    root.render(<WidgetApp />);
    this.mountedInstances.set(config.container, root);
  }

  // Destroy widget instance
  destroy(container: string) {
    const root = this.mountedInstances.get(container);
    if (root) {
      root.unmount();
      this.mountedInstances.delete(container);
    }
  }
}

// Auto-initialize from script tag data attributes
function autoInit() {
  const scripts = document.querySelectorAll('script[data-culmas-widget]');
  
  scripts.forEach((script) => {
    const container = script.getAttribute('data-container');
    const apiUrl = script.getAttribute('data-api-url');
    const templateIds = script.getAttribute('data-template-ids')?.split(',');
    const venueIds = script.getAttribute('data-venue-ids')?.split(',');
    const themeData = script.getAttribute('data-theme');
    
    let theme;
    if (themeData) {
      try {
        theme = JSON.parse(themeData);
      } catch (e) {
        console.warn('CulmasWidget: Invalid theme data');
      }
    }

    if (container) {
      const widget = new CulmasWidget();
      widget.init({
        container,
        apiUrl: apiUrl || undefined,
        templateIds,
        venueIds,
        theme
      });
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

// Export for manual initialization
(window as any).CulmasWidget = CulmasWidget;

export default CulmasWidget;