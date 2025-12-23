# 📱 Deployment Guide

This guide covers Phase 6: Additional Considerations for deploying your app to production.

## 🎯 What's Been Set Up

### ✅ 1. Analytics & Monitoring
- **File**: `services/analytics.service.ts`
- **Features**:
  - Screen view tracking
  - Event tracking (reports, searches, council selection)
  - User properties
  - Ready for Firebase Analytics integration

### ✅ 2. Crash Reporting
- **File**: `services/crashReporting.service.ts`
- **Features**:
  - Exception capture
  - Error context tracking
  - Breadcrumb trails
  - Ready for Sentry integration

### ✅ 3. Push Notifications
- **File**: `services/pushNotifications.service.ts`
- **Features**:
  - Permission handling
  - Expo push token registration
  - Local notifications
  - Notification tap handling
  - Badge management

### ✅ 4. Over-the-Air Updates
- **File**: `eas.json`
- **Channels**:
  - Development
  - Preview
  - Production

### ✅ 5. Legal Documents
- **File**: `PRIVACY_POLICY.md`
- **File**: `TERMS_OF_SERVICE.md`

---

## 🚀 How to Initialize Services

### Step 1: Initialize in App.tsx

Add this to your `App.tsx`:

```typescript
import { useEffect } from 'react';
import analytics from './services/analytics.service';
import crashReporting from './services/crashReporting.service';
import pushNotifications from './services/pushNotifications.service';

export default function App() {
  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        await analytics.initialize();
        await crashReporting.initialize();
        await pushNotifications.initialize();

        console.log('✅ All services initialized');
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      pushNotifications.cleanup();
    };
  }, []);

  // ... rest of your app
}
```

### Step 2: Track Events

Use analytics throughout your app:

```typescript
// Track screen views
analytics.trackScreenView('HomeScreen');

// Track events
analytics.trackReportSubmission('pothole', 'Camden');
analytics.trackSearch('graffiti');

// Set user properties
analytics.setUserProperties({
  council: 'Camden',
  reportCount: 5,
});
```

### Step 3: Handle Errors

Wrap components with error boundaries:

```typescript
try {
  // Your code
} catch (error) {
  crashReporting.captureException(error as Error, {
    screen: 'HomeScreen',
    council: selectedCouncil,
  });
}
```

---

## 🔧 Setting Up Third-Party Services

### Firebase Analytics (Optional but Recommended)

1. **Create Firebase Project**:
   ```bash
   # Go to https://console.firebase.google.com
   # Create new project
   # Add iOS and Android apps
   ```

2. **Download Config Files**:
   - iOS: `GoogleService-Info.plist`
   - Android: `google-services.json`

3. **Install**:
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/analytics
   ```

4. **Update `services/analytics.service.ts`**:
   ```typescript
   import analytics from '@react-native-firebase/analytics';

   async initialize() {
     await analytics().setAnalyticsCollectionEnabled(true);
   }

   trackEvent(name: string, properties?: any) {
     analytics().logEvent(name, properties);
   }
   ```

### Sentry (Recommended for Crash Reporting)

1. **Create Sentry Account**:
   ```bash
   # Go to https://sentry.io
   # Create new project (React Native)
   # Copy your DSN
   ```

2. **Install**:
   ```bash
   npx @sentry/wizard@latest -i reactNative -p ios android
   ```

3. **Update `services/crashReporting.service.ts`**:
   ```typescript
   import * as Sentry from '@sentry/react-native';

   async initialize() {
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
       environment: __DEV__ ? 'development' : 'production',
       enableInExpoDevelopment: false,
     });
   }

   captureException(error: Error, context?: any) {
     Sentry.captureException(error, { contexts: context });
   }
   ```

---

## 📦 EAS Build & Update Setup

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login

```bash
eas login
```

### Step 3: Configure Project

```bash
eas build:configure
```

### Step 4: Build for Production

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both
eas build --platform all --profile production
```

### Step 5: Over-the-Air Updates

```bash
# Publish update to production channel
eas update --channel production --message "Bug fixes and improvements"

# Publish to preview
eas update --channel preview --message "Testing new features"
```

---

## 📝 Legal Requirements

### Privacy Policy

1. **Customize** `PRIVACY_POLICY.md`:
   - Replace `[Your App Name]` with your app name
   - Replace `[your-email@example.com]` with your contact email
   - Replace `[Your Company Name]` with your company name
   - Add your address and phone number

2. **Host Online**:
   - Upload to your website
   - Or use GitHub Pages
   - Get a public URL (required for app stores)

3. **Add to App**:
   - Link in Settings screen
   - Link in onboarding
   - Include in app store listings

### Terms of Service

1. **Customize** `TERMS_OF_SERVICE.md`:
   - Same replacements as Privacy Policy
   - Review arbitration clauses
   - Adjust for your jurisdiction

2. **Legal Review**:
   - Consider having a lawyer review
   - Especially important for:
     - Consumer-facing apps
     - Apps handling sensitive data
     - Apps with paid features

---

## 🔔 Push Notifications Setup

### Step 1: Get Push Token

The service automatically gets the token when initialized.

### Step 2: Test Notifications

```typescript
// Send test notification
await pushNotifications.sendTestNotification();
```

### Step 3: Send From Backend

Use the Expo push token to send notifications from your backend:

```bash
curl -H "Content-Type: application/json" -X POST https://exp.host/--/api/v2/push/send -d '{
  "to": "ExponentPushToken[YOUR_TOKEN]",
  "sound": "default",
  "title": "Report Update",
  "body": "Your report has been reviewed",
  "data": { "reportId": "123" }
}'
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **User Engagement**:
   - Daily/Monthly Active Users
   - Session duration
   - Screens per session

2. **Feature Usage**:
   - Reports submitted
   - Searches performed
   - Map views
   - Council selections

3. **Performance**:
   - App crashes
   - API errors
   - Load times

4. **Conversion**:
   - Onboarding completion
   - Report completion rate
   - Return users

### Dashboard Access

- **Firebase**: https://console.firebase.google.com
- **Sentry**: https://sentry.io
- **Expo**: https://expo.dev

---

## ✅ Pre-Launch Checklist

### Code Quality
- [ ] Remove all `console.log` statements (or use production logging)
- [ ] Test on iOS and Android
- [ ] Test all features
- [ ] Handle offline scenarios
- [ ] Test with different councils

### Services
- [ ] Analytics tracking all key events
- [ ] Crash reporting configured
- [ ] Push notifications tested
- [ ] EAS Update configured

### Legal
- [ ] Privacy Policy customized and hosted
- [ ] Terms of Service customized and hosted
- [ ] Contact email set up
- [ ] Legal review completed (recommended)

### App Stores
- [ ] App icons created (1024x1024)
- [ ] Screenshots taken (all required sizes)
- [ ] App description written
- [ ] Keywords selected
- [ ] Age rating determined
- [ ] Support URL set up

### Security
- [ ] API keys moved to environment variables
- [ ] Sensitive data encrypted
- [ ] HTTPS for all API calls
- [ ] Input validation implemented

---

## 🆘 Troubleshooting

### Analytics Not Working
- Check Firebase config files are in correct location
- Verify analytics initialization in App.tsx
- Check console for initialization errors

### Push Notifications Not Received
- Verify device is physical (not simulator)
- Check notification permissions granted
- Test with local notification first
- Verify Expo push token is valid

### Crashes Not Reported
- Verify Sentry DSN is correct
- Check initialization in App.tsx
- Test with `crashReporting.testCrash()`

### OTA Updates Not Installing
- Check update channel matches build profile
- Verify app version compatibility
- Check network connection
- Force close and reopen app

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Firebase Analytics](https://rnfirebase.io/analytics/usage)
- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

---

## 🎉 You're Ready!

All Phase 6 components are now set up. Review this guide, customize the legal documents, and you'll be ready for deployment!

For questions or issues, refer to the documentation links above or contact support.
