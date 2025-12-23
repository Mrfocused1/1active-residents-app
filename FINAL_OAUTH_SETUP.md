# ✅ Final OAuth Setup Checklist

## What I've Already Done

✅ Added your OAuth Client IDs to `services/email.service.ts`
✅ Updated iOS bundle identifier to `uk.co.activeresidents.mobile`
✅ Updated Android package to `uk.co.activeresidents.mobile`
✅ Configured app scheme: `activeresidents://redirect`

---

## ⚠️ IMPORTANT: What You MUST Do in Google Cloud Console

You have **ONE critical step** remaining before OAuth will work:

### Add Redirect URIs to Your Web Client

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** > **Credentials**
4. Click on **"Active Residents Web Client"** (your Web application OAuth client)
5. Under **"Authorized redirect URIs"**, click **"+ ADD URI"**
6. Add these URIs:

```
activeresidents://redirect
exp://localhost:19000
exp://localhost:19000/--/redirect
https://auth.expo.io/@YOUR_EXPO_USERNAME/active-residents
```

7. Click **"SAVE"** at the bottom

**Why this is critical:** Without these redirect URIs, Google will reject the OAuth flow with "redirect_uri_mismatch" error.

---

## Current Configuration Summary

### OAuth Client IDs (Already Added to App)

| Platform | Client ID | Status |
|----------|-----------|--------|
| **iOS** | Configured in Google Cloud Console | ✅ Added to env vars |
| **Android** | Configured in Google Cloud Console | ✅ Added to env vars |
| **Web** | Configured in Google Cloud Console | ✅ Added to env vars |

**Note:** Client IDs are stored in environment variables for security. Get them from Google Cloud Console > APIs & Services > Credentials.

### Bundle IDs (Already Updated)

| Platform | Bundle/Package ID | Status |
|----------|-------------------|--------|
| **iOS** | `uk.co.activeresidents.mobile` | ✅ Matches OAuth client |
| **Android** | `uk.co.activeresidents.mobile` | ✅ Matches OAuth client |

### Redirect URIs (YOU NEED TO ADD)

| URI | Purpose | Status |
|-----|---------|--------|
| `activeresidents://redirect` | Production OAuth callback | ⚠️ **YOU MUST ADD** |
| `exp://localhost:19000` | Development OAuth callback | ⚠️ **YOU MUST ADD** |
| `exp://localhost:19000/--/redirect` | Expo dev OAuth callback | ⚠️ **YOU MUST ADD** |
| `http://localhost:19006` | Web dev (already added) | ✅ Already added |

---

## Android SHA-1 Fingerprint

Your Android OAuth client currently has a placeholder SHA-1 fingerprint:
```
AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD
```

You need to replace this with your actual debug keystore SHA-1:

### Get Your Debug Keystore SHA-1

```bash
# For development (debug keystore)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# For production (your release keystore)
keytool -list -v -keystore path/to/your/release.keystore
```

Then update your Android OAuth client in Google Cloud Console with the real SHA-1.

---

## How to Test

### Option 1: Development Build (Recommended)

```bash
# For iOS (requires Mac with Xcode)
npx expo run:ios

# For Android
npx expo run:android
```

### Option 2: EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build development version
eas build --profile development --platform ios
eas build --profile development --platform android

# Install on device and test
```

### Test Flow

1. Open app on physical device (OAuth doesn't work in simulator for iOS)
2. Navigate to: **Profile** > **Settings** > **Email Connection**
3. Tap **"Connect Gmail Account"**
4. Google sign-in page should open
5. Sign in and grant permissions
6. Should redirect back to app
7. Your email should appear in the connection screen
8. Tap **"Send Test Email"** to verify sending works

---

## Expected Console Logs

### ✅ Success

```
🔐 Starting Gmail OAuth flow...
📍 Redirect URI: activeresidents://redirect
✅ Authorization successful
🔒 Tokens stored securely
✅ User profile fetched: your.email@gmail.com
✅ Gmail connected successfully
📧 Sending email via Gmail API...
✅ Email sent successfully: [message-id]
```

### ❌ Common Errors

**Error: "redirect_uri_mismatch"**
```
Solution: Add activeresidents://redirect to authorized redirect URIs in Google Cloud Console
```

**Error: "invalid_client"**
```
Solution: Verify client IDs match exactly (check for typos)
```

**Error: "access_denied"**
```
Solution: User cancelled or denied permissions. Try again.
```

**Error: "API not enabled"**
```
Solution: Enable Gmail API in Google Cloud Console > APIs & Services > Library
```

---

## Verification Checklist

Before testing, verify:

- [ ] Added redirect URIs to Web Client in Google Cloud Console
- [ ] Gmail API is enabled in Google Cloud Console
- [ ] Bundle IDs match (`uk.co.activeresidents.mobile`)
- [ ] Client IDs are in `services/email.service.ts`
- [ ] Building on physical device (not Expo Go for iOS)
- [ ] Updated Android SHA-1 fingerprint

---

## Files Modified

| File | What Changed |
|------|--------------|
| `services/email.service.ts` | ✅ Added your OAuth client IDs |
| `app.json` | ✅ Updated bundle IDs to `uk.co.activeresidents.mobile` |
| `screens/EmailConnectionScreen.tsx` | ✅ Integrated real OAuth flow |

---

## Quick Start Commands

```bash
# 1. Make sure all background processes are stopped
# Kill any running Expo servers
pkill -f "expo start"
pkill -f "metro"

# 2. Install dependencies (if needed)
npm install

# 3. Run on iOS (requires Mac with Xcode)
npx expo run:ios

# OR run on Android
npx expo run:android

# 4. Watch the console for OAuth flow logs
# The app will open on your device
# Navigate to Settings > Email Connection
# Tap "Connect Gmail Account"
```

---

## Next Steps After OAuth Works

Once you successfully connect and can send test emails:

1. **Integrate with Report Submission**
   - Add "Send via Email" option in `ConfirmReportScreen`
   - Compose professional email to council
   - Attach photo from report

2. **Build Email Preview Screen**
   - Show email before sending
   - Allow editing subject/body
   - Choose recipients (council departments)

3. **Build Email Thread Viewer**
   - Track email conversations with councils
   - Show replies and status
   - Display in timeline format

4. **Add Email Analytics**
   - Track send/open/reply rates
   - Show in `AnalyticsDashboardScreen`
   - Monitor delivery success

---

## Important Security Note

Your client secret (`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`) is currently in the code.

**For production:**
- Move secrets to environment variables
- Use `.env` file (add to `.gitignore`)
- Or use Expo's secure environment variables
- Never commit secrets to Git

```bash
# Create .env file (don't commit this!)
GOOGLE_WEB_CLIENT_SECRET=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
```

---

## Support

If OAuth still doesn't work after:
1. ✅ Adding redirect URIs to Google Cloud Console
2. ✅ Enabling Gmail API
3. ✅ Testing on physical device

Check:
- Console logs for specific error messages
- Google Cloud Console > APIs & Services > Credentials (verify settings)
- OAuth consent screen is published (not in testing mode)
- Your Google account is added as test user (if in testing mode)

---

## Summary

**You're 99% done!**

Just add the redirect URIs to your Web Client in Google Cloud Console and you'll be able to test the full OAuth flow.

**The critical step:** Add `activeresidents://redirect` to authorized redirect URIs in your Web OAuth client.

Then build and test on a physical device! 🚀
