# Culmas Widget Build Instructions

The Culmas Product Injector now uses a React Widget Bundle approach that ensures perfect compatibility between the Live Preview and embedded versions.

## How It Works

1. **Widget Bundle**: The `ProductInjector` React component and all its dependencies are bundled into a single JavaScript file
2. **Style Isolation**: All CSS is scoped to prevent conflicts with host website styles
3. **Theme Integration**: The selected theme from the Theme Customizer is passed directly to the widget
4. **Full Feature Parity**: All views (Card, List, Calendar, Week) work exactly as in the Live Preview

## Building the Widget

To build the standalone widget bundle:

```bash
# Build the widget using the widget-specific config
npx vite build --config vite.widget.config.ts
```

This will create:
- `dist/widget/culmas-widget.umd.js` - The bundled widget file
- `dist/widget/culmas-widget.css` - The scoped CSS (if needed)

## Deployment

The widget file should be hosted at: `https://cdn.culmas.io/widget/culmas-widget.umd.js`

## Usage

The Embed Script Generator now produces simple widget embed code:

```html
<!-- Culmas Product Widget -->
<div id="culmas-widget"></div>
<script 
  src="https://cdn.culmas.io/widget/culmas-widget.umd.js"
  data-culmas-widget="true"
  data-container="#culmas-widget"
  data-api-url="https://api.dev.culmas.io/"
  data-template-ids="template1,template2"
  data-venue-ids="venue1,venue2"
  data-theme='{"colors":{"primary":"#8b5cf6"}}'
></script>
```

## Benefits

- ✅ **Perfect Design Match**: Embedded widget looks exactly like Live Preview
- ✅ **All Features**: Full Calendar, Week, Card, and List views
- ✅ **Theme Support**: Complete theme customization
- ✅ **Style Isolation**: No conflicts with host website CSS
- ✅ **Interactive Features**: All modals, filtering, and navigation work
- ✅ **Responsive Design**: Mobile and desktop layouts
- ✅ **Easy Integration**: Single script tag with data attributes

## File Structure

```
src/widget/
├── widget.tsx          # Widget entry point and initialization
├── widget-styles.css   # Scoped CSS with prefixed classes
vite.widget.config.ts   # Widget build configuration
```

The widget automatically detects script tags with `data-culmas-widget="true"` and initializes itself with the provided configuration.