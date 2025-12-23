#!/bin/bash

# Setup EAS Secrets for Production Build
# This script will set up all environment variables as EAS secrets

echo "🔐 Setting up EAS Secrets for Production"
echo "=========================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed. Installing now..."
    npm install -g eas-cli
fi

echo "Step 1: Login to EAS"
echo "-------------------"
eas login

echo ""
echo "Step 2: Creating secrets from .env file"
echo "---------------------------------------"

# Read .env file and create secrets
if [ -f ".env" ]; then
    echo "✅ Found .env file"
    echo ""

    # GEMINI_API_KEY
    GEMINI_KEY=$(grep GEMINI_API_KEY .env | cut -d '=' -f2)
    if [ -n "$GEMINI_KEY" ]; then
        echo "Creating GEMINI_API_KEY secret..."
        eas secret:create --scope project --name GEMINI_API_KEY --value "$GEMINI_KEY" --force
    fi

    # NEWS_API_KEY
    NEWS_KEY=$(grep NEWS_API_KEY .env | cut -d '=' -f2)
    if [ -n "$NEWS_KEY" ]; then
        echo "Creating NEWS_API_KEY secret..."
        eas secret:create --scope project --name NEWS_API_KEY --value "$NEWS_KEY" --force
    fi

    # PERPLEXITY_API_KEY
    PERPLEXITY_KEY=$(grep PERPLEXITY_API_KEY .env | cut -d '=' -f2)
    if [ -n "$PERPLEXITY_KEY" ]; then
        echo "Creating PERPLEXITY_API_KEY secret..."
        eas secret:create --scope project --name PERPLEXITY_API_KEY --value "$PERPLEXITY_KEY" --force
    fi

    # GOOGLE_MAPS_API_KEY (if set)
    MAPS_KEY=$(grep GOOGLE_MAPS_API_KEY .env | cut -d '=' -f2)
    if [ -n "$MAPS_KEY" ]; then
        echo "Creating GOOGLE_MAPS_API_KEY secret..."
        eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value "$MAPS_KEY" --force
    else
        echo "⚠️  GOOGLE_MAPS_API_KEY is empty, skipping..."
    fi

    # Production settings
    echo "Creating production environment secrets..."
    eas secret:create --scope project --name USE_MOCK_DATA --value "false" --force

    # API_BASE_URL - you'll need to update this when your backend is deployed
    echo "Creating API_BASE_URL secret..."
    echo "⚠️  Using localhost for now. Update this when backend is deployed!"
    eas secret:create --scope project --name API_BASE_URL --value "http://localhost:3000/api" --force

    echo ""
    echo "✅ All secrets created successfully!"
    echo ""
    echo "📋 List of secrets:"
    eas secret:list

else
    echo "❌ .env file not found!"
    echo "Please create a .env file first with your API keys"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update API_BASE_URL secret when you deploy your backend:"
echo "   eas secret:create --scope project --name API_BASE_URL --value 'https://your-backend.com/api' --force"
echo ""
echo "2. Update eas.json with your Apple Developer account details"
echo ""
echo "3. Run your first build:"
echo "   eas build --platform ios --profile production"
