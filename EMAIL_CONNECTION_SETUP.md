# Email Connection Setup Guide

## Overview

The Email Connection feature allows users to connect their Gmail account to send reports directly from their personal email address. This provides better tracking, professional communication, and email-based report management.

## Current Status

- ✅ UI Complete - EmailConnectionScreen fully designed
- ✅ Preferences UI - Toggle switches for auto-send, CC, tracking
- ✅ Benefits & Privacy - User-facing information
- ❌ OAuth Integration - Not implemented
- ❌ Backend Service - Not implemented
- ❌ Gmail API - Not connected

---

## What This Feature Does

### User Flow
1. User taps "Connect Gmail Account" in Settings
2. OAuth consent screen opens (Google login)
3. User grants permissions to send emails on their behalf
4. App stores OAuth tokens securely
5. When submitting a report, email is sent from user's Gmail
6. User receives CC of all correspondence
7. Email activity is tracked (opens, responses)

### Features
- **Auto-send Reports**: Reports are sent from user's Gmail automatically
- **Receive CC Copies**: User gets copied on all emails sent
- **Track Email Activity**: Monitor when emails are opened and replied to
- **Email Analytics**: View stats on email performance
- **Email Thread Viewer**: See full conversation history with councils

---

## Requirements

### 1. Google Cloud Console Setup

#### A. Create Project
```
1. Go to https://console.cloud.google.com
2. Click "Select a project" > "New Project"
3. Name: "FixMyStreet Email Integration" (or your app name)
4. Click "Create"
```

#### B. Enable Gmail API
```
1. In your project, go to "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click on it, then click "Enable"
```

#### C. Configure OAuth Consent Screen
```
1. Go to "APIs & Services" > "OAuth consent screen"
2. User Type: Select "External"
3. Click "Create"

Fill in:
- App name: [Your App Name]
- User support email: [your-email@example.com]
- Developer contact: [your-email@example.com]

Scopes - Click "Add or Remove Scopes":
- gmail.send (Send email on your behalf)
- gmail.readonly (View your email messages and settings)

Test users:
- Add your email for testing

4. Click "Save and Continue"
```

#### D. Create OAuth Credentials

**For iOS:**
```
1. Go to "APIs & Services" > "Credentials"
2. Click "+ Create Credentials" > "OAuth client ID"
3. Application type: "iOS"
4. Name: "[Your App Name] iOS"
5. Bundle ID: Get from app.json (e.g., com.yourcompany.yourapp)
6. Click "Create"
7. Save the Client ID
```

**For Android:**
```
1. Click "+ Create Credentials" > "OAuth client ID"
2. Application type: "Android"
3. Name: "[Your App Name] Android"
4. Package name: Get from app.json
5. SHA-1 certificate fingerprint:
   - Get from: eas credentials
   - Or generate: keytool -list -v -keystore ~/.android/debug.keystore
6. Click "Create"
7. Save the Client ID
```

**For Web (Development/Testing):**
```
1. Click "+ Create Credentials" > "OAuth client ID"
2. Application type: "Web application"
3. Name: "[Your App Name] Web Development"
4. Authorized redirect URIs:
   - http://localhost:19006
   - https://auth.expo.io/@YOUR_USERNAME/YOUR_APP_SLUG
5. Click "Create"
6. Save Client ID and Client Secret
```

---

### 2. Install Required Packages

#### Option A: Using Expo Auth Session (Recommended)

```bash
npx expo install expo-auth-session expo-crypto expo-web-browser
```

#### Option B: Using Google Sign-In

```bash
npm install @react-native-google-signin/google-signin
```

---

### 3. Backend Service Setup

You need a backend to:
- Handle OAuth token exchange
- Securely store refresh tokens
- Send emails via Gmail API
- Track email analytics

#### Backend Option 1: Node.js + Express

**Required packages:**
```bash
npm install googleapis nodemailer dotenv
```

**Example backend service:**
```javascript
// server.js
const express = require('express');
const { google } = require('googleapis');
const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// OAuth callback endpoint
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);

  // Store tokens securely in your database
  // Associate with user account

  res.redirect('myapp://auth/success');
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  const { userId, to, subject, body } = req.body;

  // Get user's OAuth tokens from database
  oauth2Client.setCredentials(userTokens);

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    body
  ].join('\n');

  const encodedEmail = Buffer.from(email).toString('base64');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedEmail
    }
  });

  res.json({ success: true });
});

app.listen(3000);
```

#### Backend Option 2: Firebase Cloud Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init functions
```

```javascript
// functions/index.js
const functions = require('firebase-functions');
const { google } = require('googleapis');

exports.sendEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, body } = data;
  const userId = context.auth.uid;

  // Get user tokens from Firestore
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(userId)
    .get();

  const tokens = userDoc.data().gmailTokens;

  const oauth2Client = new google.auth.OAuth2(
    functions.config().google.client_id,
    functions.config().google.client_secret
  );

  oauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Send email
  // ...
});
```

---

### 4. Frontend Implementation

#### A. Create Email Service

Create `services/email.service.ts`:

```typescript
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'your-app-scheme',
  path: 'redirect'
});

interface EmailTokens {
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
}

class EmailService {
  private tokens: EmailTokens | null = null;

  // Initialize OAuth flow
  async connectGmail(): Promise<boolean> {
    try {
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      };

      const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
          clientId: GOOGLE_CLIENT_ID,
          scopes: ['https://www.googleapis.com/auth/gmail.send'],
          redirectUri: REDIRECT_URI,
        },
        discovery
      );

      const result = await promptAsync();

      if (result.type === 'success') {
        const { code } = result.params;

        // Exchange code for tokens with your backend
        const response = await fetch('YOUR_BACKEND_URL/auth/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const tokens = await response.json();
        await this.storeTokens(tokens);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Gmail connection error:', error);
      return false;
    }
  }

  // Store tokens securely
  private async storeTokens(tokens: EmailTokens): Promise<void> {
    this.tokens = tokens;
    await SecureStore.setItemAsync('gmail_tokens', JSON.stringify(tokens));
  }

  // Get stored tokens
  async getTokens(): Promise<EmailTokens | null> {
    if (this.tokens) return this.tokens;

    const stored = await SecureStore.getItemAsync('gmail_tokens');
    if (stored) {
      this.tokens = JSON.parse(stored);
      return this.tokens;
    }

    return null;
  }

  // Check if connected
  async isConnected(): Promise<boolean> {
    const tokens = await this.getTokens();
    return !!tokens;
  }

  // Send email via backend
  async sendEmail(params: {
    to: string;
    subject: string;
    body: string;
    cc?: string[];
  }): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) {
        throw new Error('Not connected to Gmail');
      }

      const response = await fetch('YOUR_BACKEND_URL/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify(params),
      });

      return response.ok;
    } catch (error) {
      console.error('Send email error:', error);
      return false;
    }
  }

  // Disconnect Gmail
  async disconnect(): Promise<void> {
    this.tokens = null;
    await SecureStore.deleteItemAsync('gmail_tokens');

    // Revoke tokens with backend
    await fetch('YOUR_BACKEND_URL/auth/revoke', {
      method: 'POST',
    });
  }
}

export default new EmailService();
```

#### B. Update EmailConnectionScreen

```typescript
// In EmailConnectionScreen.tsx
import emailService from '../services/email.service';

const handleConnect = async () => {
  console.log('Initiating Gmail OAuth...');
  const success = await emailService.connectGmail();

  if (success) {
    setIsConnected(true);
    // Get and display user's email
    const userEmail = await emailService.getUserEmail();
    setUserEmail(userEmail);
  }
};

const confirmDisconnect = async () => {
  await emailService.disconnect();
  setIsConnected(false);
  setShowDisconnectModal(false);
};
```

---

### 5. Email Templates

Create `services/emailTemplates.ts`:

```typescript
export interface ReportEmailData {
  category: string;
  description: string;
  location: string;
  photo?: string;
  council: string;
}

export const generateReportEmail = (data: ReportEmailData): string => {
  return `
Dear ${data.council} Council,

I would like to report a ${data.category} issue at the following location:

Location: ${data.location}

Description:
${data.description}

${data.photo ? `Photo attached: ${data.photo}` : ''}

Please acknowledge receipt and provide updates on this matter.

Thank you,
[User's name from profile]

---
Sent via [Your App Name]
  `.trim();
};

export const getEmailSubject = (category: string, location: string): string => {
  return `Report: ${category} at ${location}`;
};
```

---

### 6. Security Considerations

#### A. OAuth Scopes
Use minimal required scopes:
- `gmail.send` - Send emails only (recommended)
- `gmail.readonly` - Read emails (for thread tracking)

**Never request:**
- `gmail.modify` - Can delete emails
- Full Gmail access - Too permissive

#### B. Token Storage
```bash
# Install secure storage
npx expo install expo-secure-store
```

Store tokens encrypted on device, refresh tokens on secure backend only.

#### C. Privacy Policy Updates
Add to your Privacy Policy:
- Gmail access is optional
- Only send/read emails related to reports
- Tokens stored securely with encryption
- Can disconnect at any time
- No access to personal emails

---

### 7. Testing

#### Development Testing
```typescript
// Test OAuth flow
await emailService.connectGmail();

// Test sending email
await emailService.sendEmail({
  to: 'test@camden.gov.uk',
  subject: 'Test Report',
  body: 'This is a test email from [Your App Name]',
});

// Check connection status
const isConnected = await emailService.isConnected();
console.log('Connected:', isConnected);
```

#### Production Testing
1. Add test users in Google Console
2. Test full OAuth flow on iOS and Android
3. Test email sending to council addresses
4. Verify CC functionality
5. Test disconnect/reconnect flow
6. Test token refresh

---

### 8. Related Screens

These screens also need implementation for full email functionality:

#### AnalyticsDashboardScreen
- Show email open rates
- Response rates
- Average response time
- Most responsive departments

#### EmailPreviewScreen
- Preview email before sending
- Edit email content
- Attach photos
- Choose recipients

#### EmailThreadViewerScreen
- Show email conversation thread
- Track responses from council
- Mark emails as read/unread
- Reply to emails

---

## Cost Considerations

### Google Cloud
- **Gmail API**: Free for up to 1 billion quota units/day
- **OAuth**: Free

### Backend Hosting
- **Firebase**: Free tier includes Cloud Functions
- **Heroku**: Free tier available
- **AWS Lambda**: Free tier 1M requests/month
- **Vercel**: Free tier for serverless functions

### Email Sending Limits
- **Gmail API**: 100 emails/day for free accounts, 2000/day for workspace
- Consider SendGrid/Mailgun for higher volume

---

## Alternative Approach (Simpler)

If OAuth is too complex, consider:

### Option 1: SMTP with App Passwords
- User generates Gmail app password
- Store password securely
- Use Nodemailer to send emails via SMTP
- Simpler but less secure

### Option 2: Email Intent (No Connection Needed)
- Open user's default email app
- Pre-fill recipient, subject, body
- User taps send manually
- No backend needed!

```typescript
import { Linking } from 'react-native';

const sendViaEmailApp = (to: string, subject: string, body: string) => {
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  Linking.openURL(url);
};
```

### Option 3: Backend-Only Emails
- User doesn't connect Gmail
- Backend sends emails on user's behalf
- User provides email for CC
- Simpler, no OAuth needed

---

## Recommended Implementation Path

For **MVP** (Minimum Viable Product):
1. Use Email Intent approach (Option 2 above)
2. No backend needed
3. Works immediately
4. User has full control

For **Full Production**:
1. Implement Gmail OAuth
2. Set up Firebase backend
3. Add email analytics
4. Implement thread tracking

---

## Packages to Install

```bash
# Core email functionality
npx expo install expo-auth-session expo-crypto expo-web-browser expo-secure-store

# Backend (choose one)
npm install googleapis  # For Node.js backend
npm install firebase-admin  # For Firebase backend

# Email templates
npm install handlebars  # Optional, for HTML email templates
```

---

## Configuration File

Add to `app.json`:

```json
{
  "expo": {
    "scheme": "yourappscheme",
    "extra": {
      "googleOAuth": {
        "clientIdIOS": "YOUR_IOS_CLIENT_ID",
        "clientIdAndroid": "YOUR_ANDROID_CLIENT_ID"
      }
    }
  }
}
```

---

## Current File Locations

- Email Connection UI: `/screens/EmailConnectionScreen.tsx` ✅ Complete
- Email Analytics: `/screens/AnalyticsDashboardScreen.tsx` ⚠️ Needs data
- Email Preview: `/screens/EmailPreviewScreen.tsx` ⚠️ Needs functionality
- Email Threads: `/screens/EmailThreadViewerScreen.tsx` ⚠️ Needs functionality

---

## Next Steps

1. **Decide on approach**: OAuth vs Email Intent vs Backend-only
2. **Set up Google Cloud Console** (if using OAuth)
3. **Install required packages**
4. **Create email service**
5. **Set up backend** (if using OAuth)
6. **Update EmailConnectionScreen** with real functionality
7. **Test on physical devices**
8. **Update Privacy Policy**

---

## Questions?

Consider:
- Do users need to send from their personal email? (OAuth required)
- Or is it okay to send from app email with CC? (Backend-only)
- Or is email intent (opening Gmail app) acceptable? (Simplest)

Your choice depends on:
- User experience goals
- Development complexity tolerance
- Backend infrastructure availability
- Budget for hosting

**Recommendation**: Start with Email Intent (simplest), upgrade to OAuth later if needed.
