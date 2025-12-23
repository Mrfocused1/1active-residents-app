# EAS Configuration Setup Guide

This guide will help you update `eas.json` with your Apple Developer account details.

## What You Need to Update in `eas.json`

In the `submit > production > ios` section (lines 33-36), you need to replace:

```json
"appleId": "YOUR_APPLE_ID@example.com",
"ascAppId": "YOUR_ASC_APP_ID",
"appleTeamId": "YOUR_TEAM_ID"
```

## How to Find Each Value

### 1. Apple ID (appleId)
**What it is:** Your Apple Developer account email

**Where to find it:**
- This is the email address you use to log into [developer.apple.com](https://developer.apple.com)
- Example: `paul@activeresidents.co.uk` or `your.email@example.com`

**How to update:**
Replace `YOUR_APPLE_ID@example.com` with your actual Apple ID email

---

### 2. App Store Connect App ID (ascAppId)
**What it is:** A unique 10-digit number that identifies your app in App Store Connect

**Where to find it:**
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Log in with your Apple ID
3. Click "My Apps"
4. **If app doesn't exist yet**: Create new app first (see "Creating Your App" section below)
5. Click on your app name
6. Go to "App Information" in the left sidebar
7. Look for "Apple ID" - it's a 10-digit number
   - Example: `1234567890`

**How to update:**
Replace `YOUR_ASC_APP_ID` with the 10-digit number (no quotes, just the number)

---

### 3. Apple Team ID (appleTeamId)
**What it is:** A 10-character alphanumeric code that identifies your developer team

**Where to find it:**
1. Go to [Apple Developer](https://developer.apple.com)
2. Log in with your Apple ID
3. Click "Account" in the top navigation
4. Click "Membership" in the left sidebar
5. Look for "Team ID" - it's a 10-character code
   - Example: `A1B2C3D4E5`

**How to update:**
Replace `YOUR_TEAM_ID` with your Team ID (in quotes)

---

## Creating Your App in App Store Connect

If you haven't created your app in App Store Connect yet:

1. **Go to App Store Connect**
   - Visit [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Log in with your Apple ID

2. **Create New App**
   - Click "My Apps"
   - Click the "+" button
   - Select "New App"

3. **Fill in App Information**
   - **Platform:** iOS
   - **Name:** Active Residents
   - **Primary Language:** English (UK)
   - **Bundle ID:** Select `uk.co.activeresidents.mobile` from dropdown
     - If not available, you need to register it first in Developer Portal
   - **SKU:** `active-residents-uk` (or any unique identifier)

4. **Get Your App ID**
   - After creating, go to "App Information"
   - Copy the "Apple ID" number (10 digits)
   - This is your `ascAppId`

---

## Registering Bundle ID (If Needed)

If `uk.co.activeresidents.mobile` isn't available in the Bundle ID dropdown:

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Click "Certificates, Identifiers & Profiles"
3. Click "Identifiers"
4. Click the "+" button
5. Select "App IDs" and click "Continue"
6. Select "App" and click "Continue"
7. Fill in:
   - **Description:** Active Residents
   - **Bundle ID:** `uk.co.activeresidents.mobile` (Explicit)
8. Select capabilities you need (already configured in app.config.js):
   - Maps
   - Push Notifications (if needed)
9. Click "Continue" and "Register"

---

## Example of Updated eas.json

After you find your values, your `eas.json` should look like:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "paul@activeresidents.co.uk",
        "ascAppId": "1234567890",
        "appleTeamId": "A1B2C3D4E5"
      }
    }
  }
}
```

---

## Quick Setup Commands

After updating `eas.json`, run these commands:

```bash
# 1. Login to EAS (if not already logged in)
eas login

# 2. Set up production secrets
./scripts/setup-eas-secrets.sh

# 3. Configure EAS build (creates/updates eas.json)
eas build:configure

# 4. Create your first iOS build
eas build --platform ios --profile production
```

---

## Troubleshooting

### "Bundle ID not found"
- Register the bundle ID in Apple Developer Portal first (see "Registering Bundle ID" above)

### "Invalid Apple ID"
- Make sure you're using the email you use to log into developer.apple.com
- Check that your Apple Developer Program membership is active

### "Invalid Team ID"
- Double-check the Team ID from your Membership page
- Make sure there are no extra spaces

### "App ID not found"
- Create the app in App Store Connect first
- Wait a few minutes after creation for it to propagate

---

## Next Steps After Configuration

Once `eas.json` is updated:

1. ✅ Run `./scripts/setup-eas-secrets.sh` to set up environment variables
2. ✅ Run `eas build --platform ios` to create your first build
3. ✅ Wait 10-20 minutes for the build to complete
4. ✅ Run `eas submit --platform ios --latest` to submit to App Store
5. ✅ Complete your App Store listing with screenshots and description
6. ✅ Submit for review

---

**Need Help?**
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

**Current Status:** Waiting for you to update the 3 values in `eas.json`
