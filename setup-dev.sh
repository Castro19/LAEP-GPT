#!/bin/bash

# PolyLink Developer Setup Script
echo "🚀 Setting up PolyLink development environment..."

# Check if VSCode is installed
if ! command -v code &> /dev/null; then
    echo "❌ VSCode is not installed. Please install VSCode first: https://code.visualstudio.com/"
    exit 1
fi

# Function to install an extension if not already installed
install_extension() {
    local extension_id=$1
    local extension_name=$2
    
    echo "📦 Checking extension: $extension_name..."
    
    # Check if extension is already installed
    if code --list-extensions | grep -q "^$extension_id$"; then
        echo "✅ $extension_name is already installed."
    else
        echo "📥 Installing $extension_name..."
        # Try to install with --force to bypass signature verification
        if code --install-extension "$extension_id" --force; then
            echo "✅ Successfully installed $extension_name."
        else
            echo "⚠️ Failed to install $extension_name automatically."
            echo "   Please install it manually from the VSCode marketplace:"
            echo "   https://marketplace.visualstudio.com/items?itemName=$extension_id"
        fi
    fi
}

# Install recommended VSCode extensions
echo "📦 Installing recommended VSCode extensions..."
install_extension "dbaeumer.vscode-eslint" "ESLint"
install_extension "esbenp.prettier-vscode" "Prettier"
install_extension "ms-vscode.vscode-typescript-next" "TypeScript Next"
install_extension "eamodio.gitlens" "GitLens"

# Install dependencies
echo "📦 Installing project dependencies..."
if [ -f "package.json" ]; then
    npm install || echo "⚠️ 'npm install' failed. Please check your Node.js installation."
else
    echo "⚠️ package.json not found in the current directory."
    echo "   Please make sure you're in the root directory of the project."
fi

# Build shared package
echo "🔨 Building shared package..."
if [ -d "packages/shared" ]; then
    cd packages/shared
    npm run build || echo "⚠️ Failed to build shared package. Please check for errors."
    cd ../..
else
    echo "⚠️ 'packages/shared' directory not found. Skipping shared package build."
fi

# Run ESLint to verify setup
echo "🔍 Running ESLint to verify setup..."
if [ -d "packages/server" ]; then
    cd packages/server
    npm run lint || echo "⚠️ ESLint check failed. Please fix any issues."
    cd ../..
else
    echo "⚠️ 'packages/server' directory not found. Skipping ESLint check."
fi

echo "✅ Setup complete! You can now start developing with:"
echo "npm run dev"
echo ""
echo "If you encounter any issues with ESLint warnings not appearing in VSCode,"
echo "try restarting VSCode and running 'npm run lint' in the server directory."
echo ""
echo "Note: Some extensions may need to be installed manually if automatic installation failed."
echo "You can find them in the VSCode marketplace: https://marketplace.visualstudio.com/" 