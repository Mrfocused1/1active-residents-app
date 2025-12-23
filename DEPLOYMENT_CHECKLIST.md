# App Store Deployment Checklist

This document tracks all tasks required to deploy Active Residents to the Apple App Store.

## Completed Tasks ✅

### 1. Dependencies Fixed
- ✅ Installed `expo-font` (was missing peer dependency)
- ✅ Installed `expo-constants` (required for environment config)
- ✅ Installed EAS CLI globally (v16.28.0)

### 2. Project Configuration
- ✅ Created `.gitignore` with proper exclusions (.expo, node_modules, .env, etc.)
- ✅ Converted `app.json` to `app.config.js` to support dynamic configuration
- ✅ Configured EAS project ID in app config

### 3. API Key Security
- ✅ Created environment configuration system (`config/env.ts`)
- ✅ Created `.env.example` template
- ✅ Updated all service files to use ENV config:
  - `services/gemini.service.ts`
  - `services/newsAPI.service.ts`
  - `services/perplexityAPI.ts`
  - `services/api.config.ts`
- ✅ Removed hardcoded API keys from source files
- ✅ Configured `app.config.js` to pass environment variables to app

## Remaining Tasks 🔨

### CRITICAL - Required Before Submission

#### 1. Create App Icons
**Status:** ⏸️ Waiting for icon files

You have the "Active Residents" logo. You need to create:
- `assets/icon.png` (1024x1024px, square)
- `assets/adaptive-icon.png` (1024x1024px, with foreground on transparent background)

**Options:**
- **Option A - Design Tool:** Use Figma, Photoshop, or Illustrator to create proper sized icons
- **Option B - Online Generator:** Use https://easyappicon.com or https://appicon.co
- **Option C - AI Tool:** Use an AI image generator to create professional app icons

**Once created:**
1. Save icon files to `/Users/paulbridges/mobile app1/assets/`
2. Update `app.config.js` to include icon paths:
   ```javascript
   icon: "./assets/icon.png",
   // In ios and android sections
   ios: {
     ...existing config,
     icon: "./assets/icon.png"
   },
   android: {
     ...existing config,
     adaptiveIcon: {
       foregroundImage: "./assets/adaptive-icon.png",
       backgroundColor: "#5B7CFA"
     }
   }
   ```

#### 2. Set Up Environment Variables

**For Local Development:**
```bash
cp .env.example .env
# Then edit .env with your actual API keys
```

**For Production (EAS Secrets):**
```bash
# Login to EAS (you'll need your Expo account)
eas login

# Set production secrets
eas secret:create --scope project --name GEMINI_API_KEY --value "your-actual-key"
eas secret:create --scope project --name NEWS_API_KEY --value "your-actual-key"
eas secret:create --scope project --name PERPLEXITY_API_KEY --value "your-actual-key"
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value "your-actual-key"
eas secret:create --scope project --name API_BASE_URL --value "https://your-backend-url.com"
eas secret:create --scope project --name USE_MOCK_DATA --value "false"
```

#### 3. Update EAS Configuration

Edit `eas.json` and replace placeholder values:
```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID_EMAIL",  // ← Update this
        "ascAppId": "YOUR_ASC_APP_ID",     // ← Update this
        "appleTeamId": "YOUR_TEAM_ID"      // ← Update this
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID_EMAIL",  // ← Update this
        "ascAppId": "YOUR_ASC_APP_ID",     // ← Update this
        "appleTeamId": "YOUR_TEAM_ID"      // ← Update this
      }
    }
  }
}
```

**How to find these values:**
- **appleId:** Your Apple Developer account email
- **ascAppId:** Found in App Store Connect > Your App > App Information > Apple ID
- **appleTeamId:** Found in Apple Developer account > Membership

### HIGH PRIORITY - Recommended Before Submission

#### 4. Backend Preparation
- [ ] Deploy your backend API to production
- [ ] Update `API_BASE_URL` in production environment
- [ ] Set `USE_MOCK_DATA` to `false` in production
- [ ] Test all API endpoints are accessible

#### 5. App Store Connect Setup
- [ ] Create app listing in App Store Connect
- [ ] Prepare app description (4000 char max)
- [ ] Prepare keywords for search optimization
- [ ] Choose app category (Lifestyle or Productivity)
- [ ] Set content rating
- [ ] Add support URL (required)
- [ ] Add privacy policy URL (required)

#### 6. Screenshots & Marketing
- [ ] Capture screenshots on required iPhone sizes:
  - 6.7" display (iPhone 15 Pro Max, 14 Pro Max, etc.)
  - 6.5" display (iPhone 11 Pro Max, XS Max, etc.)
  - 5.5" display (iPhone 8 Plus, 7 Plus, etc.)
- [ ] Optional: Create App Preview videos

#### 7. Legal & Compliance
- [ ] Create Privacy Policy
- [ ] Create Terms of Service
- [ ] Host both on a public URL (required by Apple)
- [ ] Review Apple's App Store Review Guidelines
- [ ] Ensure compliance with data collection policies

### MEDIUM PRIORITY - Nice to Have

#### 8. Testing
- [ ] Test app on physical iOS device
- [ ] Test all major user flows
- [ ] Test with real council data
- [ ] Verify all permissions work correctly
- [ ] Test photo upload functionality
- [ ] Test location services

#### 9. Optimization
- [ ] Review and optimize bundle size
- [ ] Test app performance
- [ ] Add error tracking (Sentry, Bugsnag, etc.)
- [ ] Add analytics (if desired)

## Build & Submit Commands

Once all CRITICAL tasks are complete, use these commands:

### Create Production Build
```bash
# Build for iOS
eas build --platform ios --profile production

# Check build status
eas build:list
```

### Submit to App Store
```bash
# Submit to App Store Connect
eas submit --platform ios --latest

# Or submit specific build
eas submit --platform ios --id YOUR_BUILD_ID
```

### Monitor Submission
- Check status in App Store Connect
- Respond to any review feedback
- Average review time: 24-48 hours

## Current Blockers

1. **App Icons** - Need icon.png and adaptive-icon.png files
2. **API Keys** - Need to be set as EAS secrets for production
3. **EAS Config** - Need Apple Developer account details
4. **Backend** - Need production API endpoint

## Next Steps

**Immediate (What you should do now):**
1. Create the app icon files (1024x1024px)
2. Set up your environment variables locally (.env file)
3. Update eas.json with your Apple Developer details

**After Icons:**
1. Test the app locally with your icons
2. Create EAS secrets for production
3. Run your first production build: `eas build --platform ios`

**Before Submission:**
1. Complete App Store Connect listing
2. Prepare screenshots
3. Create and host privacy policy
4. Final testing on physical device

## Resources

- [Expo EAS Documentation](https://docs.expo.dev/eas/)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
- [iOS App Icons Guide](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Questions?

If you need help with any of these tasks, refer to:
- `config/README.md` - Environment configuration help
- `.env.example` - List of required environment variables
- `eas.json` - Build and submit configuration

---

**Last Updated:** 2025-12-23
**App Version:** 1.0.0
**EAS CLI Version:** 16.28.0
