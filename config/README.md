# Environment Configuration

This directory contains environment configuration for API keys and sensitive data.

## Local Development

1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys in the `.env` file

3. The app will automatically load these values during development

## Production Builds (EAS)

For production builds, use EAS secrets to securely store API keys:

```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login to your Expo account
eas login

# Create secrets for your project
eas secret:create --scope project --name GEMINI_API_KEY --value "your-actual-key"
eas secret:create --scope project --name NEWS_API_KEY --value "your-actual-key"
eas secret:create --scope project --name PERPLEXITY_API_KEY --value "your-actual-key"
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value "your-actual-key"
eas secret:create --scope project --name API_BASE_URL --value "https://api.yourbackend.com"
eas secret:create --scope project --name USE_MOCK_DATA --value "false"
```

## Usage in Code

Import the ENV object from `config/env.ts`:

```typescript
import { ENV } from '../config/env';

// Use the environment variables
const apiKey = ENV.GEMINI_API_KEY;
const baseUrl = ENV.API_BASE_URL;
```

## Security Notes

- Never commit actual API keys to git
- The `.env` file is already in `.gitignore`
- Use EAS secrets for production builds
- Rotate keys regularly
- Use different keys for development and production
