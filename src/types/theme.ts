export type DesignStyle = 'modern' | 'classic' | 'vibrant';

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  primaryGlow: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
}

export interface ThemeDesign {
  borderRadius: string;
  shadowIntensity: 'subtle' | 'medium' | 'strong';
  hoverEffects: boolean;
  gradients: boolean;
}

export interface Theme {
  id: string;
  name: string;
  style: DesignStyle;
  colors: ThemeColors;
  design: ThemeDesign;
}

export const defaultThemes: Theme[] = [
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    style: 'modern',
    colors: {
      primary: '262 83% 58%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '262 83% 70%',
      secondary: '210 40% 96%',
      secondaryForeground: '222.2 84% 4.9%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      border: '214.3 31.8% 91.4%',
      accent: '210 40% 96%',
      accentForeground: '222.2 84% 4.9%',
      muted: '210 40% 96%',
      mutedForeground: '215.4 16.3% 46.9%',
    },
    design: {
      borderRadius: '0.75rem',
      shadowIntensity: 'medium',
      hoverEffects: true,
      gradients: true,
    }
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    style: 'classic',
    colors: {
      primary: '221 83% 53%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '221 83% 65%',
      secondary: '221 14% 91%',
      secondaryForeground: '221 83% 53%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      border: '221 13% 86%',
      accent: '221 83% 53%',
      accentForeground: '210 40% 98%',
      muted: '221 14% 95%',
      mutedForeground: '221 8% 46%',
    },
    design: {
      borderRadius: '0.375rem',
      shadowIntensity: 'subtle',
      hoverEffects: false,
      gradients: false,
    }
  },
  {
    id: 'vibrant-orange',
    name: 'Vibrant Orange',
    style: 'vibrant',
    colors: {
      primary: '24 95% 53%',
      primaryForeground: '210 40% 98%',
      primaryGlow: '24 95% 65%',
      secondary: '210 40% 96%',
      secondaryForeground: '222.2 84% 4.9%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      border: '214.3 31.8% 91.4%',
      accent: '210 40% 96%',
      accentForeground: '222.2 84% 4.9%',
      muted: '210 40% 96%',
      mutedForeground: '215.4 16.3% 46.9%',
    },
    design: {
      borderRadius: '1rem',
      shadowIntensity: 'strong',
      hoverEffects: true,
      gradients: true,
    }
  }
];