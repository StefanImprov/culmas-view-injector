# Culmas Widget Embed System

## Overview

This embed system creates an isolated Shadow DOM widget that can be embedded into any website without CSS conflicts. The widget includes all the functionality from the Landing page's ProductInjector component.

## Build the Embed

```bash
# Build the embed widget
chmod +x build-embed.sh
./build-embed.sh
```

This creates `dist/embed/culmas-embed.js` - a self-contained JavaScript file.

## Usage

### Simple One-Line Embed

```html
<!-- Container on the host page -->
<div id="culmas-products"></div>

<!-- One-line embed -->
<script
  defer
  src="https://stefanimprov.github.io/culmas-view-injector/dist/embed/culmas-embed.js?v=1"
  data-culmas-widget="true"
  data-container="#culmas-products"
  data-api-url="https://api.dev.culmas.io/"
  data-template-ids="DdBMJDXGaxogjGXphbtr,53t5VHU3oieVWGKAXGYZ"
  data-venue-ids="74ZQFVRV9I9wk9d94QE3,2zwDwfhAqS93V9uNr8Mb"
  data-theme='{"id":"modern-purple","style":"modern","colors":{"primary":"262 83% 58%","primaryForeground":"210 40% 98%","primaryGlow":"262 83% 70%","gradientPrimary":"262 83% 65%","accent":"210 40% 96%","background":"0 0% 100%","foreground":"222.2 84% 4.9%"},"design":{"borderRadius":"0.75rem","shadowIntensity":"medium","hoverEffects":true,"gradients":true}}'
></script>
```

**No `<link>` tag needed** — the embed automatically injects `index.css` inside the shadow DOM for complete style isolation.

### Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-container` | CSS selector for mount point | `#culmas-products` |
| `data-api-url` | GraphQL API endpoint | (required) |
| `data-template-ids` | Comma-separated template IDs | (optional) |
| `data-venue-ids` | Comma-separated venue IDs | (optional) |
| `data-theme` | JSON theme configuration | (optional) |

### Theme Configuration

```html
<script 
    data-culmas-widget="true"
    data-container="#my-events"
    data-api-url="https://api.dev.culmas.io/"
    data-theme='{"name":"vibrant-orange","style":"vibrant","colors":{"primary":"25 95% 53%","accent":"34 89% 52%"}}'
    src="./dist/embed/culmas-embed.umd.js">
</script>
```

## Shadow DOM Isolation

- **CSS Isolation**: Host styles cannot affect the widget
- **No Global Impact**: Widget styles don't leak to the host site
- **Radix Portals**: Dialogs and tooltips remain properly styled within the shadow
- **Self-Contained**: All dependencies bundled in the single JavaScript file

## Multiple Widgets

You can embed multiple widgets on the same page by using different containers:

```html
<div id="events-widget-1"></div>
<div id="events-widget-2"></div>

<script data-culmas-widget="true" data-container="#events-widget-1" data-api-url="..." src="..."></script>
<script data-culmas-widget="true" data-container="#events-widget-2" data-api-url="..." src="..."></script>
```