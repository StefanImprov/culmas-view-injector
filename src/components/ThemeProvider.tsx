import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, defaultThemes } from '@/types/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
  rootEl?: HTMLElement;
  widgetMode?: boolean;
}

export const ThemeProvider = ({ children, initialTheme, rootEl, widgetMode = false }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(initialTheme || defaultThemes[0]);

  const applyTheme = (selectedTheme: Theme, targetEl?: HTMLElement) => {
    const root = targetEl || rootEl || document.querySelector('#culmas-products') || document.documentElement;
    
    // Apply color variables
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVarName}`, value);
    });
    
    // Apply design variables
    root.style.setProperty('--radius', selectedTheme.design.borderRadius);
    
    // Apply style-specific CSS classes
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${selectedTheme.style}`);
    
    // Apply shadow intensity
    const shadowIntensity = selectedTheme.design.shadowIntensity;
    switch (shadowIntensity) {
      case 'subtle':
        root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
        root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1)');
        root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1)');
        root.style.setProperty('--shadow-glow', '0 0 20px hsl(var(--primary-glow) / 0.2)');
        break;
      case 'medium':
        root.style.setProperty('--shadow-sm', '0 1px 3px 0 rgb(0 0 0 / 0.1)');
        root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)');
        root.style.setProperty('--shadow-lg', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)');
        root.style.setProperty('--shadow-glow', '0 0 30px hsl(var(--primary-glow) / 0.3)');
        break;
      case 'strong':
        root.style.setProperty('--shadow-sm', '0 2px 4px 0 rgb(0 0 0 / 0.1)');
        root.style.setProperty('--shadow-md', '0 8px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)');
        root.style.setProperty('--shadow-lg', '0 25px 50px -12px rgb(0 0 0 / 0.25)');
        root.style.setProperty('--shadow-glow', '0 0 40px hsl(var(--primary-glow) / 0.4)');
        break;
    }
    
    // Apply gradients based on design settings
    if (selectedTheme.design.gradients) {
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${selectedTheme.colors.primary}), hsl(${selectedTheme.colors.gradientPrimary}))`);
      root.style.setProperty('--gradient-hero', `linear-gradient(135deg, hsl(${selectedTheme.colors.primary}), hsl(${selectedTheme.colors.gradientPrimary}), hsl(${selectedTheme.colors.accent}))`);
    } else {
      root.style.setProperty('--gradient-primary', `hsl(${selectedTheme.colors.primary})`);
      root.style.setProperty('--gradient-hero', `hsl(${selectedTheme.colors.primary})`);
    }
    
    // Apply hover effects
    if (selectedTheme.design.hoverEffects) {
      root.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
    } else {
      root.style.setProperty('--transition-smooth', 'all 0.15s ease');
    }
  };

  useEffect(() => {
    // Always apply theme, but to the scoped root in widget mode
    const targetEl = widgetMode ? (rootEl || document.querySelector('#culmas-products')) : undefined;
    applyTheme(theme, targetEl);
  }, [theme, rootEl, widgetMode]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    const targetEl = widgetMode ? (rootEl || document.querySelector('#culmas-products')) : undefined;
    applyTheme(newTheme, targetEl);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        availableThemes: defaultThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};