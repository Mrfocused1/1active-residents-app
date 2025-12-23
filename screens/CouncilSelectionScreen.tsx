import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  TextInput,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { CouncilsService, LocationService, PostcodesService } from '../services';
import type { Council } from '../services';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.4;

interface CouncilSelectionScreenProps {
  onBack?: () => void;
  onNext?: (council: string) => void;
  region?: string; // Optional region filter from previous screen
}

const CouncilSelectionScreen: React.FC<CouncilSelectionScreenProps> = ({
  onBack,
  onNext,
  region,
}) => {
  const [selectedCouncil, setSelectedCouncil] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [councils, setCouncils] = useState<Council[]>([]);
  const [filteredCouncils, setFilteredCouncils] = useState<Council[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [nearbyLocation, setNearbyLocation] = useState<string>('Finding your location...');
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Animation values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  // Load councils on mount
  useEffect(() => {
    loadCouncils();
  }, [region]);

  // Filter councils based on search
  useEffect(() => {
    filterCouncils();
  }, [searchText, councils]);

  useEffect(() => {
    // Floating animation for location pin
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Delayed floating for badge
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(badgeAnim, {
            toValue: -10,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(badgeAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 3000);

    // Pulsing ring animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /**
   * Show toast notification with auto-dismiss
   */
  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);

    // Fade in animation
    Animated.spring(toastAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();

    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      // Fade out animation
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToastVisible(false);
      });
    }, 2000);
  };

  /**
   * Load councils from API
   */
  const loadCouncils = async () => {
    try {
      setLoading(true);
      const councilsData = await CouncilsService.getCouncilsByRegion(region);
      setCouncils(councilsData);
      setFilteredCouncils(councilsData);

      // Also try to get nearby location
      getNearbyLocation();
    } catch (error) {
      console.error('Error loading councils:', error);
      Alert.alert('Error', 'Failed to load councils. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get nearby location for "Use current location" button
   */
  const getNearbyLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        const address = await LocationService.getAddressFromCoordinates(
          location.latitude,
          location.longitude
        );
        if (address?.city) {
          setNearbyLocation(`Near ${address.city}, ${address.region || 'UK'}`);
        }
      }
    } catch (error) {
      console.error('Error getting nearby location:', error);
      setNearbyLocation('Location unavailable');
    }
  };

  /**
   * Filter councils based on search text
   * Supports council name search and postcode lookup
   */
  const filterCouncils = async () => {
    if (!searchText.trim()) {
      setFilteredCouncils(councils);
      return;
    }

    const query = searchText.trim();

    // Check if it looks like a UK postcode
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d?[A-Z]{0,2}$/i;

    if (postcodeRegex.test(query)) {
      // Search by postcode
      try {
        const council = await CouncilsService.getCouncilByPostcode(query);
        if (council) {
          // Find matching council in our list or add it
          const existingCouncil = councils.find((c) => c.code === council.code);
          if (existingCouncil) {
            setFilteredCouncils([existingCouncil]);
          } else {
            setFilteredCouncils([council, ...councils]);
          }
        } else {
          setFilteredCouncils([]);
        }
      } catch (error) {
        console.error('Error searching by postcode:', error);
        // Fall back to name search
        searchByName(query);
      }
    } else {
      // Search by name
      searchByName(query);
    }
  };

  /**
   * Search councils by name
   */
  const searchByName = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const filtered = councils.filter(
      (council) =>
        council.name.toLowerCase().includes(lowercaseQuery) ||
        council.location.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredCouncils(filtered);
  };

  /**
   * Use current location to find council
   */
  const handleUseCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const council = await CouncilsService.getNearestCouncil();

      if (council) {
        // Check if council exists in our list
        const existingCouncil = councils.find((c) => c.code === council.code);

        if (existingCouncil) {
          setSelectedCouncil(existingCouncil.id);
        } else {
          // Add new council to the list
          const updatedCouncils = [council, ...councils];
          setCouncils(updatedCouncils);
          setFilteredCouncils(updatedCouncils);
          setSelectedCouncil(council.id);
        }

        showToast(`We've identified your council as ${council.name}`);
      } else {
        Alert.alert(
          'Location Not Found',
          'Unable to identify your council. Please search manually.'
        );
      }
    } catch (error) {
      console.error('Error using current location:', error);
      Alert.alert(
        'Error',
        'Failed to get your location. Please check your location permissions and try again.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedCouncil) {
      Alert.alert('Please Select', 'Please select your local council to continue.');
      return;
    }

    if (onNext) {
      // Find the selected council and pass its name
      const council = councils.find((c) => c.id === selectedCouncil);
      if (council) {
        // Extract just the council name without "Council" suffix
        const councilName = council.name.replace(/\s+Council$/i, '').trim();
        onNext(councilName);
      } else {
        onNext(selectedCouncil);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
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

        {/* Floating Location Icon */}
        <View style={styles.floatingContainer}>
          <Animated.View
            style={[
              styles.locationCircle,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            {/* Grid Pattern Background */}
            <View style={styles.gridPattern} />

            {/* Location Pin */}
            <View style={styles.locationPin}>
              <MaterialIcons name="location-on" size={72} color="#EF4444" />
            </View>

            {/* Pulsing Ring */}
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0.3, 0],
                  }),
                },
              ]}
            />
          </Animated.View>

          {/* "Location found" Badge */}
          <Animated.View
            style={[
              styles.locationBadge,
              { transform: [{ translateY: badgeAnim }, { rotate: '6deg' }] },
            ]}
          >
            <View style={styles.greenDot} />
            <Text style={styles.badgeText}>Location found</Text>
          </Animated.View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Your Local Council</Text>
          <Text style={styles.description}>
            Confirm your local authority so we can direct your reports to the right team.
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter postcode or council name"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <MaterialIcons name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Scrollable Council List */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Use Current Location */}
          <TouchableOpacity
            style={styles.currentLocationButton}
            activeOpacity={0.7}
            onPress={handleUseCurrentLocation}
            disabled={locationLoading}
          >
            <View style={styles.currentLocationIcon}>
              {locationLoading ? (
                <ActivityIndicator size="small" color="#3B82F6" />
              ) : (
                <MaterialIcons name="my-location" size={20} color="#3B82F6" />
              )}
            </View>
            <View style={styles.currentLocationText}>
              <Text style={styles.currentLocationTitle}>
                {locationLoading ? 'Finding council...' : 'Use current location'}
              </Text>
              <Text style={styles.currentLocationSubtitle}>{nearbyLocation}</Text>
            </View>
          </TouchableOpacity>

          {/* Suggestions Header */}
          <Text style={styles.suggestionsHeader}>
            {loading ? 'LOADING...' : `${filteredCouncils.length} COUNCILS`}
          </Text>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading councils...</Text>
            </View>
          )}

          {/* No Results */}
          {!loading && filteredCouncils.length === 0 && (
            <View style={styles.noResultsContainer}>
              <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
              <Text style={styles.noResultsText}>No councils found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching by postcode or council name
              </Text>
            </View>
          )}

          {/* Council Options */}
          {!loading &&
            filteredCouncils.map((council) => {
              const isSelected = selectedCouncil === council.id;
              return (
                <TouchableOpacity
                  key={council.id}
                  style={[styles.councilButton, isSelected && styles.councilButtonSelected]}
                  onPress={() => setSelectedCouncil(council.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.councilIcon, isSelected && styles.councilIconSelected]}>
                    <MaterialIcons
                      name="account-balance"
                      size={20}
                      color={isSelected ? '#6B7280' : '#9CA3AF'}
                    />
                  </View>
                  <View style={styles.councilInfo}>
                    <Text style={[styles.councilName, isSelected && styles.councilNameSelected]}>
                      {council.name}
                    </Text>
                    <Text style={styles.councilLocation}>
                      {council.location}
                    </Text>
                  </View>
                  {isSelected && <MaterialIcons name="check-circle" size={24} color="#3B82F6" />}
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

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.confirmButtonText}>Confirm Council</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Indicator */}
      <View style={styles.bottomIndicator} />

      {/* Toast Notification */}
      {toastVisible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.toast}>
            <View style={styles.toastIconContainer}>
              <MaterialIcons name="check-circle" size={24} color="#4ADE80" />
            </View>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}
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
    zIndex: 10,
  },

  // Floating Location Icon
  floatingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
    zIndex: 5,
  },
  locationCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
    position: 'relative',
  },
  gridPattern: {
    position: 'absolute',
    inset: 8,
    borderRadius: 88,
    opacity: 0.3,
    backgroundColor: '#F3F4F6',
  },
  locationPin: {
    position: 'relative',
    zIndex: 10,
    transform: [{ translateY: -8 }],
  },
  pulseRing: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  locationBadge: {
    position: 'absolute',
    top: '25%',
    right: '15%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Content Styles
  contentSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
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
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
  },

  // Search Input
  searchContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
    zIndex: 10,
  },
  searchInput: {
    width: '100%',
    paddingLeft: 48,
    paddingRight: 40,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    fontSize: 15,
    color: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    borderRadius: 12,
  },

  // Scrollable List
  scrollContainer: {
    flex: 1,
    marginHorizontal: -16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },

  // Current Location Button
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationText: {
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  currentLocationSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Suggestions Header
  suggestionsHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    paddingVertical: 8,
  },

  // Council Buttons
  councilButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  councilButtonSelected: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  councilIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  councilIconSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  councilInfo: {
    flex: 1,
  },
  councilName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  councilNameSelected: {
    fontWeight: '600',
  },
  councilLocation: {
    fontSize: 12,
    color: '#64748B',
  },

  // Loading State
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  // No Results
  noResultsContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  noResultsSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
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
    width: 24,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  confirmButton: {
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
  confirmButtonText: {
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
    opacity: 0.5,
  },

  // Toast Notification
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  toastIconContainer: {
    marginRight: 12,
  },
  toastText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
  },
});

export default CouncilSelectionScreen;
