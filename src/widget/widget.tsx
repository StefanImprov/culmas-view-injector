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

// Global initialization state with race condition prevention
const initializationState = {
  initializedContainers: new Set<string>(),
  initializingContainers: new Set<string>(),
  isInitializing: false,
  timeouts: new Set<number>(),
  observer: null as MutationObserver | null,
  initCounter: 0
};

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

  // Initialize widget in a container with race condition prevention
  async init(config: WidgetConfig) {
    const initId = ++initializationState.initCounter;
    console.log(`🚀 [Init ${initId}] Starting initialization for container: ${config.container}`);
    
    try {
      // SYNCHRONOUS LOCK: Check if container is already initialized or currently initializing
      if (initializationState.initializedContainers.has(config.container)) {
        console.log(`🚫 [Init ${initId}] Container already initialized, skipping:`, config.container);
        return;
      }
      
      if (initializationState.initializingContainers.has(config.container)) {
        console.log(`🚫 [Init ${initId}] Container already being initialized, skipping:`, config.container);
        return;
      }

      // Check if container already has a rendered widget
      const existingContainer = document.querySelector(config.container);
      if (existingContainer?.querySelector('.culmas-widget-container')) {
        console.log(`🚫 [Init ${initId}] Container already has rendered widget, marking as initialized:`, config.container);
        initializationState.initializedContainers.add(config.container);
        return;
      }

      // IMMEDIATELY add to initializing set and disconnect observer
      initializationState.initializingContainers.add(config.container);
      this.disconnectObserver(); // Prevent MutationObserver from triggering during init
      console.log(`🔒 [Init ${initId}] Container locked for initialization:`, config.container);

      console.log(`🔧 [Init ${initId}] Initializing Culmas Widget with config:`, config);
      
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
      
      // Mark container as initialized and clear locks
      initializationState.initializedContainers.add(config.container);
      initializationState.initializingContainers.delete(config.container);
      this.clearAllTimeouts();
      
      console.log(`✅ [Init ${initId}] Widget initialized successfully for container:`, config.container);
    } catch (error) {
      // CRITICAL: Always release the lock on error
      initializationState.initializingContainers.delete(config.container);
      console.error(`❌ [Init ${initId}] Failed to initialize Culmas Widget:`, error);
      console.error(`❌ [Init ${initId}] Error details:`, {
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

  // Clear all pending timeouts
  private clearAllTimeouts() {
    initializationState.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    initializationState.timeouts.clear();
  }

  // Disconnect MutationObserver
  private disconnectObserver() {
    if (initializationState.observer) {
      initializationState.observer.disconnect();
      initializationState.observer = null;
    }
  }

  // Destroy widget instance
  destroy(container: string) {
    const root = this.mountedInstances.get(container);
    if (root) {
      root.unmount();
      this.mountedInstances.delete(container);
      initializationState.initializedContainers.delete(container);
    }
  }
}

// Enhanced auto-initialization with race condition prevention
function autoInit() {
  const autoInitId = ++initializationState.initCounter;
  console.log(`🔍 [AutoInit ${autoInitId}] Starting auto-initialization check...`);
  
  try {
    // Prevent concurrent global initialization
    if (initializationState.isInitializing) {
      console.log(`🚫 [AutoInit ${autoInitId}] Global initialization already in progress, skipping`);
      return;
    }
    
    initializationState.isInitializing = true;

    // Enhanced environment detection
    const isWebflow = !!document.querySelector('[data-wf-site]') || 
                     !!document.querySelector('.w-webflow-badge') ||
                     !!(window as any).Webflow;
    
    const isWebflowDesigner = !!(window as any).Webflow && (window.location.hostname.includes('webflow.io'));
    
    console.log(`🔍 [AutoInit ${autoInitId}] Enhanced auto-initialization...`, {
      isWebflow,
      isWebflowDesigner,
      userAgent: navigator.userAgent.substring(0, 100),
      domReady: document.readyState,
      hasWebflowCSS: !!document.querySelector('link[href*="webflow"]'),
      webflowVersion: (window as any).Webflow?.version,
      initializedContainers: Array.from(initializationState.initializedContainers),
      initializingContainers: Array.from(initializationState.initializingContainers)
    });
    
    // Don't initialize in Webflow Designer
    if (isWebflowDesigner) {
      console.log('🚫 Webflow Designer detected - skipping initialization');
      initializationState.isInitializing = false;
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
          // Skip if container already initialized or currently initializing
          if (initializationState.initializedContainers.has(container)) {
            console.log(`🚫 [AutoInit ${autoInitId}] Container already initialized, skipping:`, container);
            return;
          }
          
          if (initializationState.initializingContainers.has(container)) {
            console.log(`🚫 [AutoInit ${autoInitId}] Container already being initialized, skipping:`, container);
            return;
          }
          
          console.log(`🚀 [AutoInit ${autoInitId}] Initializing widget for container: ${container}`);
          const widget = new CulmasWidget();
          widget.init({
            container,
            apiUrl: apiUrl || undefined,
            templateIds,
            venueIds,
            theme
          });
        } else {
          console.error(`❌ [AutoInit ${autoInitId}] No container specified in script attributes`);
        }
      } catch (error) {
        console.error(`❌ Error processing script ${index + 1}:`, error);
      }
    });
  } catch (error) {
    console.error(`❌ [AutoInit ${autoInitId}] Critical error in autoInit:`, error);
  } finally {
    initializationState.isInitializing = false;
    console.log(`🏁 [AutoInit ${autoInitId}] Auto-initialization completed`);
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
  
  // Only add fallbacks if no widgets initialized or being initialized
  if (initializationState.initializedContainers.size === 0 && initializationState.initializingContainers.size === 0) {
    // Reduced and simplified fallback timing
    const fallbackDelay = isWebflow ? 2000 : 1000;
    
    const timeoutId = setTimeout(() => {
      // Only initialize if no widgets exist yet and none are being initialized
      if (initializationState.initializedContainers.size === 0 && initializationState.initializingContainers.size === 0) {
        console.log(`🔄 Fallback initialization attempt after ${fallbackDelay}ms`);
        autoInit();
      } else {
        console.log('🚫 Fallback cancelled - widgets already exist or initializing');
      }
      initializationState.timeouts.delete(timeoutId);
    }, fallbackDelay) as unknown as number;
    
    initializationState.timeouts.add(timeoutId);
    
    // Simplified MutationObserver - only observe if NO widgets exist at all
    const hasAnyWidgets = initializationState.initializedContainers.size > 0 || 
                         initializationState.initializingContainers.size > 0 ||
                         document.querySelectorAll('.culmas-widget-container').length > 0;
    
    if (!hasAnyWidgets && !initializationState.observer) {
      console.log('🔍 Setting up MutationObserver for new widget detection');
      initializationState.observer = new MutationObserver(() => {
        // Only trigger if new widget scripts are added and no widgets exist yet
        const widgets = document.querySelectorAll('script[data-culmas-widget]');
        const currentWidgets = initializationState.initializedContainers.size + 
                             initializationState.initializingContainers.size +
                             document.querySelectorAll('.culmas-widget-container').length;
        
        if (widgets.length > 0 && currentWidgets === 0) {
          console.log('🔄 New widget scripts detected in DOM, triggering initialization...');
          autoInit();
        }
      });
      
      initializationState.observer.observe(document, {
        childList: true,
        subtree: true
      });
      
      // Auto-disconnect observer after 15 seconds if no widgets initialized
      const observerTimeoutId = setTimeout(() => {
        if (initializationState.observer && initializationState.initializedContainers.size === 0) {
          console.log('🚫 MutationObserver auto-disconnect after 15s');
          initializationState.observer.disconnect();
          initializationState.observer = null;
        }
        initializationState.timeouts.delete(observerTimeoutId);
      }, 15000) as unknown as number;
      initializationState.timeouts.add(observerTimeoutId);
    }
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
    // Only initialize if no widgets exist yet
    if (initializationState.initializedContainers.size === 0) {
      console.log('🌊 Webflow ready callback triggered');
      autoInit();
    }
  });
}

// Export for manual initialization and debugging
(window as any).CulmasWidget = CulmasWidget;
(window as any).initCulmasWidget = manualInit;
(window as any).debugCulmasWidget = enableDebugMode;

export default CulmasWidget;