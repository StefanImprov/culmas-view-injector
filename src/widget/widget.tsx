// Add immediate script loading detection
console.log('🚀 Culmas Widget script loaded successfully');
console.log('🌐 Environment check:', {
  userAgent: navigator.userAgent,
  isWebflow: document.querySelector('[data-wf-site]') !== null,
  domReady: document.readyState
});

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
    console.log('🎨 Applying widget theme:', theme);
    
    if (!theme?.colors) {
      console.warn('No theme colors provided');
      return;
    }

    // Apply color variables with widget prefix
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const fullVarName = `--cw-${cssVarName}`;
      console.log(`Setting ${fullVarName}: ${value}`);
      container.style.setProperty(fullVarName, value as string);
    });
    
    // Apply design variables
    if (theme.design) {
      console.log('🔧 Applying design settings:', theme.design);
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
        const gradientValue = `linear-gradient(135deg, hsl(${primary}), hsl(${gradientPrimary}))`;
        console.log('Setting gradient:', gradientValue);
        container.style.setProperty('--cw-gradient-primary', gradientValue);
      } else {
        container.style.setProperty('--cw-gradient-primary', `hsl(${theme.colors.primary})`);
      }
      
      // Apply transitions
      if (theme.design.hoverEffects) {
        container.style.setProperty('--cw-transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
      } else {
        container.style.setProperty('--cw-transition-smooth', 'all 0.15s ease');
      }
    }

    // Debug: Show all applied CSS variables
    console.log('🎯 Final computed styles:', {
      primary: getComputedStyle(container).getPropertyValue('--cw-primary'),
      secondary: getComputedStyle(container).getPropertyValue('--cw-secondary'),
      background: getComputedStyle(container).getPropertyValue('--cw-background'),
      accent: getComputedStyle(container).getPropertyValue('--cw-accent')
    });
  }

  // Initialize widget in a container with error boundaries
  init(config: WidgetConfig) {
    try {
      console.log('🔧 Initializing Culmas Widget with config:', config);
      
      const container = document.querySelector(config.container);
      if (!container) {
        console.error(`CulmasWidget: Container ${config.container} not found`);
        console.log('Available containers:', document.querySelectorAll('[id], [class]'));
        return;
      }

      console.log('✅ Container found:', container);

      // Create scoped container with widget prefix
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'culmas-widget-container';
      
      // Add Webflow-safe attributes
      widgetContainer.setAttribute('data-culmas-widget-instance', 'true');
      widgetContainer.style.position = 'relative';
      widgetContainer.style.zIndex = '1';
      
      container.appendChild(widgetContainer);

      // Apply theme to widget container
      if (config.theme) {
        console.log('🎨 Theme provided, applying...');
        this.applyWidgetTheme(widgetContainer, config.theme);
      } else {
        console.warn('⚠️ No theme provided');
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
      
      console.log('✅ Widget initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Culmas Widget:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        config
      });
    }
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

// Auto-initialize from script tag data attributes with Webflow compatibility
function autoInit() {
  try {
    console.log('🔍 Starting auto-initialization...');
    const scripts = document.querySelectorAll('script[data-culmas-widget]');
    console.log('📜 Found scripts with data-culmas-widget:', scripts.length);
    
    if (scripts.length === 0) {
      console.warn('⚠️ No scripts found with data-culmas-widget attribute');
      console.log('Available scripts:', document.querySelectorAll('script'));
    }
    
    scripts.forEach((script, index) => {
      try {
        console.log(`🔧 Processing script ${index + 1}:`, script);
        
        const container = script.getAttribute('data-container');
        const apiUrl = script.getAttribute('data-api-url');
        const templateIds = script.getAttribute('data-template-ids')?.split(',');
        const venueIds = script.getAttribute('data-venue-ids')?.split(',');
        const themeData = script.getAttribute('data-theme');
        
        console.log('📋 Script attributes:', {
          container,
          apiUrl,
          templateIds,
          venueIds,
          themeData
        });
        
        let theme;
        if (themeData) {
          try {
            theme = JSON.parse(themeData);
            console.log('🎨 Parsed theme:', theme);
          } catch (e) {
            console.error('❌ Invalid theme data:', e);
          }
        }

        if (container) {
          console.log(`🚀 Initializing widget for container: ${container}`);
          const widget = new CulmasWidget();
          widget.init({
            container,
            apiUrl: apiUrl || undefined,
            templateIds,
            venueIds,
            theme
          });
        } else {
          console.error('❌ No container specified in script attributes');
        }
      } catch (error) {
        console.error(`❌ Error processing script ${index + 1}:`, error);
      }
    });
  } catch (error) {
    console.error('❌ Critical error in autoInit:', error);
  }
}

// Manual initialization method for Webflow environments
function manualInit(config: WidgetConfig) {
  console.log('🔧 Manual initialization called with config:', config);
  try {
    const widget = new CulmasWidget();
    widget.init(config);
    return widget;
  } catch (error) {
    console.error('❌ Manual initialization failed:', error);
    return null;
  }
}

// Initialize when DOM is ready with multiple fallbacks for Webflow
console.log('📄 Document ready state:', document.readyState);

function safeInit() {
  console.log('🔄 Running safe initialization...');
  autoInit();
  
  // Additional fallback for Webflow environments
  setTimeout(() => {
    console.log('⏰ Fallback initialization after 1 second...');
    autoInit();
  }, 1000);
  
  // Final fallback
  setTimeout(() => {
    console.log('⏰ Final fallback initialization after 3 seconds...');
    autoInit();
  }, 3000);
}

if (document.readyState === 'loading') {
  console.log('⏳ Document still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  console.log('✅ Document already ready, initializing immediately...');
  safeInit();
}

// Additional Webflow-specific initialization
if ((window as any).Webflow) {
  console.log('🌊 Webflow detected, adding Webflow-specific initialization...');
  (window as any).Webflow.push(() => {
    console.log('🌊 Webflow ready callback triggered');
    autoInit();
  });
}

// Export for manual initialization
(window as any).CulmasWidget = CulmasWidget;
(window as any).initCulmasWidget = manualInit;

export default CulmasWidget;