import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Download, Eye, RefreshCw } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Theme, DesignStyle } from '@/types/theme';
import { ColorPicker } from '@/components/ColorPicker';
import { cn } from '@/lib/utils';

export const ThemeCustomizer = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleColorChange = (colorKey: keyof typeof theme.colors, newValue: string) => {
    const updatedTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        [colorKey]: newValue
      }
    };
    setTheme(updatedTheme);
    setIsCustomizing(true);
  };

  const resetToOriginal = () => {
    const originalTheme = availableThemes.find(t => t.style === theme.style);
    if (originalTheme) {
      setTheme(originalTheme);
      setIsCustomizing(false);
    }
  };

  const getStyleDescription = (style: DesignStyle) => {
    switch (style) {
      case 'modern':
        return 'Clean minimalist design with subtle gradients and rounded corners';
      case 'classic':
        return 'Traditional styling with sharp edges and solid colors';
      case 'vibrant':
        return 'Bold, energetic design with strong gradients and enhanced effects';
    }
  };

  const generateEmbedCode = (selectedTheme: Theme) => {
    const cssVars = Object.entries(selectedTheme.colors)
      .map(([key, value]) => {
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `    --${cssVarName}: ${value};`;
      })
      .join('\n');

    return `<!-- Culmas Product Injector -->
<div id="culmas-products"></div>
<style>
  :root {
${cssVars}
    --radius: ${selectedTheme.design.borderRadius};
  }
  .culmas-products { 
    font-family: system-ui, -apple-system, sans-serif; 
  }
</style>
<script>
  // Initialize Culmas Product Injector with theme: ${selectedTheme.name}
  window.CulmasProductInjector.init({
    elementId: 'culmas-products',
    theme: '${selectedTheme.id}'
  });
</script>`;
  };

  const downloadEmbedCode = () => {
    const code = generateEmbedCode(theme);
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `culmas-product-injector-${theme.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">Theme Customizer</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Customize the appearance of your product injector to match your school's visual identity. 
          Choose from different design styles and color palettes.
        </p>
      </div>

      {/* Theme Selection */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Design Styles</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {availableThemes.map((themeOption) => (
            <div
              key={themeOption.id}
              className={cn(
                "border-2 rounded-lg p-4 cursor-pointer transition-all duration-200",
                "hover:border-primary/50 hover:shadow-md",
                theme.id === themeOption.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border"
              )}
              onClick={() => {
                setTheme(themeOption);
                setIsCustomizing(false);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{themeOption.name}</h4>
                <Badge 
                  variant={theme.id === themeOption.id ? "default" : "secondary"}
                  className="text-xs"
                >
                  {themeOption.style}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {getStyleDescription(themeOption.style)}
              </p>
              
              {/* Color Preview */}
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: `hsl(${themeOption.colors.primary})` }}
                />
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: `hsl(${themeOption.colors.primaryGlow})` }}
                />
                <div 
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: `hsl(${themeOption.colors.accent})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Current Theme Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            Current Theme: {theme.name}
            {isCustomizing && <Badge variant="secondary" className="ml-2">Customized</Badge>}
          </h3>
          <div className="flex gap-2">
            {isCustomizing && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetToOriginal}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide' : 'Show'} Code
            </Button>
            <Button
              size="sm"
              onClick={downloadEmbedCode}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Code
            </Button>
          </div>
        </div>

        {/* Color Customization */}
        <div className="mb-6">
          <h4 className="font-medium mb-4">Customize Colors</h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ColorPicker
              label="Primary Color"
              value={theme.colors.primary}
              onChange={(value) => handleColorChange('primary', value)}
            />
            <ColorPicker
              label="Secondary Color"
              value={theme.colors.secondary}
              onChange={(value) => handleColorChange('secondary', value)}
            />
            <ColorPicker
              label="Accent Color"
              value={theme.colors.accent}
              onChange={(value) => handleColorChange('accent', value)}
            />
            <ColorPicker
              label="Card Color"
              value={theme.colors.card}
              onChange={(value) => handleColorChange('card', value)}
            />
          </div>
        </div>

        {/* Theme Properties */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Design Properties</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Border Radius: {theme.design.borderRadius}</li>
              <li>Shadow Intensity: {theme.design.shadowIntensity}</li>
              <li>Hover Effects: {theme.design.hoverEffects ? 'Enabled' : 'Disabled'}</li>
              <li>Gradients: {theme.design.gradients ? 'Enabled' : 'Disabled'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Color Palette</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div 
                  className="w-8 h-8 rounded border mx-auto mb-1"
                  style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                />
                <p className="text-xs text-muted-foreground">Primary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-8 h-8 rounded border mx-auto mb-1"
                  style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                />
                <p className="text-xs text-muted-foreground">Secondary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-8 h-8 rounded border mx-auto mb-1"
                  style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                />
                <p className="text-xs text-muted-foreground">Accent</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-8 h-8 rounded border mx-auto mb-1"
                  style={{ backgroundColor: `hsl(${theme.colors.card})` }}
                />
                <p className="text-xs text-muted-foreground">Card</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code Preview */}
        {showPreview && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Embed Code</h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
              {generateEmbedCode(theme)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
};