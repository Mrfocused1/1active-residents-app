export default {
  expo: {
    name: "Active Residents",
    slug: "active-residents",
    owner: "mrbusy2",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "activeresidents",
    icon: "./assets/icon.png",
    extra: {
      eas: {
        projectId: "ecb6be5e-8e8a-460e-adec-961049391f16"
      },
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      NEWS_API_KEY: process.env.NEWS_API_KEY,
      PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      API_BASE_URL: process.env.API_BASE_URL,
      USE_MOCK_DATA: process.env.USE_MOCK_DATA === "true"
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#5B7CFA"
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "uk.co.activeresidents.mobile",
      buildNumber: "3",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Active Residents uses your location to show nearby community issues on the map.",
        NSCameraUsageDescription: "Active Residents uses your camera to take photos of community issues you want to report.",
        NSPhotoLibraryUsageDescription: "Active Residents needs access to your photo library to upload photos of community issues.",
        NSMicrophoneUsageDescription: "Active Residents uses your microphone to record videos of community issues."
      }
    },
    android: {
      package: "uk.co.activeresidents.mobile",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES"
      ]
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Active Residents to use your location to show nearby community issues."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app needs access to your photos to upload images of community issues.",
          cameraPermission: "The app needs access to your camera to take photos of community issues."
        }
      ],
      "expo-web-browser",
      "expo-secure-store",
      "expo-font"
    ]
  }
};
