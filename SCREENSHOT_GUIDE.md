# App Store Screenshot Guide

This guide will help you capture screenshots for your App Store submission.

## Quick Start

```bash
# 1. Make sure your app is running
npm start

# 2. Run the screenshot helper script
./scripts/take-screenshots.sh
```

## Manual Process (Recommended)

### Step 1: Open iOS Simulator

1. Start your app: `npm start`
2. Press `i` in the terminal to open iOS Simulator
3. **Important:** Select **iPhone 15 Pro Max** from the simulator menu:
   - Hardware > Device > iPhone 15 Pro Max
   - This ensures correct screenshot size (1290 x 2796 px)

### Step 2: Navigate and Capture

Navigate to each key screen and press `Cmd + S` to take a screenshot:

**Recommended screens (in order):**

1. **Home/Map View**
   - Show the map with multiple issue markers
   - Make sure your location is visible
   - Show the category filters

2. **Issue Report - Category Selection**
   - Display the category selection screen
   - Show all available categories clearly

3. **Issue Details Form**
   - Fill in sample report details
   - Include a photo
   - Show the location on map

4. **Confirm Report Screen**
   - Show the summary before submission
   - Display all entered information

5. **Profile or News Screen**
   - Show council news or user profile
   - Demonstrate additional features

**Tips for great screenshots:**
- Use real-looking data (not "test test test")
- Make sure the UI looks polished
- Show key features and functionality
- Screenshots should tell a story
- 3-10 screenshots total (aim for 5-6)

### Step 3: Organize Screenshots

Screenshots are automatically saved to `~/Desktop` with names like:
- `Simulator Screen Shot - iPhone 15 Pro Max - 2025-12-23 at 11.30.45.png`

The script will help you move and rename them to the `screenshots/` folder.

## Screenshot Requirements

### Size Requirements
- **6.7" display (iPhone 15 Pro Max):** 1290 × 2796 pixels ✅ (Primary)
- This is the minimum required size
- Apple will automatically scale for other devices

### Quantity
- **Minimum:** 3 screenshots
- **Recommended:** 5-6 screenshots
- **Maximum:** 10 screenshots

### File Format
- PNG or JPEG
- RGB color space
- Max file size: 500MB per screenshot

## Alternative: Take Screenshots on Physical iPhone

If you have an iPhone 15 Pro Max (or similar large iPhone):

1. Install Expo Go app
2. Open your app via QR code
3. Take screenshots using physical buttons
4. AirDrop to your Mac
5. Move to `screenshots/` folder

## After Taking Screenshots

### Option 1: Use As-Is
Upload the plain screenshots directly to App Store Connect.

### Option 2: Add Text/Design (Optional)
Use tools like:
- **Figma:** Add captions, highlights, or branding
- **Apple Keynote:** Simple text overlays
- **Canva:** Quick mockups with text
- **Screenshot.rocks:** Automated frames and mockups

### What NOT to do:
- Don't add misleading information
- Don't show features that don't exist
- Don't use copyrighted images
- Don't include prices or promotional text

## Uploading to App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Navigate to "App Store" tab
4. Click "+" to add screenshots
5. Upload screenshots for 6.7" display
6. Arrange in order that tells your app's story
7. (Optional) Add captions below each screenshot

## Current Screenshot Status

Check the `screenshots/` directory:

```bash
ls -lh screenshots/
```

## Troubleshooting

**Simulator screenshots wrong size?**
- Make sure you're using iPhone 15 Pro Max
- Don't resize manually - use correct device

**Can't find screenshots?**
- Check ~/Desktop for files starting with "Simulator Screen Shot"
- Check Photos app if using physical iPhone

**Screenshots too large file size?**
- Use PNG compression
- Or convert to JPEG at 90% quality

---

Need help? Check `DEPLOYMENT_CHECKLIST.md` for full deployment guide.
