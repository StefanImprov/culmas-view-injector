import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  label: string;
  value: string; // HSL string like "262 83% 58%"
  onChange: (value: string) => void;
}

// Convert HSL string to hex for color input
const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v.replace('%', '')));
  const sDecimal = s / 100;
  const lDecimal = l / 100;
  
  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lDecimal - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  
  const red = Math.round((r + m) * 255);
  const green = Math.round((g + m) * 255);
  const blue = Math.round((b + m) * 255);
  
  return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
};

// Convert hex to HSL string
const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hexValue = hslToHex(value);

  const handleColorChange = (newHex: string) => {
    const hslValue = hexToHsl(newHex);
    onChange(hslValue);
  };

  const handleInputChange = (newHsl: string) => {
    // Validate HSL format
    const hslRegex = /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/;
    if (hslRegex.test(newHsl.trim())) {
      onChange(newHsl.trim());
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-12 h-8 p-0 border"
              style={{ backgroundColor: `hsl(${value})` }}
            >
              <span className="sr-only">Pick {label} color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Color Picker</Label>
                <input
                  type="color"
                  value={hexValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-12 rounded border cursor-pointer"
                />
              </div>
              
              <div>
                <Label className="text-sm">HSL Value</Label>
                <Input
                  value={value}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="262 83% 58%"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: hue saturation% lightness%
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex-1 min-w-0">
          <Input
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="262 83% 58%"
            className="font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};