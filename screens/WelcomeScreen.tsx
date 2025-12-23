import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.55;

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onLogin }) => {
  // Animation values for floating cards
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for first set of cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Delayed floating animation for center card
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim2, {
            toValue: -10,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim2, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Section with Cards */}
      <View style={styles.topSection}>
        {/* Background Gradient */}
        <LinearGradient
          colors={['#EFF6FF', '#DBEAFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative Blobs */}
        <View style={[styles.blob, styles.blobTopLeft]} />
        <View style={[styles.blob, styles.blobTopRight]} />

        {/* Wave Curve at Bottom */}
        <View style={styles.waveCurve} />

        {/* Floating Cards */}
        <View style={styles.cardsContainer}>
          {/* Card 1 - Warning Card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardWarning,
              { transform: [{ translateY: floatAnim1 }, { rotate: '-3deg' }] },
            ]}
          >
            <View style={styles.cardIconContainer}>
              <View style={[styles.iconBg, styles.iconBgRed]}>
                <MaterialIcons name="warning" size={20} color="#EF4444" />
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.placeholderLine} />
              <View style={[styles.placeholderLine, styles.placeholderLineShort]} />
            </View>
            <Text style={styles.cardTime}>2m ago</Text>
          </Animated.View>

          {/* Card 2 - Main Featured Card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardFeatured,
              { transform: [{ translateY: floatAnim2 }, { rotate: '2deg' }] },
            ]}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardFeaturedGradient}
            >
              <View style={styles.cardFeaturedHeader}>
                <View style={styles.cardFeaturedTitle}>
                  <MaterialIcons name="lightbulb" size={18} color="#FDE047" />
                  <Text style={styles.cardFeaturedTitleText}>Broken Street Light</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Reported</Text>
                </View>
              </View>

              <View style={styles.cardFeaturedLocation}>
                <MaterialIcons name="place" size={14} color="#BFDBFE" />
                <Text style={styles.cardFeaturedLocationText}>High Street, Westminster</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>

              <View style={styles.cardFeaturedFooter}>
                <Text style={styles.cardFeaturedFooterText}>Status: In Progress</Text>
                <Text style={styles.cardFeaturedFooterText}>Est. fix: Tomorrow</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Card 3 - Success Card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardSuccess,
              { transform: [{ translateY: floatAnim1 }, { rotate: '-1deg' }, { translateX: 16 }] },
            ]}
          >
            <View style={styles.cardIconContainer}>
              <View style={[styles.iconBg, styles.iconBgPurple]}>
                <MaterialIcons name="brush" size={20} color="#A855F7" />
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={[styles.placeholderLine, styles.placeholderLineMedium]} />
              <Text style={styles.cardSuccessText}>Council notified</Text>
            </View>
            <MaterialIcons name="check-circle" size={18} color="#22C55E" />
          </Animated.View>
        </View>
      </View>

      {/* Bottom Section - Content */}
      <View style={styles.bottomSection}>
        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Better community,{'\n'}
            <Text style={styles.titleAccent}>together.</Text>
          </Text>
          <Text style={styles.description}>
            Spot an issue? Report it instantly. From potholes to fly-tipping, let's keep our neighborhoods clean and safe.
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onLogin} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

        {/* Terms Text */}
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </Text>
      </View>

      {/* Bottom Indicator (iPhone home indicator style) */}
      <View style={styles.bottomIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FC',
  },

  // Top Section Styles
  topSection: {
    height: CARD_HEIGHT,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.5,
  },
  blobTopLeft: {
    top: -50,
    left: -50,
    width: 256,
    height: 256,
    backgroundColor: '#BFDBFE',
  },
  blobTopRight: {
    top: '10%',
    right: -20,
    width: 160,
    height: 160,
    backgroundColor: '#99F6E4',
  },
  waveCurve: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },

  // Cards Container
  cardsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
    zIndex: 10,
  },

  // Card Base Styles
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardWarning: {
    maxWidth: 280,
  },
  cardSuccess: {
    maxWidth: 290,
    opacity: 0.9,
  },

  // Card Icon Styles
  cardIconContainer: {
    flexDirection: 'row',
  },
  iconBg: {
    padding: 8,
    borderRadius: 12,
  },
  iconBgRed: {
    backgroundColor: '#FEE2E2',
  },
  iconBgPurple: {
    backgroundColor: '#F3E8FF',
  },

  // Card Content
  cardContent: {
    flex: 1,
    gap: 6,
  },
  placeholderLine: {
    height: 8,
    width: 96,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  placeholderLineShort: {
    width: 64,
    backgroundColor: '#F3F4F6',
  },
  placeholderLineMedium: {
    width: 80,
  },
  cardTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardSuccessText: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  // Featured Card (Main Blue Card)
  cardFeatured: {
    maxWidth: 320,
    padding: 0,
    overflow: 'hidden',
    zIndex: 20,
  },
  cardFeaturedGradient: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
  },
  cardFeaturedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardFeaturedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardFeaturedTitleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  cardFeaturedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardFeaturedLocationText: {
    color: '#BFDBFE',
    fontSize: 12,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(29, 78, 216, 0.5)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    width: '66%',
    height: '100%',
    backgroundColor: '#FACC15',
    borderRadius: 3,
  },
  cardFeaturedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardFeaturedFooterText: {
    color: '#BFDBFE',
    fontSize: 10,
    opacity: 0.8,
  },

  // Bottom Section Styles
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 36,
    lineHeight: 44,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  titleAccent: {
    color: '#3B82F6',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  // Pagination Dots
  paginationDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },

  // Buttons
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginTop: 'auto',
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },

  // Terms Text
  termsText: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
  },

  // Bottom Indicator
  bottomIndicator: {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: [{ translateX: -width * 0.165 }],
    width: width * 0.33,
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
  },
});

export default WelcomeScreen;
