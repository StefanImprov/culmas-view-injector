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
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
  widgetMode?: boolean;
  /** NEW: when in widget mode, apply vars/classes here (e.g. shadow mount) */
  rootEl?: HTMLElement | null;
}

export const ThemeProvider = ({ children, initialTheme, widgetMode = false, rootEl }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(initialTheme || defaultThemes[0]);

  const applyThemeTo = (target: HTMLElement | null, selectedTheme: Theme) => {
    if (!target) return;

    // colors → CSS vars
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      target.style.setProperty(`--${cssVarName}`, String(value));
    });

    // design tokens
    target.style.setProperty('--radius', selectedTheme.design.borderRadius);

    // Essential base CSS variables for modal components
    target.style.setProperty('--background', String(selectedTheme.colors.background));
    target.style.setProperty('--foreground', String(selectedTheme.colors.foreground));
    target.style.setProperty('--card', String(selectedTheme.colors.card));
    target.style.setProperty('--card-foreground', String(selectedTheme.colors.cardForeground));
    target.style.setProperty('--border', String(selectedTheme.colors.border));
    target.style.setProperty('--ring', String(selectedTheme.colors.primary));

    // style class (theme-modern / theme-classic / etc.)
    target.className = target.className.replace(/theme-\w+/g, '').trim();
    target.classList.add(`theme-${selectedTheme.style}`);

    // shadow intensity
    const s = selectedTheme.design.shadowIntensity;
    if (s === 'subtle') {
      target.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
      target.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1)');
      target.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1)');
      target.style.setProperty('--shadow-glow', '0 0 20px hsl(var(--primary-glow) / 0.2)');
    } else if (s === 'medium') {
      target.style.setProperty('--shadow-sm', '0 1px 3px 0 rgb(0 0 0 / 0.1)');
      target.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)');
      target.style.setProperty('--shadow-lg', '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)');
      target.style.setProperty('--shadow-glow', '0 0 30px hsl(var(--primary-glow) / 0.3)');
    } else if (s === 'strong') {
      target.style.setProperty('--shadow-sm', '0 2px 4px 0 rgb(0 0 0 / 0.1)');
      target.style.setProperty('--shadow-md', '0 8px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)');
      target.style.setProperty('--shadow-lg', '0 25px 50px -12px rgb(0 0 0 / 0.25)');
      target.style.setProperty('--shadow-glow', '0 0 40px hsl(var(--primary-glow) / 0.4)');
    }

    // gradients / transitions
    if (selectedTheme.design.gradients) {
      target.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${selectedTheme.colors.primary}), hsl(${selectedTheme.colors.gradientPrimary}))`);
      target.style.setProperty('--gradient-hero', `linear-gradient(135deg, hsl(${selectedTheme.colors.primary}), hsl(${selectedTheme.colors.gradientPrimary}), hsl(${selectedTheme.colors.accent}))`);
    } else {
      target.style.setProperty('--gradient-primary', `hsl(${selectedTheme.colors.primary})`);
      target.style.setProperty('--gradient-hero', `hsl(${selectedTheme.colors.primary})`);
    }
    target.style.setProperty('--transition-smooth', selectedTheme.design.hoverEffects ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.15s ease');
  };

  useEffect(() => {
    const globalRoot = document.documentElement;
    if (widgetMode) {
      applyThemeTo(rootEl || null, theme);
      // Also apply to the shadow root if it exists
      if (rootEl?.parentElement?.shadowRoot) {
        applyThemeTo(rootEl.parentElement.shadowRoot as unknown as HTMLElement, theme);
      }
    } else {
      applyThemeTo(globalRoot, theme);
    }
  }, [theme, widgetMode, rootEl]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    const globalRoot = document.documentElement;
    if (widgetMode) {
      applyThemeTo(rootEl || null, newTheme);
      // Also apply to the shadow root if it exists
      if (rootEl?.parentElement?.shadowRoot) {
        applyThemeTo(rootEl.parentElement.shadowRoot as unknown as HTMLElement, newTheme);
      }
    } else {
      applyThemeTo(globalRoot, newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, availableThemes: defaultThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};