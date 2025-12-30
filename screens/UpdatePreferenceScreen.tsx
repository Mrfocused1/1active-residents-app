import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface UpdatePreferenceScreenProps {
  onBack?: () => void;
  onContinue?: (preference: number) => void;
  onSkip?: () => void;
}

const UpdatePreferenceScreen: React.FC<UpdatePreferenceScreenProps> = ({
  onBack,
  onContinue,
  onSkip,
}) => {
  const [sliderValue, setSliderValue] = useState(75); // 0-100
  const [isDragging, setIsDragging] = useState(false);

  // Store slider position and dimensions
  const sliderRef = useRef<View>(null);
  const sliderDimensions = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const pageXOffset = useRef(0);

  // Animation values for floating cards
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for main card
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -8,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Delayed floating animation for background cards
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim2, {
            toValue: -6,
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
    }, 1500);
  }, []);

  // Get label text based on slider value
  const getPreferenceLabel = (value: number) => {
    if (value < 25) return 'Not Important';
    if (value < 50) return 'Slightly Important';
    if (value < 75) return 'Important';
    return 'Quite Important';
  };

  const updateSliderFromTouch = (pageX: number) => {
    const { width, x } = sliderDimensions.current;
    if (width === 0) return;

    // Calculate position relative to slider using pageX and slider's absolute position
    const relativeX = pageX - x;
    const percentage = Math.max(0, Math.min(100, (relativeX / width) * 100));
    setSliderValue(Math.round(percentage));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        setIsDragging(true);

        // Measure slider position when touch starts
        if (sliderRef.current) {
          sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            sliderDimensions.current = { x: pageX, y: pageY, width, height };
            // Store offset for future calculations
            pageXOffset.current = event.nativeEvent.pageX - event.nativeEvent.locationX;
            updateSliderFromTouch(event.nativeEvent.pageX);
          });
        }
      },
      onPanResponderMove: (event) => {
        // Use pageX for consistent behavior across platforms
        updateSliderFromTouch(event.nativeEvent.pageX);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    })
  ).current;

  const handleContinue = () => {
    if (onContinue) {
      onContinue(sliderValue);
    }
  };

  return (
    <View style={styles.container}>
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

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <View style={styles.backButtonInner}>
            <MaterialIcons name="arrow-back" size={24} color="#1E293B" />
          </View>
        </TouchableOpacity>

        {/* Wave Curve */}
        <View style={styles.waveCurve} />

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Main Featured Notification Card */}
          <Animated.View style={[styles.mainCardWrapper, { transform: [{ translateY: floatAnim1 }] }]}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainCard}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <MaterialIcons name="notifications-active" size={18} color="#FDE047" />
                  <Text style={styles.cardTitle}>Update Received</Text>
                </View>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>Just now</Text>
                </View>
              </View>

              {/* Content Box */}
              <View style={styles.cardContentBox}>
                <View style={styles.cardContentHeader}>
                  <MaterialIcons name="lightbulb" size={14} color="#BFDBFE" />
                  <Text style={styles.cardContentTitle}>Broken Street Light</Text>
                </View>
                <Text style={styles.cardContentText}>
                  Good news! The maintenance team has been scheduled for repair tomorrow morning.
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Background Cards */}
          <View style={styles.backgroundCards}>
            {/* Left Card */}
            <Animated.View style={[styles.bgCard, styles.bgCardLeft, { transform: [{ translateY: floatAnim2 }, { scale: 0.95 }, { translateX: -8 }, { rotate: '-2deg' }] }]}>
              <View style={styles.bgCardIconRed}>
                <MaterialIcons name="warning" size={20} color="#EF4444" />
              </View>
              <View style={styles.bgCardContent}>
                <View style={styles.bgCardLine} />
                <View style={[styles.bgCardLine, styles.bgCardLineShort]} />
              </View>
            </Animated.View>

            {/* Right Card */}
            <Animated.View style={[styles.bgCard, styles.bgCardRight, { transform: [{ translateY: floatAnim2 }, { scale: 0.9 }, { translateX: 8 }, { rotate: '1deg' }] }]}>
              <View style={styles.bgCardIconPurple}>
                <MaterialIcons name="brush" size={20} color="#A855F7" />
              </View>
              <View style={styles.bgCardContent}>
                <View style={[styles.bgCardLine, styles.bgCardLineMedium]} />
                <Text style={styles.bgCardSmallText}>Council notified</Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Bottom Section - Content */}
      <View style={styles.bottomSection}>
        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Your Update{'\n'}
            <Text style={styles.titleAccent}>Preference</Text>
          </Text>
          <Text style={styles.description}>
            How important is it to you to get quick updates on your reported issues?
          </Text>
        </View>

        {/* Slider Component */}
        <View style={styles.sliderContainer}>
          {/* Label Above Slider */}
          <View style={[styles.sliderLabel, { left: `${sliderValue}%` }]}>
            <View style={styles.sliderLabelBox}>
              <Text style={styles.sliderLabelText}>{getPreferenceLabel(sliderValue)}</Text>
            </View>
            <View style={styles.sliderLabelArrow} />
          </View>

          {/* Slider Track */}
          <View
            ref={sliderRef}
            style={styles.sliderTrack}
            {...panResponder.panHandlers}
          >
            {/* Filled portion */}
            <LinearGradient
              colors={['#93C5FD', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.sliderFill, { width: `${sliderValue}%` }]}
            />

            {/* Slider Thumb */}
            <View style={[styles.sliderThumb, { left: `${sliderValue}%` }]}>
              <View style={[
                styles.sliderThumbInner,
                isDragging && styles.sliderThumbDragging
              ]}>
                <View style={styles.sliderThumbDot} />
              </View>
            </View>
          </View>

          {/* Labels */}
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelEnd}>NOT IMPORTANT</Text>
            <Text style={styles.sliderLabelEnd}>VERY IMPORTANT</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Pagination Dots */}
          <View style={styles.paginationDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Indicator */}
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
    flex: 1,
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
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 50,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  waveCurve: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
    paddingTop: 32,
    paddingBottom: 48,
    zIndex: 10,
  },

  // Main Card
  mainCardWrapper: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
  },
  mainCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  cardContentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  cardContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    opacity: 0.9,
  },
  cardContentTitle: {
    color: '#BFDBFE',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContentText: {
    color: '#BFDBFE',
    fontSize: 12,
    lineHeight: 18,
  },

  // Background Cards
  backgroundCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
    marginTop: 16,
  },
  bgCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bgCardLeft: {
    opacity: 0.8,
  },
  bgCardRight: {
    opacity: 0.6,
  },
  bgCardIconRed: {
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 8,
  },
  bgCardIconPurple: {
    backgroundColor: '#F3E8FF',
    padding: 8,
    borderRadius: 8,
  },
  bgCardContent: {
    flex: 1,
    gap: 6,
  },
  bgCardLine: {
    height: 8,
    width: 96,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  bgCardLineShort: {
    width: 64,
    backgroundColor: '#F3F4F6',
  },
  bgCardLineMedium: {
    width: 80,
  },
  bgCardSmallText: {
    fontSize: 10,
    color: '#9CA3AF',
  },

  // Bottom Section Styles
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 0,
    paddingBottom: 40,
    alignItems: 'center',
    zIndex: 20,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 32,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 36,
    lineHeight: 44,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  titleAccent: {
    color: '#3B82F6',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
    textAlign: 'center',
  },

  // Slider Styles
  sliderContainer: {
    width: '100%',
    marginTop: 48,
    marginBottom: 32,
  },
  sliderLabel: {
    position: 'absolute',
    top: -40,
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    zIndex: 10,
  },
  sliderLabelBox: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sliderLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
  sliderLabelArrow: {
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
  sliderTrack: {
    height: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 32,
    transform: [{ translateX: -16 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderThumbInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderThumbDragging: {
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  sliderThumbDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  sliderLabelEnd: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.5,
  },

  // Buttons
  buttonsContainer: {
    width: '100%',
    marginTop: 'auto',
    alignItems: 'center',
  },
  continueButton: {
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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

export default UpdatePreferenceScreen;
