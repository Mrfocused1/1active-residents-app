import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const TOP_SECTION_HEIGHT = height * 0.25;

interface UserDetailsScreenProps {
  onBack?: () => void;
  onNext?: (data: { name: string }) => void;
  onSkip?: () => void;
}

const UserDetailsScreen: React.FC<UserDetailsScreenProps> = ({
  onBack,
  onNext,
  onSkip,
}) => {
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      if (onNext) {
        onNext({ name: name.trim() });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Top Section with Wave */}
        <View style={styles.topSection}>
          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Decorative Blobs */}
          <View style={[styles.blob, styles.blobTopLeft]} />
          <View style={[styles.blob, styles.blobTopRight]} />

          {/* Header Buttons */}
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
              <MaterialIcons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSkip} activeOpacity={0.8}>
              <Text style={styles.skipButton}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Wave Curve */}
          <View style={styles.waveContainer}>
            <Svg
              width={width}
              height={100}
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              style={styles.wave}
            >
              <Path
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                fill="#FFFFFF"
              />
            </Svg>
          </View>
        </View>

        {/* Content Section */}
        <ScrollView
          style={styles.contentSection}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Dots */}
          <View style={styles.progressDots}>
            <View style={styles.dotInactive} />
            <View style={styles.dotActive} />
            <View style={styles.dotInactive} />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Tell us about{'\n'}
              <Text style={styles.titleAccent}>yourself</Text>
            </Text>
            <Text style={styles.subtitle}>
              We need a few details to personalize your community experience and ensure valid
              reports.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <MaterialIcons name="person" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sarah Jenkins"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.nextButton, !name.trim() && styles.nextButtonDisabled]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!name.trim()}
            >
              <LinearGradient
                colors={!name.trim() ? ['#9CA3AF', '#9CA3AF'] : ['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Indicator */}
        <View style={styles.bottomIndicator} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Top Section
  topSection: {
    height: TOP_SECTION_HEIGHT,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
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

  // Header Buttons
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skipButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // Wave
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  wave: {
    position: 'absolute',
    bottom: -1,
    left: 0,
  },

  // Content Section
  contentSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // Progress Dots
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 32,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  // Title
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 36,
    lineHeight: 44,
    color: '#1E293B',
    marginBottom: 12,
  },
  titleAccent: {
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
  },

  // Form
  form: {
    gap: 24,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  input: {
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 16,
    backgroundColor: '#F3F6FC',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  helpText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginLeft: 4,
    marginTop: 8,
  },
  helpTextContent: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#64748B',
  },

  // Button
  buttonContainer: {
    marginTop: 24,
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonDisabled: {
    shadowOpacity: 0.1,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
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

export default UserDetailsScreen;
