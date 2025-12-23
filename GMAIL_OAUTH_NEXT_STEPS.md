# Gmail OAuth Integration - Next Steps

## ✅ What's Already Done

1. ✅ Packages installed (`expo-auth-session`, `expo-crypto`, `expo-web-browser`, `expo-secure-store`)
2. ✅ Email service created (`services/email.service.ts`)
3. ✅ App.json configured with scheme
4. ✅ EmailConnectionScreen updated with real OAuth flow
5. ✅ Google Cloud Console and OAuth credentials set up (you said "done both")

---

## 📋 What You Need To Do Now

### 1. Add Your OAuth Client IDs

You need to add the Google OAuth Client IDs you created in Google Cloud Console.

**File to edit:** `services/email.service.ts`

Find this section (around line 18-25):

```typescript
const GOOGLE_CONFIG = {
  // iOS Client ID (from Google Cloud Console)
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',

  // Android Client ID (from Google Cloud Console)
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',

  // Web Client ID (for development/testing)
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',

  // Client Secret (for web - keep this secure!)
  webClientSecret: 'YOUR_WEB_CLIENT_SECRET',
};
```

**Replace with your actual values:**

```typescript
const GOOGLE_CONFIG = {
  // iOS Client ID - Get from Google Cloud Console > Credentials > iOS OAuth client
  iosClientId: 'YOUR-ACTUAL-IOS-CLIENT-ID.apps.googleusercontent.com',

  // Android Client ID - Get from Google Cloud Console > Credentials > Android OAuth client
  androidClientId: 'YOUR-ACTUAL-ANDROID-CLIENT-ID.apps.googleusercontent.com',

  // Web Client ID - Get from Google Cloud Console > Credentials > Web OAuth client
  webClientId: 'YOUR-ACTUAL-WEB-CLIENT-ID.apps.googleusercontent.com',

  // Client Secret - Get from Google Cloud Console > Credentials > Web OAuth client
  webClientSecret: 'YOUR-ACTUAL-CLIENT-SECRET',
};
```

**Where to find these:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** > **Credentials**
4. You should see your OAuth 2.0 Client IDs:
   - **iOS** - Copy the "Client ID"
   - **Android** - Copy the "Client ID"
   - **Web application** - Copy both "Client ID" and "Client secret"

---

### 2. Update OAuth Redirect URIs in Google Cloud

In Google Cloud Console, add the redirect URI for your app:

1. Go to **APIs & Services** > **Credentials**
2. Click on your **Web application** OAuth client
3. Under **Authorized redirect URIs**, add:

```
activeresidents://redirect
```

And for local development:

```
exp://localhost:19000
http://localhost:19006
```

Click **Save**.

---

### 3. Verify Bundle IDs Match

Make sure the bundle IDs in your OAuth credentials match your app:

**iOS Bundle ID:** `uk.co.activeresidents.mobile` (from app.json)
**Android Package:** `uk.co.activeresidents.mobile` (from app.json)

In Google Cloud Console:
- iOS credential should have this Bundle ID
- Android credential should have this Package name

---

### 4. Test on a Physical Device

**IMPORTANT:** OAuth doesn't work in Expo Go on iOS. You need to test on:

**Option A: Development Build**
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

**Option B: EAS Development Build**
```bash
# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Login
eas login

# Build development version
eas build --profile development --platform ios
eas build --profile development --platform android
```

---

### 5. Test the Connection

Once you have your development build:

1. Open the app on your device
2. Navigate to **Settings** > **Email Connection**
3. Tap "Connect Gmail Account"
4. You should see Google's OAuth consent screen
5. Sign in and grant permissions
6. You should be redirected back to the app
7. Your email should appear in the connection screen
8. Try tapping "Send Test Email" to verify it works

---

## 🔍 Debugging

### Check Console Logs

When testing, watch the console for these logs:

```
✅ Successful flow:
🔐 Starting Gmail OAuth flow...
📍 Redirect URI: activeresidents://redirect
✅ Authorization successful
🔒 Tokens stored securely
✅ User profile fetched: your.email@gmail.com
✅ Gmail connected successfully
```

```
❌ Common errors:
- "Invalid client ID" → Check your client IDs match exactly
- "Redirect URI mismatch" → Add activeresidents://redirect to authorized URIs
- "Access blocked" → Make sure Gmail API is enabled in Google Cloud
```

---

## 📱 Current Features

Once connected, users can:

- ✅ Connect their Gmail account via OAuth
- ✅ See their connected email address
- ✅ Send test emails
- ✅ Configure email preferences:
  - Auto-send reports from their email
  - Receive CC copies of all emails
  - Track email activity
- ✅ Disconnect their account
- ✅ Send reports via Gmail API

---

## 🔐 Security Notes

### What's Stored Securely

- OAuth access tokens (encrypted in SecureStore)
- OAuth refresh tokens (encrypted in SecureStore)
- User profile (encrypted in SecureStore)
- Email preferences (encrypted in SecureStore)

### What's NOT Stored

- Passwords (OAuth doesn't use passwords)
- Email content
- Personal emails

### Permissions Requested

- `openid` - Verify user identity
- `profile` - Get user's name and picture
- `email` - Get user's email address
- `gmail.send` - Send emails on behalf of user
- `gmail.readonly` - Read sent emails (for tracking)

---

## ⚠️ Known Limitations

### Gmail API Quotas

- **Free accounts:** 100 emails/day
- **Google Workspace:** 2,000 emails/day

If you hit limits, consider:
- Using SendGrid or similar service
- Implementing rate limiting
- Showing users their daily quota

### Mobile Limitations

The current implementation sends emails directly from the mobile app using Gmail API. This works but has limitations:

**For Production:** Consider adding a backend service to:
- Handle higher email volumes
- Add email templates
- Track delivery status
- Manage rate limits
- Store email history

See `EMAIL_CONNECTION_SETUP.md` for backend implementation options.

---

## 🚀 Next Steps After Testing

Once OAuth is working:

1. **Integrate with Report Submission**
   - Add option to send report via email
   - Compose email with report details
   - Attach photos
   - Send to council email address

2. **Add Email Templates**
   - Create professional templates
   - Include council-specific formatting
   - Add branding

3. **Track Email Status**
   - Monitor email delivery
   - Track opens (requires tracking pixels)
   - Show in email thread viewer

4. **Add Email Analytics**
   - Show email stats in AnalyticsDashboardScreen
   - Display open rates
   - Show response times

---

## 📞 Support

If you encounter issues:

1. **Check the logs** - Look for error messages in console
2. **Verify credentials** - Make sure all Client IDs are correct
3. **Check redirect URIs** - Must match exactly
4. **Enable Gmail API** - In Google Cloud Console
5. **Use physical device** - OAuth won't work in Expo Go on iOS

---

## ✨ What's Next?

After getting OAuth working, you can:

1. Use the `sendEmail()` function to send reports
2. Integrate with `ConfirmReportScreen` to send via Gmail
3. Build the EmailPreviewScreen for composing emails
4. Build the EmailThreadViewerScreen for tracking responses
5. Add email analytics to AnalyticsDashboardScreen

The infrastructure is ready - just add your OAuth credentials and test!

---

**File Locations:**
- Email Service: `/services/email.service.ts` (Add OAuth credentials here)
- Email Screen: `/screens/EmailConnectionScreen.tsx` (Already updated)
- App Config: `/app.json` (Already configured)
- Setup Guide: `/EMAIL_CONNECTION_SETUP.md` (Detailed implementation guide)
