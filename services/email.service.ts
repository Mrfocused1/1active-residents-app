/**
 * Email Service
 *
 * Handles Gmail OAuth integration and email sending functionality
 * Allows users to connect their Gmail account to send reports directly
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ENV } from '../config/env';

// Complete auth session when returning from browser
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs from Google Cloud Console
// NOTE: Configure these in your .env file or EAS secrets
const GOOGLE_CONFIG = {
  // iOS Client ID - Get from Google Cloud Console
  iosClientId: ENV.GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID',

  // Android Client ID - Get from Google Cloud Console
  androidClientId: ENV.GOOGLE_ANDROID_CLIENT_ID || 'YOUR_ANDROID_CLIENT_ID',

  // Web Client ID - Get from Google Cloud Console
  webClientId: ENV.GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_CLIENT_ID',

  // Client Secret - Keep this secure!
  webClientSecret: ENV.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
};

// OAuth discovery endpoints for Google
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

interface EmailTokens {
  accessToken: string;
  refreshToken?: string;
  expiryDate?: number;
  tokenType?: string;
  scope?: string;
}

interface EmailPreferences {
  autoSendReports: boolean;
  receiveCopies: boolean;
  trackEmails: boolean;
}

interface UserProfile {
  email: string;
  name?: string;
  picture?: string;
}

class EmailService {
  private tokens: EmailTokens | null = null;
  private userProfile: UserProfile | null = null;
  private preferences: EmailPreferences = {
    autoSendReports: true,
    receiveCopies: true,
    trackEmails: true,
  };

  /**
   * Get the appropriate client ID for the current platform
   */
  private getClientId(): string {
    if (Platform.OS === 'ios') {
      return GOOGLE_CONFIG.iosClientId;
    } else if (Platform.OS === 'android') {
      return GOOGLE_CONFIG.androidClientId;
    }
    return GOOGLE_CONFIG.webClientId;
  }

  /**
   * Connect Gmail account using OAuth 2.0
   * Opens browser for Google sign-in and authorization
   */
  async connectGmail(): Promise<boolean> {
    try {
      console.log('🔐 Starting Gmail OAuth flow...');

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'activeresidents',
        path: 'redirect',
      });

      console.log('📍 Redirect URI:', redirectUri);

      // Create auth request with PKCE (code verifier generated automatically)
      const authRequest = new AuthSession.AuthRequest({
        clientId: this.getClientId(),
        scopes: [
          'openid',
          'profile',
          'email',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.readonly',
        ],
        redirectUri,
        usePKCE: true,
      });

      // Open authorization prompt
      const result = await authRequest.promptAsync(discovery);

      if (result.type === 'success') {
        console.log('✅ Authorization successful');

        // Get code verifier from auth request (PKCE)
        const codeVerifier = authRequest.codeVerifier;

        // Exchange authorization code for tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: this.getClientId(),
            code: result.params.code,
            redirectUri,
            extraParams: codeVerifier
              ? { code_verifier: codeVerifier }
              : undefined,
          },
          discovery
        );

        // Store tokens
        const tokens: EmailTokens = {
          accessToken: tokenResult.accessToken,
          refreshToken: tokenResult.refreshToken,
          expiryDate: tokenResult.expiresIn
            ? Date.now() + tokenResult.expiresIn * 1000
            : undefined,
          tokenType: tokenResult.tokenType,
          scope: tokenResult.scope,
        };

        await this.storeTokens(tokens);

        // Get user profile
        await this.fetchUserProfile();

        console.log('✅ Gmail connected successfully');
        return true;
      } else if (result.type === 'cancel') {
        console.log('❌ User cancelled OAuth flow');
        return false;
      } else {
        console.error('❌ OAuth flow failed:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Gmail connection error:', error);
      return false;
    }
  }

  /**
   * Fetch user profile information from Google
   */
  private async fetchUserProfile(): Promise<void> {
    try {
      const tokens = await this.getTokens();
      if (!tokens) return;

      const response = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const profile = await response.json();
        this.userProfile = {
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
        };

        // Store profile
        await SecureStore.setItemAsync(
          'gmail_profile',
          JSON.stringify(this.userProfile)
        );

        console.log('✅ User profile fetched:', profile.email);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  /**
   * Store OAuth tokens securely
   */
  private async storeTokens(tokens: EmailTokens): Promise<void> {
    this.tokens = tokens;
    await SecureStore.setItemAsync('gmail_tokens', JSON.stringify(tokens));
    console.log('🔒 Tokens stored securely');
  }

  /**
   * Get stored OAuth tokens
   */
  async getTokens(): Promise<EmailTokens | null> {
    if (this.tokens) return this.tokens;

    try {
      const stored = await SecureStore.getItemAsync('gmail_tokens');
      if (stored) {
        this.tokens = JSON.parse(stored);
        return this.tokens;
      }
    } catch (error) {
      console.error('Error retrieving tokens:', error);
    }

    return null;
  }

  /**
   * Check if access token is expired
   */
  private isTokenExpired(tokens: EmailTokens): boolean {
    if (!tokens.expiryDate) return false;
    return Date.now() >= tokens.expiryDate - 5 * 60 * 1000; // 5 min buffer
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const tokens = await this.getTokens();
      if (!tokens || !tokens.refreshToken) {
        console.error('No refresh token available');
        return false;
      }

      console.log('🔄 Refreshing access token...');

      const response = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.getClientId(),
          client_secret: GOOGLE_CONFIG.webClientSecret,
          grant_type: 'refresh_token',
          refresh_token: tokens.refreshToken,
        }).toString(),
      });

      if (response.ok) {
        const result = await response.json();

        const newTokens: EmailTokens = {
          ...tokens,
          accessToken: result.access_token,
          expiryDate: result.expires_in
            ? Date.now() + result.expires_in * 1000
            : tokens.expiryDate,
        };

        await this.storeTokens(newTokens);
        console.log('✅ Access token refreshed');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  /**
   * Get valid access token (refresh if needed)
   */
  private async getValidAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    if (!tokens) return null;

    if (this.isTokenExpired(tokens)) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) return null;

      const newTokens = await this.getTokens();
      return newTokens?.accessToken || null;
    }

    return tokens.accessToken;
  }

  /**
   * Check if Gmail is connected
   */
  async isConnected(): Promise<boolean> {
    const tokens = await this.getTokens();
    return !!tokens;
  }

  /**
   * Get connected user profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    if (this.userProfile) return this.userProfile;

    try {
      const stored = await SecureStore.getItemAsync('gmail_profile');
      if (stored) {
        this.userProfile = JSON.parse(stored);
        return this.userProfile;
      }
    } catch (error) {
      console.error('Error retrieving profile:', error);
    }

    return null;
  }

  /**
   * Get user email address
   */
  async getUserEmail(): Promise<string | null> {
    const profile = await this.getUserProfile();
    return profile?.email || null;
  }

  /**
   * Compose email in Base64 format for Gmail API
   */
  private composeEmail(params: {
    to: string;
    subject: string;
    body: string;
    cc?: string[];
    from?: string;
  }): string {
    const lines = [
      `From: ${params.from || 'me'}`,
      `To: ${params.to}`,
    ];

    if (params.cc && params.cc.length > 0) {
      lines.push(`Cc: ${params.cc.join(', ')}`);
    }

    lines.push(`Subject: ${params.subject}`);
    lines.push('Content-Type: text/plain; charset=utf-8');
    lines.push('');
    lines.push(params.body);

    const email = lines.join('\r\n');

    // Convert to Base64 URL-safe format
    const base64Email = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return base64Email;
  }

  /**
   * Send email via Gmail API
   *
   * NOTE: This requires a backend service in production!
   * Gmail API calls from mobile apps need server-side implementation for security
   */
  async sendEmail(params: {
    to: string;
    subject: string;
    body: string;
    cc?: string[];
  }): Promise<boolean> {
    try {
      const accessToken = await this.getValidAccessToken();
      if (!accessToken) {
        console.error('Not connected to Gmail or token expired');
        return false;
      }

      console.log('📧 Sending email via Gmail API...');

      // Compose email
      const encodedEmail = this.composeEmail(params);

      // Send via Gmail API
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: encodedEmail,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email sent successfully:', result.id);
        return true;
      } else {
        const error = await response.json();
        console.error('❌ Email send failed:', error);
        return false;
      }
    } catch (error) {
      console.error('❌ Send email error:', error);
      return false;
    }
  }

  /**
   * Get email preferences
   */
  async getPreferences(): Promise<EmailPreferences> {
    try {
      const stored = await SecureStore.getItemAsync('email_preferences');
      if (stored) {
        this.preferences = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error retrieving preferences:', error);
    }
    return this.preferences;
  }

  /**
   * Save email preferences
   */
  async savePreferences(preferences: EmailPreferences): Promise<void> {
    this.preferences = preferences;
    await SecureStore.setItemAsync(
      'email_preferences',
      JSON.stringify(preferences)
    );
    console.log('✅ Email preferences saved');
  }

  /**
   * Disconnect Gmail account
   * Revokes tokens and clears stored data
   */
  async disconnect(): Promise<void> {
    try {
      const tokens = await this.getTokens();

      // Revoke access token
      if (tokens?.accessToken) {
        await fetch(
          `${discovery.revocationEndpoint}?token=${tokens.accessToken}`,
          { method: 'POST' }
        );
      }

      // Clear stored data
      this.tokens = null;
      this.userProfile = null;
      await SecureStore.deleteItemAsync('gmail_tokens');
      await SecureStore.deleteItemAsync('gmail_profile');

      console.log('✅ Gmail disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
    }
  }

  /**
   * Test email sending
   */
  async sendTestEmail(): Promise<boolean> {
    const profile = await this.getUserProfile();
    if (!profile) {
      console.error('No user profile available');
      return false;
    }

    return await this.sendEmail({
      to: profile.email,
      subject: 'Test Email from Active Residents',
      body: 'This is a test email sent from the Active Residents app to verify Gmail integration is working correctly.\n\nIf you receive this, your email connection is working!',
    });
  }
}

export default new EmailService();
