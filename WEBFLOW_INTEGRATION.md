# Culmas Widget - Webflow Integration Guide

## Quick Setup for Webflow

### 1. Script Placement (Recommended: Head Section)

Add this script to your Webflow site's **Head** section in Project Settings > Custom Code:

```html
<script src="https://your-widget-url.com/widget.js" defer></script>
```

### 2. Widget Container

In your Webflow page, add a **Div Block** where you want the widget to appear and give it a unique ID or class:

```html
<div id="culmas-products"></div>
```

### 3. Widget Configuration Script

Add this configuration script to the **Before </body> tag** section:

```html
<script data-culmas-widget 
        data-container="#culmas-products"
        data-api-url="https://api.dev.culmas.io/"
        data-template-ids="template1,template2"
        data-venue-ids="venue1,venue2"
        data-theme='{"colors":{"primary":"262 83% 58%","secondary":"210 40% 96%"}}'>
</script>
```

## Alternative Setup Methods

### Manual Initialization (If Auto-Init Fails)

If the automatic initialization doesn't work, you can manually initialize the widget:

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  if (window.initCulmasWidget) {
    window.initCulmasWidget({
      container: '#culmas-products',
      apiUrl: 'https://api.dev.culmas.io/',
      templateIds: ['template1', 'template2'],
      venueIds: ['venue1', 'venue2'],
      theme: {
        colors: {
          primary: '262 83% 58%',
          secondary: '210 40% 96%'
        }
      }
    });
  }
});
</script>
```

### Debug Mode (For Troubleshooting)

Enable debug mode to see detailed logs:

```html
<script>
if (window.debugCulmasWidget) {
  window.debugCulmasWidget();
}
</script>
```

## Styling Integration

### Option 1: Let the Widget Handle Styling (Recommended)

The widget includes comprehensive CSS that overrides Webflow styles automatically. No additional CSS needed.

### Option 2: Custom Styling Integration

If you want to customize the widget appearance, add this CSS to your Webflow site's custom CSS:

```css
.culmas-widget-container {
  /* Your custom styles here */
  margin: 20px 0;
  border-radius: 12px;
}

.culmas-widget-container .bg-primary {
  background-color: #your-brand-color !important;
}
```

## Common Issues & Solutions

### Widget Not Appearing
1. **Check browser console** for error messages (F12 → Console)
2. **Verify container exists** - Make sure the div with your specified ID/class exists
3. **Check script loading** - Ensure the widget script loads successfully
4. **Try manual initialization** - Use the manual setup method above

### Styling Issues
1. **Webflow CSS conflicts** - The widget uses `!important` declarations to override Webflow styles
2. **Theme not applying** - Check that your theme JSON is valid
3. **Responsive issues** - The widget includes responsive classes that should work with Webflow

### Performance Issues
1. **Load widget script in head** with `defer` attribute for optimal loading
2. **Avoid multiple widget instances** on the same page unless necessary
3. **Use specific container selectors** (IDs preferred over classes)

## Advanced Configuration

### Custom Theme Example
```json
{
  "colors": {
    "primary": "262 83% 58%",
    "primaryGlow": "262 83% 70%",
    "secondary": "210 40% 96%",
    "background": "0 0% 100%",
    "foreground": "222.2 84% 4.9%"
  },
  "design": {
    "borderRadius": "0.75rem",
    "shadowIntensity": "medium",
    "gradients": true,
    "hoverEffects": true
  }
}
```

### Multiple Widgets on One Page
```html
<!-- Widget 1 -->
<div id="products-section-1"></div>
<script data-culmas-widget 
        data-container="#products-section-1"
        data-template-ids="template1">
</script>

<!-- Widget 2 -->
<div id="products-section-2"></div>
<script data-culmas-widget 
        data-container="#products-section-2"
        data-template-ids="template2">
</script>
```

## Webflow-Specific Features

### Responsive Design
The widget automatically adapts to Webflow's responsive breakpoints:
- Desktop: 4 columns
- Tablet: 3 columns  
- Mobile Landscape: 2 columns
- Mobile Portrait: 1 column

### Webflow Interactions Compatibility
The widget is designed to work alongside Webflow interactions and animations without conflicts.

### CMS Integration
You can dynamically set widget parameters using Webflow CMS:
```html
{% raw %}
<script data-culmas-widget 
        data-container="#products"
        data-venue-ids="{{wf {&quot;path&quot;:&quot;venue-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}">
</script>
{% endraw %}
```

## Support

If you encounter issues:
1. Enable debug mode and check console logs
2. Verify your Webflow site is published
3. Test with manual initialization
4. Contact support with console logs and site URL

## Version Compatibility

- **Webflow**: All current Webflow plans and templates
- **Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet