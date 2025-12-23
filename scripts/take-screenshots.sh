#!/bin/bash

# Automated Screenshot Script for App Store Submission
# This script will help you capture screenshots in required sizes

echo "📸 App Store Screenshot Helper"
echo "================================"
echo ""

# Create screenshots directory
SCREENSHOT_DIR="screenshots"
mkdir -p "$SCREENSHOT_DIR"

echo "ℹ️  This script will guide you through taking screenshots."
echo ""
echo "Required screenshots for App Store:"
echo "  - 6.7\" display (iPhone 15 Pro Max): 1290 x 2796 px"
echo "  - Need 3-10 screenshots minimum"
echo ""

# Check if app is running
echo "Step 1: Make sure your app is running"
echo "  Run: npm start (in another terminal)"
echo "  Open the app in iOS Simulator or on your iPhone"
echo ""

read -p "Is your app currently running? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please start the app first, then run this script again."
    exit 1
fi

echo ""
echo "Step 2: Open iOS Simulator"
echo "  - If using Simulator, press 'i' in the Expo terminal"
echo "  - Select iPhone 15 Pro Max for correct size"
echo ""

read -p "Is the app open in iPhone 15 Pro Max simulator? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please open in iPhone 15 Pro Max, then run this script again."
    exit 1
fi

echo ""
echo "Step 3: Take Screenshots"
echo "================================"
echo ""
echo "Navigate to each screen and press Cmd+S to take a screenshot."
echo "Screenshots will be saved to ~/Desktop"
echo ""
echo "📱 Recommended screens to capture:"
echo "  1. Home/Map view (with issues shown)"
echo "  2. Issue report screen (category selection)"
echo "  3. Issue details form (with photo)"
echo "  4. Confirmation screen"
echo "  5. Profile/News feed"
echo ""
echo "Tips:"
echo "  - Show the app with real data"
echo "  - Make it look polished"
echo "  - Capture key features"
echo "  - 3-10 screenshots total"
echo ""

read -p "Press Enter when you've finished taking screenshots..."

echo ""
echo "Step 4: Move screenshots to project"
echo "================================"
echo ""

# Find recent screenshots on Desktop
DESKTOP_SCREENSHOTS=$(find ~/Desktop -name "Simulator Screen Shot*.png" -mtime -1 2>/dev/null)

if [ -z "$DESKTOP_SCREENSHOTS" ]; then
    echo "No recent simulator screenshots found on Desktop."
    echo "Please manually move your screenshots to: ./$SCREENSHOT_DIR/"
else
    echo "Found screenshots on Desktop. Moving to project..."
    COUNTER=1
    for file in $DESKTOP_SCREENSHOTS; do
        cp "$file" "$SCREENSHOT_DIR/screenshot_$COUNTER.png"
        echo "  ✓ Copied screenshot $COUNTER"
        ((COUNTER++))
    done
    echo ""
    echo "✅ Screenshots saved to: ./$SCREENSHOT_DIR/"
fi

echo ""
echo "Next steps:"
echo "  1. Review screenshots in ./$SCREENSHOT_DIR/"
echo "  2. Upload to App Store Connect when creating your app listing"
echo "  3. You can add captions/text overlays if desired"
echo ""
echo "Done! 🎉"
