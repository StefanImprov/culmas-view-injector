#!/bin/bash
echo "🏗️  Testing Widget Build Process..."
echo

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/widget/
echo

# Build widget
echo "🔨 Building widget..."
npx vite build --config vite.widget.config.ts
echo

# Verify files
echo "🔍 Verifying generated files..."
if [ -f "dist/widget/culmas-widget.js" ]; then
    echo "✅ culmas-widget.js generated successfully"
    echo "   Size: $(wc -c < dist/widget/culmas-widget.js) bytes"
else
    echo "❌ culmas-widget.js NOT found"
fi

if [ -f "dist/widget/culmas-widget.css" ]; then
    echo "✅ culmas-widget.css generated successfully" 
    echo "   Size: $(wc -c < dist/widget/culmas-widget.css) bytes"
else
    echo "❌ culmas-widget.css NOT found"
fi

echo
echo "📁 Contents of dist/widget/:"
ls -la dist/widget/ 2>/dev/null || echo "   Directory not found"

echo
echo "🎉 Widget build test complete!"