import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ProductInjector } from '@/components/ProductInjector';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Dynamic CSS injection to ensure load order after Webflow
function injectWidgetStyles() {
  const existingLink = document.querySelector('link[data-culmas-widget-css]');
  if (existingLink) return; // Already injected

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://stefanimprov.github.io/culmas-view-injector/widget/culmas-widget.css';
  link.setAttribute('data-culmas-widget-css', 'true');
  
  // Add error handling
  link.onerror = () => {
    console.warn('Failed to load Culmas widget CSS from CDN');
  };
  
  // Append to head to ensure it loads after existing CSS
  document.head.appendChild(link);
}

interface WidgetConfig {
  container: string;
  templateIds?: number[];
  venueIds?: number[];
  apiUrl?: string;
  theme?: any;
}

class CulmasWidget {
  private static instances = new Map<string, any>();
  private static queryClient = new QueryClient();

  static init(config: WidgetConfig) {
    // Inject CSS dynamically to ensure proper load order
    injectWidgetStyles();
    
    const container = document.querySelector(config.container);
    if (!container) {
      console.error(`Container ${config.container} not found`);
      return;
    }

    // Clean up existing instance
    if (this.instances.has(config.container)) {
      this.destroy(config.container);
    }

    const WidgetApp = () => (
      <QueryClientProvider client={this.queryClient}>
        <TooltipProvider>
          <ThemeProvider initialTheme={config.theme} widgetMode={true}>
            <div 
              id={config.container.replace('#', '')}
              className="culmas-widget-container" 
              data-culmas-widget-instance="true"
            >
              <ProductInjector
                templateIds={config.templateIds?.map(String)}
                venueIds={config.venueIds?.map(String)}
                apiUrl={config.apiUrl}
                theme={config.theme}
              />
            </div>
            <Toaster />
            <Sonner />
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );

    const root = createRoot(container);
    root.render(<WidgetApp />);
    this.instances.set(config.container, root);
  }

  static destroy(container: string) {
    const root = this.instances.get(container);
    if (root) {
      root.unmount();
      this.instances.delete(container);
    }
  }
}

// Auto-initialization
function autoInit() {
  const scripts = document.querySelectorAll('script[data-culmas-widget="true"]');
  
  scripts.forEach((script) => {
    const container = script.getAttribute('data-container');
    const templateIds = script.getAttribute('data-template-ids')?.split(',').map(Number);
    const venueIds = script.getAttribute('data-venue-ids')?.split(',').map(Number);
    const apiUrl = script.getAttribute('data-api-url');
    const themeData = script.getAttribute('data-theme');
    
    let theme;
    if (themeData) {
      try {
        theme = JSON.parse(themeData);
      } catch (e) {
        console.warn('Invalid theme data:', e);
      }
    }

    if (container) {
      CulmasWidget.init({
        container,
        templateIds,
        venueIds,
        apiUrl,
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

// Global exports
(window as any).CulmasWidget = CulmasWidget;