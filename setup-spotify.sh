#!/bin/bash

# Quick Spotify Setup Script
# This script helps you configure Spotify API credentials

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎵 Spotify Integration Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

# Check current Client ID
CURRENT_ID=$(grep VITE_SPOTIFY_CLIENT_ID .env | cut -d '=' -f2)

if [ "$CURRENT_ID" == "your_client_id_here" ] || [ -z "$CURRENT_ID" ]; then
    echo "⚠️  Spotify Client ID is not configured!"
    echo ""
    echo "📋 Follow these steps:"
    echo ""
    echo "1. Visit: https://developer.spotify.com/dashboard"
    echo "2. Log in with your Spotify account"
    echo "3. Click 'Create app'"
    echo "4. Fill in the form:"
    echo "   - App name: Sounds Expensive"
    echo "   - App description: Music analysis tool"
    echo "   - Redirect URI: https://trentbecknell.github.io/soundsexpensive/"
    echo "   - APIs: Select 'Web API'"
    echo "5. Click 'Save'"
    echo "6. Click 'Settings' and copy your Client ID"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "Enter your Spotify Client ID: " CLIENT_ID
    
    if [ -z "$CLIENT_ID" ]; then
        echo "❌ No Client ID provided. Exiting..."
        exit 1
    fi
    
    # Update .env file
    sed -i "s/VITE_SPOTIFY_CLIENT_ID=.*/VITE_SPOTIFY_CLIENT_ID=$CLIENT_ID/" .env
    
    echo ""
    echo "✅ Client ID saved to .env file"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 Next Steps:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Rebuild the project:"
    echo "   npm run build"
    echo ""
    echo "2. Deploy to GitHub Pages:"
    echo "   npm run deploy"
    echo ""
    echo "3. Test the integration:"
    echo "   Visit: https://trentbecknell.github.io/soundsexpensive/"
    echo "   Click: Catalog Analyzer → Connect Spotify"
    echo ""
else
    echo "✅ Spotify Client ID is already configured!"
    echo ""
    echo "Current Client ID: ${CURRENT_ID:0:10}..."
    echo ""
    echo "To update your Client ID, edit the .env file manually or run:"
    echo "  nano .env"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 Ready to deploy!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Run these commands to deploy:"
    echo "  npm run build"
    echo "  npm run deploy"
    echo ""
fi

echo "📖 For more help, see: SPOTIFY_INTEGRATION.md"
echo ""
