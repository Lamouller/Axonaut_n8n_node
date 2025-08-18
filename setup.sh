#!/bin/bash

# Setup script for n8n-nodes-axonaut development environment

echo "🚀 Setting up n8n-nodes-axonaut development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Project built successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Configure your Axonaut API credentials"
echo "  2. Test locally: npm link"
echo "  3. Link to n8n: npm link n8n-nodes-axonaut (in n8n directory)"
echo "  4. Publish: npm publish --access public"
echo ""
echo "📚 Commands:"
echo "  npm run dev   - Watch and rebuild"
echo "  npm run build - Build project"
echo ""

