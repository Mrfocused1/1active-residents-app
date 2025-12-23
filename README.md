# Active Residents - React Native Mobile App

A beautiful mobile app connecting UK residents with their local councils, built with React Native and Expo.

## Features

- Animated floating cards showcasing app functionality
- Smooth gradient backgrounds
- Material Icons integration
- Responsive design for various screen sizes
- Professional UI with proper spacing and typography
- Ready-to-use with Expo

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

## Installation

1. Install dependencies:

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

2. Start the Expo development server:

```bash
npx expo start
```

Or if you have Expo CLI installed globally:

```bash
expo start
```

## Running the App

After starting the development server, you can run the app on:

- **iOS Simulator**: Press `i` in the terminal (macOS only, requires Xcode)
- **Android Emulator**: Press `a` in the terminal (requires Android Studio)
- **Physical Device**: Scan the QR code with the Expo Go app
  - [Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)
  - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Project Structure

```
mobile app1/
├── App.tsx                 # Main app entry point
├── OnboardingScreen.tsx    # Onboarding screen component
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Key Components Used

- **LinearGradient** (expo-linear-gradient): For background gradients
- **MaterialIcons** (@expo/vector-icons): For icons
- **Animated API**: For floating card animations
- **StyleSheet**: For styling components

## Customization

### Colors

The main colors used in the app can be found in `OnboardingScreen.tsx` styles:

- Primary Blue: `#3B82F6`
- Primary Dark: `#2563EB`
- Background Light: `#F3F6FC`
- Text Main: `#1E293B`
- Text Sub: `#64748B`

### Animations

Floating animations are configured in the `useEffect` hook. Adjust duration and timing:

```typescript
Animated.timing(floatAnim1, {
  toValue: -10,
  duration: 3000, // Change this value
  useNativeDriver: true,
})
```

### Card Content

Modify the card content in the JSX to showcase your app's features:

- Update icon names (search MaterialIcons documentation)
- Change text content
- Adjust colors and styles

## Converting to Dark Mode

To add dark mode support:

1. Use React Native's `useColorScheme` hook
2. Create separate color schemes for light/dark modes
3. Update styles dynamically based on the color scheme

Example:
```typescript
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';
```

## Navigation Integration

To integrate with React Navigation:

1. Install React Navigation:
```bash
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

2. Wrap your screens in a navigation container
3. Add navigation prop to buttons

## Next Steps

- Add more onboarding slides with a swiper component (like `react-native-swiper`)
- Implement actual navigation to login/signup screens
- Add TypeScript types for better type safety
- Connect buttons to actual authentication flow

## Dependencies

- `expo`: ~51.0.0
- `expo-linear-gradient`: ~13.0.2
- `@expo/vector-icons`: ^14.0.0
- `react`: 18.2.0
- `react-native`: 0.74.5

## License

This project is open source and available for use in your applications.

## Support

For issues or questions about React Native or Expo, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
