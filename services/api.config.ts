/**
 * API Configuration
 * Contains all API endpoints and keys for external services
 */

import { ENV } from '../config/env';

export const API_CONFIG = {
  // Postcodes.io - Free UK postcode lookup (no auth required)
  POSTCODES_IO: {
    BASE_URL: 'https://api.postcodes.io',
  },

  // Cloudinary - Image upload and optimization
  // Sign up at https://cloudinary.com for free tier
  CLOUDINARY: {
    CLOUD_NAME: 'dxozeg8hj', // Your Cloudinary cloud name
    UPLOAD_PRESET: 'community_connect', // You'll create this in the next step
    API_KEY: '282463396298867', // Your API key (optional for unsigned uploads)
    UPLOAD_URL: 'https://api.cloudinary.com/v1_1',
  },

  // ONS Geoportal - UK Local Authority boundaries
  ONS_GEOPORTAL: {
    BASE_URL: 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services',
  },

  // Google Maps (for static map images)
  // Get API key from https://console.cloud.google.com
  GOOGLE_MAPS: {
    API_KEY: ENV.GOOGLE_MAPS_API_KEY,
    STATIC_MAP_URL: 'https://maps.googleapis.com/maps/api/staticmap',
  },
};

// API request timeout in milliseconds
export const API_TIMEOUT = 10000;

// Common headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
