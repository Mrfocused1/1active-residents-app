import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getDepartmentHeadName, DepartmentHeadDetails } from '../services/perplexityAPI';
import LocationService from '../services/location.service';
import geminiService from '../services/gemini.service';

interface IssueDetailsScreenProps {
  category?: string;
  issueTopic?: any;
  council?: string;
  reportData?: any;
  onBack?: () => void;
  onEditCategory?: () => void;
  onSubmit?: (data: any) => void;
  onAdjustLocation?: () => void;
  onChangeAddress?: () => void;
}

const categoryMap: { [key: string]: { name: string; icon: string } } = {
  roads: { name: 'Roads & Pavements', icon: 'edit-road' },
  rubbish: { name: 'Rubbish & Recycling', icon: 'recycling' },
  lighting: { name: 'Street Lighting', icon: 'lightbulb' },
  parks: { name: 'Parks & Green Spaces', icon: 'park' },
  noise: { name: 'Noise Nuisance', icon: 'volume-up' },
  graffiti: { name: 'Graffiti', icon: 'brush' },
  parking: { name: 'Illegal Parking', icon: 'local-parking' },
  other: { name: 'Other Issue', icon: 'more-horiz' },
};

const IssueDetailsScreen: React.FC<IssueDetailsScreenProps> = ({
  category = 'other',
  issueTopic,
  council = 'Camden',
  reportData,
  onBack,
  onEditCategory,
  onSubmit,
  onAdjustLocation,
  onChangeAddress,
}) => {
  // If we have an issue topic from search, use its title, otherwise use category map
  const categoryInfo = issueTopic
    ? { name: issueTopic.title, icon: 'description' }
    : (categoryMap[category] || categoryMap.other);
  const [description, setDescription] = useState('');
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [departmentHead, setDepartmentHead] = useState<DepartmentHeadDetails | null>(null);
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    address: string;
    city: string;
    coordinates?: { latitude: number; longitude: number };
  }>({
    address: '14 High Street',
    city: 'Camden, London, NW1 7JE',
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [aiCategorization, setAiCategorization] = useState<{
    category: string;
    priority: 'low' | 'medium' | 'high';
    suggestedAction: string;
  } | null>(null);
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);

  const maxChars = 500;

  // Update location when reportData changes (from map selection)
  useEffect(() => {
    if (reportData?.location) {
      console.log('📍 Updating location from reportData:', reportData.location);
      setUserLocation({
        address: reportData.location.address || 'Selected Location',
        city: reportData.location.city || '',
        coordinates: reportData.location.coordinates
          ? {
              latitude: reportData.location.coordinates[1],
              longitude: reportData.location.coordinates[0],
            }
          : undefined,
      });
    }
  }, [reportData?.location]);

  // Get user's actual location on mount (only if no reportData)
  useEffect(() => {
    if (reportData?.location) {
      // If we have reportData, use that instead of fetching current location
      return;
    }

    const fetchUserLocation = async () => {
      setIsLoadingLocation(true);
      try {
        const locationData = await LocationService.getCurrentLocationWithAddress();

        if (locationData) {
          const { coordinates, address } = locationData;

          // Format address
          const streetAddress = address.street || address.name || 'Current Location';
          const cityAddress = [
            address.city,
            address.region,
            address.postalCode
          ].filter(Boolean).join(', ');

          setUserLocation({
            address: streetAddress,
            city: cityAddress || 'Unknown Location',
            coordinates: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            },
          });
        }
      } catch (error) {
        console.error('Failed to fetch user location:', error);
        // Keep the default location if fetching fails
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchUserLocation();
  }, []);

  // Fetch department head info using Perplexity when component mounts or category changes
  useEffect(() => {
    const fetchDepartmentHead = async () => {
      setIsLoadingDepartment(true);
      try {
        const headInfo = await getDepartmentHeadName(
          `${council} Council`,
          category,
          categoryInfo.name
        );
        setDepartmentHead(headInfo);
      } catch (error) {
        console.error('Failed to fetch department head:', error);
      } finally {
        setIsLoadingDepartment(false);
      }
    };

    fetchDepartmentHead();
  }, [category, council, categoryInfo.name]);

  // Auto-categorize using AI when user types description
  useEffect(() => {
    // Only categorize if user has typed at least 20 characters
    if (description.length < 20) {
      setAiCategorization(null);
      setShowAiSuggestion(false);
      return;
    }

    // Debounce the API call
    const timer = setTimeout(async () => {
      try {
        const result = await geminiService.categorizeIssue(description);
        if (result) {
          setAiCategorization(result);
          // Only show suggestion if AI suggests a different category than currently selected
          const aiCategoryKey = result.category.toLowerCase().replace(/[^a-z]/g, '');
          const currentCategoryName = categoryInfo.name.toLowerCase();
          if (!currentCategoryName.includes(aiCategoryKey) && !aiCategoryKey.includes('other')) {
            setShowAiSuggestion(true);
          }
        }
      } catch (error) {
        // Silent fail - AI categorization is optional
      }
    }, 2000); // Wait 2 seconds after user stops typing

    return () => clearTimeout(timer);
  }, [description, categoryInfo.name]);

  const handleAddPhoto = async () => {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow camera and photo library access to add photos to your report.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Show action sheet to choose camera or library
    Alert.alert(
      'Add Photo',
      'Choose a photo source',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                setPhotos([...photos, result.assets[0].uri]);
              }
            } catch (error) {
              console.error('Error taking photo:', error);
              Alert.alert('Error', 'Failed to take photo. Please try again.');
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                setPhotos([...photos, result.assets[0].uri]);
              }
            } catch (error) {
              console.error('Error selecting photo:', error);
              Alert.alert('Error', 'Failed to select photo. Please try again.');
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data = {
      category: categoryInfo.name,
      description,
      receiveUpdates,
      photos,
      location: userLocation,
      assignedTo: {
        department: departmentHead?.department || 'General Services',
        person: departmentHead?.name || 'Council Team',
        title: departmentHead?.title,
        council: departmentHead?.council,
        contact: departmentHead?.contact,
        confidence: departmentHead?.confidence,
      },
    };
    console.log('Submitting report:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <MaterialIcons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an Issue</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <View style={styles.categoryIcon}>
            <MaterialIcons name={categoryInfo.icon as any} size={20} color="#2563EB" />
          </View>
          <View style={styles.categoryText}>
            <Text style={styles.categoryLabel}>CATEGORY</Text>
            <Text style={styles.categoryValue}>{categoryInfo.name}</Text>
          </View>
          <TouchableOpacity onPress={onEditCategory} activeOpacity={0.8}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Location <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.locationCard}>
            {/* Map Preview */}
            <TouchableOpacity style={styles.mapContainer} activeOpacity={0.9} onPress={onAdjustLocation}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlwqb3CdnjGDh8FpYpnVv_m0dGs2fWB49ka9ZX8nKpim03Wo73EXD06LZ9OF8UvZa3rB96EboVeY3u992WeJFQYvIqiWlMbY7KHF7k3HuhE5-MZEE_EyRCiTu1gnaeFDd-ezDKTrw_0DZw2JIh_02twn_8KtWlWpiG5mfMQbQgUPrVTZekc7dV-eijJJ3CPqzzDcbuZTipGw81MYCuO8oAvs_H64WgaVXyv6HQLZxA80fQF2xJV7fb7yOETHsu28u3zlnSu2GfSUQ',
                }}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapOverlay}>
                <View style={styles.mapPinBadge}>
                  <MaterialIcons name="my-location" size={14} color="#FFFFFF" />
                  <Text style={styles.mapPinText}>Tap to adjust pin</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Address */}
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-on" size={24} color="#9CA3AF" />
              <View style={styles.addressText}>
                {isLoadingLocation ? (
                  <>
                    <View style={styles.loadingPlaceholder} />
                    <View style={[styles.loadingPlaceholder, { width: '70%', marginTop: 4 }]} />
                  </>
                ) : (
                  <>
                    <Text style={styles.addressMain}>{userLocation.address}</Text>
                    <Text style={styles.addressSub}>{userLocation.city}</Text>
                  </>
                )}
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={onChangeAddress}>
                <Text style={styles.changeButton}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={16} color="#9CA3AF" />
            <Text style={styles.infoText}>Precise location helps us resolve issues faster.</Text>
          </View>
        </View>

        {/* Evidence Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Evidence</Text>
            <Text style={styles.optionalLabel}>Optional</Text>
          </View>

          <View style={styles.photoGrid}>
            {/* Add Photo Button */}
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleAddPhoto}
              activeOpacity={0.8}
            >
              <View style={styles.addPhotoIcon}>
                <MaterialIcons name="add-a-photo" size={20} color="#2563EB" />
              </View>
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            {/* Existing Photos */}
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Empty Slots */}
            {photos.length < 2 && <View style={styles.emptyPhotoSlot} />}
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Description <Text style={styles.required}>*</Text>
          </Text>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Please describe the issue in detail. For example: The bushes are blocking the pedestrian pathway..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              maxLength={maxChars}
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {description.length}/{maxChars}
            </Text>
          </View>

          {/* AI Categorization Suggestion */}
          {showAiSuggestion && aiCategorization && (
            <View style={styles.aiSuggestionBanner}>
              <View style={styles.aiSuggestionHeader}>
                <MaterialIcons name="auto-awesome" size={18} color="#6366F1" />
                <Text style={styles.aiSuggestionTitle}>AI Suggestion</Text>
              </View>
              <Text style={styles.aiSuggestionText}>
                This looks like a {aiCategorization.category} issue.
                Priority: <Text style={styles.priorityText}>{aiCategorization.priority.toUpperCase()}</Text>
              </Text>
              {aiCategorization.suggestedAction && (
                <Text style={styles.aiSuggestionAction}>
                  💡 {aiCategorization.suggestedAction}
                </Text>
              )}
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={() => setShowAiSuggestion(false)}
              >
                <Text style={styles.dismissButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Assigned To Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Assigned To</Text>
            {isLoadingDepartment && (
              <View style={styles.loadingBadge}>
                <ActivityIndicator size="small" color="#6366F1" />
                <Text style={styles.loadingText}>Fetching department info...</Text>
              </View>
            )}
            {departmentHead && !isLoadingDepartment && (
              <View style={styles.aiBadge}>
                <MaterialIcons name="auto-awesome" size={12} color="#6366F1" />
                <Text style={styles.aiBadgeText}>AI-powered</Text>
              </View>
            )}
          </View>
          <View style={styles.assignedCard}>
            {/* Department */}
            <View style={styles.assignedRow}>
              <View style={styles.assignedIcon}>
                <MaterialIcons name="domain" size={20} color="#6366F1" />
              </View>
              <View style={styles.assignedText}>
                <Text style={styles.assignedLabel}>DEPARTMENT IN CHARGE</Text>
                {isLoadingDepartment ? (
                  <View style={styles.loadingPlaceholder} />
                ) : (
                  <Text style={styles.assignedValue}>
                    {departmentHead?.department || 'General Services'}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.assignedDivider} />

            {/* Person */}
            <View style={styles.assignedRow}>
              <View style={styles.assignedIcon}>
                <MaterialIcons name="person" size={20} color="#6366F1" />
              </View>
              <View style={styles.assignedText}>
                <Text style={styles.assignedLabel}>PERSON IN CHARGE</Text>
                {isLoadingDepartment ? (
                  <View style={styles.loadingPlaceholder} />
                ) : (
                  <>
                    <Text style={styles.assignedValue}>
                      {departmentHead?.name || 'Council Team'}
                    </Text>
                    {departmentHead?.title && departmentHead.name !== 'Not publicly listed' && (
                      <Text style={styles.assignedSubtext}>
                        {departmentHead.title}
                      </Text>
                    )}
                    {departmentHead?.contact?.email && (
                      <Text style={styles.assignedContact}>
                        {departmentHead.contact.email}
                      </Text>
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Updates Checkbox */}
        <View style={styles.checkboxCard}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setReceiveUpdates(!receiveUpdates)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.checkboxBox,
                receiveUpdates && styles.checkboxBoxChecked,
              ]}
            >
              {receiveUpdates && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
          <View style={styles.checkboxText}>
            <Text style={styles.checkboxLabel}>Receive status updates</Text>
            <Text style={styles.checkboxDescription}>
              We'll email you when the council reviews this report.
            </Text>
          </View>
        </View>

        {/* Bottom spacing for fixed footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.9}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
          <MaterialIcons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // Category Badge
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 24,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  editButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  optionalLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Location
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
  },
  mapContainer: {
    height: 128,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapPinText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  addressText: {
    flex: 1,
  },
  addressMain: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  addressSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  changeButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },

  // Photo Grid
  photoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  addPhotoButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  photoContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPhotoSlot: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Description
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Assigned To
  assignedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  assignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  assignedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignedText: {
    flex: 1,
  },
  assignedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  assignedValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  assignedSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  assignedContact: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9CA3AF',
    marginTop: 2,
  },
  assignedDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loadingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: '500',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366F1',
  },
  loadingPlaceholder: {
    height: 20,
    width: 150,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  // Checkbox
  checkboxCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    paddingTop: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxText: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  // AI Suggestion Banner
  aiSuggestionBanner: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  aiSuggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  aiSuggestionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  aiSuggestionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 6,
  },
  priorityText: {
    fontWeight: '700',
    color: '#DC2626',
  },
  aiSuggestionAction: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 4,
  },
  dismissButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  dismissButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default IssueDetailsScreen;
