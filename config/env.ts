import Constants from 'expo-constants';

/**
 * Environment configuration for API keys and sensitive data
 *
 * For local development:
 * - Create a .env file in the root directory with your keys
 *
 * For production builds:
 * - Use EAS secrets: eas secret:create --scope project --name GEMINI_API_KEY --value "your-key"
 */

interface EnvConfig {
  GEMINI_API_KEY: string;
  OPENAI_API_KEY: string;
  NEWS_API_KEY: string;
  PERPLEXITY_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  SENDGRID_API_KEY: string;
  GOOGLE_IOS_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  API_BASE_URL: string;
  USE_MOCK_DATA: boolean;
}

const getEnvConfig = (): EnvConfig => {
  // In production, use EAS secrets via Constants.expoConfig.extra
  // In development, use environment variables or fallback to empty strings
  const extra = Constants.expoConfig?.extra || {};

  return {
    GEMINI_API_KEY: extra.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
    OPENAI_API_KEY: extra.OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
    NEWS_API_KEY: extra.NEWS_API_KEY || process.env.NEWS_API_KEY || '',
    PERPLEXITY_API_KEY: extra.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY || '',
    GOOGLE_MAPS_API_KEY: extra.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
    SENDGRID_API_KEY: extra.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY || '',
    GOOGLE_IOS_CLIENT_ID: extra.GOOGLE_IOS_CLIENT_ID || process.env.GOOGLE_IOS_CLIENT_ID || '',
    GOOGLE_ANDROID_CLIENT_ID: extra.GOOGLE_ANDROID_CLIENT_ID || process.env.GOOGLE_ANDROID_CLIENT_ID || '',
    GOOGLE_WEB_CLIENT_ID: extra.GOOGLE_WEB_CLIENT_ID || process.env.GOOGLE_WEB_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: extra.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '',
    API_BASE_URL: extra.API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3000/api',
    USE_MOCK_DATA: extra.USE_MOCK_DATA !== undefined ? extra.USE_MOCK_DATA : false,
  };
};

export const ENV = getEnvConfig();

// Validation helper - warns if required keys are missing
export const validateEnv = () => {
  const warnings: string[] = [];

  if (!ENV.GEMINI_API_KEY) warnings.push('GEMINI_API_KEY is not set');
  if (!ENV.NEWS_API_KEY) warnings.push('NEWS_API_KEY is not set');
  if (!ENV.PERPLEXITY_API_KEY) warnings.push('PERPLEXITY_API_KEY is not set');
  if (!ENV.GOOGLE_MAPS_API_KEY) warnings.push('GOOGLE_MAPS_API_KEY is not set');

  if (warnings.length > 0 && !__DEV__) {
    console.warn('⚠️ Missing environment variables:', warnings.join(', '));
  }

  return warnings.length === 0;
};
