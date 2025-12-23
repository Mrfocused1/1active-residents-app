# API Integration Guide

This guide explains how to configure and use the integrated APIs in the Active Residents app.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Available APIs](#available-apis)
3. [Setup Instructions](#setup-instructions)
4. [Service Usage](#service-usage)
5. [Examples](#examples)

---

## Overview

The app integrates several external APIs to provide real-world functionality:

- **Postcodes.io** - Free UK postcode lookup and council identification
- **expo-location** - Device geolocation services
- **Cloudinary** - Image upload and optimization
- **react-native-maps** - Interactive mapping (ready to use)

---

## Available APIs

### 1. Postcodes.io
**Status:** ✅ Ready to use (no configuration required)
**Cost:** Free
**Documentation:** https://postcodes.io/docs

Features:
- Lookup postcode details
- Reverse geocoding (coordinates → postcode)
- Find nearby postcodes
- Identify local council from postcode
- Postcode validation and autocomplete

### 2. expo-location
**Status:** ✅ Installed and ready
**Cost:** Free (built into Expo)
**Documentation:** https://docs.expo.dev/versions/latest/sdk/location/

Features:
- Get current device location
- Reverse geocoding (coordinates → address)
- Forward geocoding (address → coordinates)
- Watch location changes in real-time
- Calculate distances between coordinates

### 3. Cloudinary
**Status:** ⚙️ Requires configuration
**Cost:** Free tier available (25 GB storage, 25 GB bandwidth/month)
**Sign up:** https://cloudinary.com/users/register/free

Features:
- Image upload with automatic optimization
- Image resizing and compression
- CDN delivery
- Thumbnail generation
- Multiple image uploads

### 4. react-native-maps
**Status:** ✅ Installed and ready
**Cost:** Free
**Documentation:** https://docs.expo.dev/versions/latest/sdk/map-view/

Features:
- Interactive maps
- Custom markers
- Region selection
- User location display

---

## Setup Instructions

### Step 1: Postcodes.io (No Setup Required)
Postcodes.io is **free and requires no API key**. It's ready to use immediately!

### Step 2: expo-location (Requires Permissions)
Location services require user permission at runtime. The service handles this automatically:

```typescript
import { LocationService } from './services';

// Permission will be requested when you call this
const location = await LocationService.getCurrentLocation();
```

**iOS Configuration (app.json):**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "This app needs your location to help identify your local council and report issues accurately."
      }
    }
  }
}
```

**Android Configuration (app.json):**
```json
{
  "expo": {
    "android": {
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
    }
  }
}
```

### Step 3: Cloudinary (Optional - For Image Uploads)

#### 1. Create a free account at https://cloudinary.com

#### 2. Get your credentials:
   - Go to Dashboard
   - Note your **Cloud Name**
   - Go to Settings → Upload
   - Create an **Upload Preset**:
     - Click "Add upload preset"
     - Set Signing Mode to "Unsigned"
     - Name it (e.g., "community_connect")
     - Save

#### 3. Add credentials to `services/api.config.ts`:
```typescript
CLOUDINARY: {
  CLOUD_NAME: 'your_cloud_name_here',
  UPLOAD_PRESET: 'your_upload_preset_here',
  // ...
}
```

### Step 4: Google Maps (Optional - For Static Map Images)

If you want to use Google Maps for static map previews:

#### 1. Get an API key:
   - Go to https://console.cloud.google.com
   - Create a project
   - Enable "Maps Static API"
   - Create credentials (API Key)

#### 2. Add to `services/api.config.ts`:
```typescript
GOOGLE_MAPS: {
  API_KEY: 'your_google_maps_api_key_here',
  // ...
}
```

---

## Service Usage

### PostcodesService

```typescript
import { PostcodesService } from './services';

// Lookup a postcode
const data = await PostcodesService.lookupPostcode('SW1A 1AA');
console.log(data.admin_district); // "Westminster"
console.log(data.latitude, data.longitude);

// Find council from postcode
const council = await PostcodesService.getCouncilFromPostcode('SW1A 1AA');
console.log(council.name); // "Westminster"

// Reverse geocode (coordinates to postcode)
const postcodes = await PostcodesService.reverseGeocode(51.5074, -0.1278);
console.log(postcodes[0].postcode);

// Autocomplete postcode
const suggestions = await PostcodesService.autocomplete('SW1');
console.log(suggestions); // ['SW1A 0AA', 'SW1A 0AB', ...]

// Validate postcode
const isValid = await PostcodesService.validatePostcode('SW1A 1AA');
console.log(isValid); // true
```

### LocationService

```typescript
import { LocationService } from './services';

// Get current location
const location = await LocationService.getCurrentLocation();
console.log(location.latitude, location.longitude);

// Get current location with address
const data = await LocationService.getCurrentLocationWithAddress();
console.log(data.address.formattedAddress);
console.log(data.coordinates.latitude);

// Get council from current location
const council = await LocationService.getCurrentCouncil();
console.log(council.name, council.code);

// Reverse geocode
const address = await LocationService.getAddressFromCoordinates(51.5074, -0.1278);
console.log(address.city, address.postalCode);

// Forward geocode
const coords = await LocationService.getCoordinatesFromAddress('10 Downing Street, London');
console.log(coords.latitude, coords.longitude);

// Watch location changes
const subscription = await LocationService.watchLocation((location) => {
  console.log('Location updated:', location);
});
// Stop watching:
subscription?.remove();

// Calculate distance between two points
const distance = LocationService.calculateDistance(
  51.5074, -0.1278, // London
  51.5074, -0.1279  // Nearby point
);
console.log(`Distance: ${distance} meters`);
```

### CloudinaryService

```typescript
import { CloudinaryService } from './services';

// Pick image from gallery
const image = await CloudinaryService.pickImage();
if (image) {
  console.log('Selected image:', image.uri);
}

// Take photo with camera
const photo = await CloudinaryService.takePhoto();
if (photo) {
  console.log('Captured photo:', photo.uri);
}

// Upload image to Cloudinary
const result = await CloudinaryService.uploadImage(image.uri, {
  folder: 'issue-reports',
  tags: ['pothole', 'road'],
  resize: true, // Auto-resize to 1600px
  compressionQuality: 0.7,
});

console.log('Uploaded image URL:', result.secureUrl);
console.log('Thumbnail URL:', result.thumbnailUrl);

// Upload multiple images
const results = await CloudinaryService.uploadMultipleImages(
  [image1.uri, image2.uri, image3.uri],
  { folder: 'issue-reports' }
);

console.log(`Uploaded ${results.length} images`);

// Resize image locally (before upload)
const resizedUri = await CloudinaryService.resizeImage(image.uri, 800, 0.8);
```

### CouncilsService

```typescript
import { CouncilsService } from './services';

// Get all UK regions
const regions = CouncilsService.getRegions();
console.log(regions); // [{ id: 'england', name: 'England', ... }, ...]

// Get councils by region
const councils = await CouncilsService.getCouncilsByRegion('england');
console.log(councils.length); // Number of councils

// Search councils
const results = await CouncilsService.searchCouncils('Westminster');
console.log(results[0].name);

// Get council by postcode (uses Postcodes.io)
const council = await CouncilsService.getCouncilByPostcode('SW1A 1AA');
console.log(council.name, council.code);

// Get nearest council (uses location)
const nearest = await CouncilsService.getNearestCouncil();
console.log('Your council:', nearest.name);

// Get issue categories
const categories = CouncilsService.getIssueCategories();
console.log(categories); // Roads, Rubbish, Lighting, etc.

// Get council by ID
const westminster = await CouncilsService.getCouncilById('westminster');
console.log(westminster.website);
```

---

## Examples

### Example 1: Find User's Council on Onboarding

```typescript
import { LocationService, CouncilsService } from './services';

const findUserCouncil = async () => {
  try {
    // Get current location
    const location = await LocationService.getCurrentLocation();
    if (!location) {
      console.log('Location permission denied');
      return;
    }

    // Find nearest council
    const council = await LocationService.getCurrentCouncil();
    if (council) {
      console.log(`You're in: ${council.name}`);
      // Auto-select this council
      setSelectedCouncil(council);
    }
  } catch (error) {
    console.error('Error finding council:', error);
  }
};
```

### Example 2: Report Issue with Location and Photo

```typescript
import { LocationService, CloudinaryService } from './services';

const submitIssueReport = async () => {
  try {
    // 1. Get current location
    const locationData = await LocationService.getCurrentLocationWithAddress();
    if (!locationData) throw new Error('Could not get location');

    // 2. Take photo
    const photo = await CloudinaryService.takePhoto();
    if (!photo) throw new Error('No photo taken');

    // 3. Upload photo
    const uploadResult = await CloudinaryService.uploadImage(photo.uri, {
      folder: 'issue-reports',
      tags: ['pothole'],
    });

    // 4. Create report data
    const reportData = {
      category: 'roads',
      description: 'Deep pothole causing damage to vehicles',
      location: {
        latitude: locationData.coordinates.latitude,
        longitude: locationData.coordinates.longitude,
        address: locationData.address.formattedAddress,
      },
      photos: [uploadResult.secureUrl],
      photoThumbnails: [uploadResult.thumbnailUrl],
      timestamp: new Date().toISOString(),
    };

    console.log('Report ready to submit:', reportData);
    // Submit to your backend API

  } catch (error) {
    console.error('Error submitting report:', error);
  }
};
```

### Example 3: Postcode Lookup for Address Entry

```typescript
import { PostcodesService } from './services';
import { useState } from 'react';

const [postcode, setPostcode] = useState('');
const [suggestions, setSuggestions] = useState([]);

// Autocomplete as user types
const handlePostcodeInput = async (text: string) => {
  setPostcode(text);

  if (text.length >= 3) {
    const results = await PostcodesService.autocomplete(text);
    setSuggestions(results);
  }
};

// When user selects a postcode
const handlePostcodeSelect = async (selectedPostcode: string) => {
  const data = await PostcodesService.lookupPostcode(selectedPostcode);

  if (data) {
    // Auto-fill address details
    setAddress({
      postcode: data.postcode,
      city: data.admin_district,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  }
};
```

### Example 4: Council Search with Real Data

```typescript
import { CouncilsService, PostcodesService } from './services';
import { useState } from 'react';

const [searchQuery, setSearchQuery] = useState('');
const [councils, setCouncils] = useState([]);

const handleSearch = async (query: string) => {
  setSearchQuery(query);

  // If query looks like a postcode
  if (query.match(/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i)) {
    const council = await CouncilsService.getCouncilByPostcode(query);
    if (council) {
      setCouncils([council]);
    }
  } else {
    // Search by name
    const results = await CouncilsService.searchCouncils(query);
    setCouncils(results);
  }
};
```

---

## Error Handling

All services throw errors that should be caught:

```typescript
try {
  const council = await CouncilsService.getNearestCouncil();
} catch (error) {
  if (error.message.includes('permission')) {
    // Handle permission denied
    Alert.alert('Permission Required', 'Please enable location services');
  } else if (error.message.includes('network')) {
    // Handle network error
    Alert.alert('Network Error', 'Please check your internet connection');
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

---

## Rate Limits

### Postcodes.io
- No rate limits
- Free unlimited use
- No API key required

### Cloudinary Free Tier
- 25 GB storage
- 25 GB bandwidth per month
- 10,000 transformations per month

### expo-location
- No rate limits
- Device-dependent accuracy
- Requires user permission

---

## Next Steps

1. **Configure Cloudinary** (if using image uploads)
2. **Test location services** on a real device
3. **Update screens** to use real APIs instead of mock data
4. **Build backend API** for storing reports
5. **Add authentication** system
6. **Implement push notifications** for status updates

---

## Support

For API-specific issues:
- Postcodes.io: https://github.com/ideal-postcodes/postcodes.io
- Expo Location: https://docs.expo.dev/versions/latest/sdk/location/
- Cloudinary: https://support.cloudinary.com/
- React Native Maps: https://github.com/react-native-maps/react-native-maps

---

## License

This integration guide is part of the Active Residents app.
