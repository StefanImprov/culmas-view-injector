#!/bin/bash
echo "Building Culmas Widget..."
npx vite build --config vite.widget.config.ts
echo "Widget build complete! Files should be in dist/widget/"
ls -la dist/widget/ || echo "Widget dist directory not found"