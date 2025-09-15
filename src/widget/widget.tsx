// Add immediate script loading detection
console.log('🚀 Culmas Widget script loaded successfully');
console.log('🌐 Environment check:', {
  userAgent: navigator.userAgent,
  isWebflow: document.querySelector('[data-wf-site]') !== null,
  domReady: document.readyState
});


// Enhanced CSS Loading Detection with Webflow Support
function ensureCSSLoaded() {
  return new Promise<boolean>((resolve) => {
    console.log('🔍 CSS loading check');
    
    // Create test element
    const testElement = document.createElement('div');
    testElement.className = 'culmas-widget-container bg-primary';
    testElement.setAttribute('data-culmas-widget-instance', 'true');
    testElement.style.position = 'absolute';
    testElement.style.top = '-9999px';
    testElement.style.left = '-9999px';
    testElement.style.visibility = 'hidden';
    testElement.style.pointerEvents = 'none';
    testElement.style.width = '100px';
    testElement.style.height = '100px';
    document.body.appendChild(testElement);
    
    const checkStyles = () => {
      try {
        const styles = getComputedStyle(testElement);
        const bgColor = styles.backgroundColor;
        const hasCorrectBackground = bgColor.includes('149') || 
                                   bgColor.includes('66') || 
                                   bgColor.includes('rgb(149') ||
                                   bgColor.includes('hsl(262');
        
        document.body.removeChild(testElement);
        
        if (hasCorrectBackground) {
          console.log('✅ CSS loaded successfully', { bgColor });
          resolve(true);
        } else {
          console.warn('⚠️ CSS not loaded properly', { bgColor });
          resolve(false);
        }
      } catch (error) {
        console.error('CSS check failed:', error);
        document.body.removeChild(testElement);
        resolve(false);
      }
    };
    
    setTimeout(checkStyles, 100);
  });
}


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

  // Apply theme to widget container using standard CSS variable names
  private applyWidgetTheme(container: HTMLElement, theme: any) {
    console.log('🎨 Applying widget theme:', theme);
    
    if (!theme?.colors) {
      console.warn('No theme colors provided');
      return;
    }

    // Apply color variables with standard names (no prefix) to match ThemeProvider
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      console.log(`Setting --${cssVarName}: ${value}`);
      container.style.setProperty(`--${cssVarName}`, value as string);
    });
    
    // Apply design variables
    if (theme.design) {
      console.log('🔧 Applying design settings:', theme.design);
      container.style.setProperty('--radius', theme.design.borderRadius || '0.75rem');
      
      // Apply shadow intensity
      const shadowIntensity = theme.design.shadowIntensity || 'medium';
      switch (shadowIntensity) {
        case 'subtle':
          container.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
          container.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-glow', '0 0 20px hsl(var(--primary-glow) / 0.2)');
          break;
        case 'medium':
          container.style.setProperty('--shadow-sm', '0 1px 3px 0 rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)');
          container.style.setProperty('--shadow-lg', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)');
          container.style.setProperty('--shadow-glow', '0 0 30px hsl(var(--primary-glow) / 0.3)');
          break;
        case 'strong':
          container.style.setProperty('--shadow-sm', '0 2px 4px 0 rgb(0 0 0 / 0.1)');
          container.style.setProperty('--shadow-md', '0 8px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)');
          container.style.setProperty('--shadow-lg', '0 25px 50px -12px rgb(0 0 0 / 0.25)');
          container.style.setProperty('--shadow-glow', '0 0 40px hsl(var(--primary-glow) / 0.4)');
          break;
      }
      
      // Apply gradients
      if (theme.design.gradients) {
        const primary = theme.colors.primary;
        const gradientPrimary = theme.colors.gradientPrimary || theme.colors.primaryGlow;
        const gradientValue = `linear-gradient(135deg, hsl(${primary}), hsl(${gradientPrimary}))`;
        console.log('Setting gradient:', gradientValue);
        container.style.setProperty('--gradient-primary', gradientValue);
        container.style.setProperty('--gradient-hero', `linear-gradient(135deg, hsl(${primary}), hsl(${gradientPrimary}), hsl(${theme.colors.accent}))`);
      } else {
        container.style.setProperty('--gradient-primary', `hsl(${theme.colors.primary})`);
        container.style.setProperty('--gradient-hero', `hsl(${theme.colors.primary})`);
      }
      
      // Apply transitions
      if (theme.design.hoverEffects) {
        container.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
      } else {
        container.style.setProperty('--transition-smooth', 'all 0.15s ease');
      }
    }

    // Debug: Show all applied CSS variables
    console.log('🎯 Final computed styles:', {
      primary: getComputedStyle(container).getPropertyValue('--primary'),
      secondary: getComputedStyle(container).getPropertyValue('--secondary'),
      background: getComputedStyle(container).getPropertyValue('--background'),
      accent: getComputedStyle(container).getPropertyValue('--accent')
    });
  }

  // Initialize widget in a container with error boundaries
  async init(config: WidgetConfig) {
    try {
      console.log('🔧 Initializing Culmas Widget with config:', config);
      
      // Ensure CSS is loaded before proceeding
      const cssLoaded = await ensureCSSLoaded();
      if (!cssLoaded) {
        console.log('📝 Using fallback CSS injection');
      }
      
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
      
      // Add Webflow-safe attributes and enhanced specificity
      widgetContainer.setAttribute('data-culmas-widget-instance', 'true');
      widgetContainer.setAttribute('data-widget-version', '1.0.0');
      widgetContainer.style.position = 'relative';
      widgetContainer.style.zIndex = '1';
      
      // Apply critical inline styles as fallback
      this.applyInlineStyleFallbacks(widgetContainer);
      
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
              theme={config.theme}
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

  // Apply critical inline styles as absolute fallback
  private applyInlineStyleFallbacks(container: HTMLElement) {
    const fallbackStyles = {
      'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      'line-height': '1.5',
      'color': 'rgb(14, 17, 47)',
      'background-color': 'rgb(255, 255, 255)',
      'box-sizing': 'border-box'
    };
    
    Object.entries(fallbackStyles).forEach(([property, value]) => {
      container.style.setProperty(property, value, 'important');
    });
    
    console.log('🔧 Applied inline style fallbacks');
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

// Enhanced auto-initialization with comprehensive Webflow support
function autoInit() {
  try {
    // Enhanced environment detection
    const isWebflow = !!document.querySelector('[data-wf-site]') || 
                     !!document.querySelector('.w-webflow-badge') ||
                     !!(window as any).Webflow;
    
    const isWebflowDesigner = !!(window as any).Webflow && (window.location.hostname.includes('webflow.io'));
    
    console.log('🔍 Enhanced auto-initialization...', {
      isWebflow,
      isWebflowDesigner,
      userAgent: navigator.userAgent.substring(0, 100),
      domReady: document.readyState,
      hasWebflowCSS: !!document.querySelector('link[href*="webflow"]'),
      webflowVersion: (window as any).Webflow?.version
    });
    
    // Don't initialize in Webflow Designer
    if (isWebflowDesigner) {
      console.log('🚫 Webflow Designer detected - skipping initialization');
      return;
    }
    
    const scripts = document.querySelectorAll('script[data-culmas-widget]');
    console.log('📜 Found scripts with data-culmas-widget:', scripts.length);
    
    if (scripts.length === 0) {
      console.warn('⚠️ No scripts found with data-culmas-widget attribute');
      if (isWebflow) {
        console.log('🌊 Webflow environment - scripts might be loaded differently');
        // Try alternative detection methods for Webflow
        const allScripts = Array.from(document.querySelectorAll('script'));
        const culmasScripts = allScripts.filter(script => 
          script.src?.includes('culmas') || 
          script.textContent?.includes('culmas') ||
          script.textContent?.includes('data-culmas-widget')
        );
        console.log('🔍 Alternative Culmas script detection:', culmasScripts.length);
      }
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

// Enhanced debug mode for troubleshooting
function enableDebugMode() {
  console.log('🔍 Debug mode enabled');
  
  // Log environment details
  console.log('Environment:', {
    userAgent: navigator.userAgent,
    isWebflow: !!document.querySelector('[data-wf-site]'),
    domReady: document.readyState,
    stylesheets: Array.from(document.styleSheets).map(s => s.href),
    scripts: Array.from(document.scripts).map(s => s.src)
  });
  
  // Monitor CSS loading
  const observer = new MutationObserver(() => {
    const widgetContainers = document.querySelectorAll('.culmas-widget-container');
    widgetContainers.forEach(container => {
      const styles = getComputedStyle(container);
      console.log('Widget container styles:', {
        backgroundColor: styles.backgroundColor,
        fontFamily: styles.fontFamily,
        color: styles.color
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Enhanced initialization with comprehensive Webflow support
console.log('📄 Document ready state:', document.readyState);

function safeInit() {
  const isWebflow = !!document.querySelector('[data-wf-site]') || !!(window as any).Webflow;
  console.log('🔄 Running safe initialization...', { isWebflow });
  
  autoInit();
  
  // Enhanced fallback timing for Webflow environments
  const fallbackDelays = isWebflow ? [1000, 2000, 5000] : [500, 1500];
  
  fallbackDelays.forEach((delay, index) => {
    setTimeout(() => {
      console.log(`⏰ Fallback initialization ${index + 1} after ${delay}ms...`);
      autoInit();
    }, delay);
  });
  
  // Additional Webflow-specific fallbacks
  if (isWebflow) {
    // Listen for Webflow interactions completion
    if ((window as any).Webflow) {
      setTimeout(() => {
        console.log('🌊 Webflow interactions loaded fallback...');
        autoInit();
      }, 8000);
    }
    
    // Listen for any dynamic content changes
    const observer = new MutationObserver(() => {
      const widgets = document.querySelectorAll('script[data-culmas-widget]');
      if (widgets.length > 0) {
        console.log('🔄 DOM changes detected, re-initializing...');
        autoInit();
        observer.disconnect();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: false 
    });
    
    // Disconnect observer after 10 seconds
    setTimeout(() => observer.disconnect(), 10000);
  }
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

// Export for manual initialization and debugging
(window as any).CulmasWidget = CulmasWidget;
(window as any).initCulmasWidget = manualInit;
(window as any).debugCulmasWidget = enableDebugMode;

export default CulmasWidget;