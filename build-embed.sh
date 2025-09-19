#!/bin/bash
echo "Building embed widget..."
vite build --config vite.embed.config.ts
echo "Embed build complete! Check dist/embed/"