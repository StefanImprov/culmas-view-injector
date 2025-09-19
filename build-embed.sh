#!/bin/bash
echo "Building embed widget..."
vite build --config vite.widget.config.ts
echo "Embed build complete! Check dist/embed/"