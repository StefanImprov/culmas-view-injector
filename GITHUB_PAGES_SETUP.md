# GitHub Pages Widget Deployment Setup

## Step 1: Connect to GitHub
1. In Lovable, click **GitHub** → **Connect to GitHub** 
2. Create a new repository for your project

## Step 2: Add Build Script
Since package.json is read-only in Lovable, you need to add this script manually in your GitHub repository:

```json
"scripts": {
  "build:widget": "vite build --config vite.widget.config.ts"
}
```

## Step 3: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** → **Pages** 
3. Set **Source** to "GitHub Actions"

## Step 4: Widget URL
Once deployed, your widget will be available at:
```
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/widget/culmas-widget.js
```

## Step 5: Update Embed Script
Replace your current script URL with the GitHub Pages URL:

```html
<script 
  src="https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/widget/culmas-widget.js"
  data-culmas-widget="true"
  data-container="#culmas-product-container" 
  data-api-url="YOUR_API_URL"
  data-template-ids="YOUR_TEMPLATE_IDS"
  data-venue-ids="YOUR_VENUE_IDS"
  data-theme="YOUR_THEME"
></script>
```

## Automatic Deployment
The GitHub Actions workflow will automatically:
- Build both your main app and widget when you push changes
- Deploy to GitHub Pages 
- Serve with proper MIME types
- Provide CDN-backed hosting

Any changes you make in Lovable will sync to GitHub and trigger automatic redeployment!