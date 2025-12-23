import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.28;

interface Region {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const regions: Region[] = [
  { id: 'england', name: 'England', icon: 'cottage' },
  { id: 'scotland', name: 'Scotland', icon: 'landscape' },
  { id: 'wales', name: 'Wales', icon: 'hiking' },
  { id: 'northern-ireland', name: 'Northern Ireland', icon: 'sailing' },
];

interface RegionSelectionScreenProps {
  onBack?: () => void;
  onNext?: (region: string) => void;
}

const RegionSelectionScreen: React.FC<RegionSelectionScreenProps> = ({
  onBack,
  onNext,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('england');

  const handleNext = () => {
    if (onNext) {
      onNext(selectedRegion);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
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

        {/* Floating Icon Card */}
        <View style={styles.floatingIconContainer}>
          <View style={styles.floatingIconCard}>
            <LinearGradient
              colors={['#DBEAFE', '#CCFBF1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <MaterialIcons name="public" size={48} color="#3B82F6" />
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Where in the UK{'\n'}
            <Text style={styles.titleAccent}>do you live?</Text>
          </Text>
          <Text style={styles.description}>
            Select your region. This helps us direct your reports to the correct local authorities.
          </Text>
        </View>

        {/* Region Options */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {regions.map((region) => {
            const isSelected = selectedRegion === region.id;
            return (
              <TouchableOpacity
                key={region.id}
                style={styles.regionButton}
                onPress={() => setSelectedRegion(region.id)}
                activeOpacity={0.7}
              >
                {isSelected && <View style={styles.selectedGlow} />}
                <View style={[styles.regionCard, isSelected && styles.regionCardSelected]}>
                  <View style={styles.regionLeft}>
                    <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                      <MaterialIcons
                        name={region.icon}
                        size={20}
                        color={isSelected ? '#3B82F6' : '#6B7280'}
                      />
                    </View>
                    <Text style={[styles.regionName, isSelected && styles.regionNameSelected]}>
                      {region.name}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={28}
                    color={isSelected ? '#3B82F6' : '#D1D5DB'}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Pagination Dots */}
          <View style={styles.paginationDots}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextButtonText}>Next</Text>
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

  // Header Styles
  headerSection: {
    height: HEADER_HEIGHT,
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
    height: 100,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    zIndex: 20,
  },
  floatingIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
    zIndex: 10,
  },
  floatingIconCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  iconGradient: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content Styles
  contentSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 32,
    zIndex: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    lineHeight: 36,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleAccent: {
    color: '#3B82F6',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },

  // Region Options
  regionButton: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  selectedGlow: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    transform: [{ scale: 1.02 }],
  },
  regionCard: {
    width: '100%',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  regionCardSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  regionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircleSelected: {
    backgroundColor: '#FFFFFF',
  },
  regionName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1E293B',
  },
  regionNameSelected: {
    fontWeight: '600',
    color: '#1E293B',
  },

  // Bottom Section
  bottomSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
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
  nextButton: {
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
  nextButtonText: {
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

export default RegionSelectionScreen;
