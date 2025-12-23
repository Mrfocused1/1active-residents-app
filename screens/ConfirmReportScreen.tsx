import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ApiService from '../services/api.service';

interface ReportData {
  category: string;
  categoryKey: string;
  description: string;
  receiveUpdates: boolean;
  photos: string[];
  location: {
    address: string;
    city: string;
  };
  assignedTo?: {
    department: string;
    person: string;
  };
}

interface ConfirmReportScreenProps {
  reportData?: ReportData;
  onBack?: () => void;
  onEdit?: (section: string) => void;
  onConfirm?: () => void;
}

const categoryIcons: { [key: string]: string } = {
  roads: 'edit-road',
  rubbish: 'recycling',
  lighting: 'lightbulb',
  parks: 'park',
  noise: 'volume-up',
  graffiti: 'brush',
  parking: 'local-parking',
  other: 'more-horiz',
};

const ConfirmReportScreen: React.FC<ConfirmReportScreenProps> = ({
  reportData,
  onBack,
  onEdit,
  onConfirm,
}) => {
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [userAddress, setUserAddress] = useState('Loading address...');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await ApiService.getCurrentUser();
      if (response.data) {
        setUserName(response.data.name || 'User');
        setUserEmail(response.data.email || 'user@example.com');

        // Format user address from profile
        const address = response.data.address;
        if (address && address.street) {
          const formattedAddress = [
            address.street,
            address.city,
            address.postcode
          ].filter(Boolean).join(', ');
          setUserAddress(formattedAddress || 'No address set');
        } else {
          setUserAddress('No address set');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEdit = (section: string) => {
    if (onEdit) {
      onEdit(section);
    }
  };

  const categoryIcon = categoryIcons[reportData?.categoryKey || 'other'] || 'more-horiz';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <MaterialIcons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Report</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Text */}
        <Text style={styles.introText}>
          Please review the details below before submitting your report.
        </Text>

        {/* Reporter Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="person" size={18} color="#9CA3AF" />
              <Text style={styles.sectionTitle}>Reporter Details</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('reporter')} activeOpacity={0.8}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reporterDetails}>
            <Text style={styles.reporterName}>{userName}</Text>
            <Text style={styles.reporterAddress}>{userAddress}</Text>
            <Text style={styles.reporterEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <View style={styles.categoryIcon}>
            <MaterialIcons name={categoryIcon as any} size={20} color="#2563EB" />
          </View>
          <View style={styles.categoryText}>
            <Text style={styles.categoryLabel}>CATEGORY</Text>
            <Text style={styles.categoryValue}>{reportData?.category}</Text>
          </View>
          <TouchableOpacity onPress={() => handleEdit('category')} activeOpacity={0.8}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Location Section */}
        <View style={styles.locationSection}>
          <View style={styles.locationHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="location-on" size={18} color="#9CA3AF" />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('location')} activeOpacity={0.8}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Map Preview */}
          <View style={styles.mapContainer}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlwqb3CdnjGDh8FpYpnVv_m0dGs2fWB49ka9ZX8nKpim03Wo73EXD06LZ9OF8UvZa3rB96EboVeY3u992WeJFQYvIqiWlMbY7KHF7k3HuhE5-MZEE_EyRCiTu1gnaeFDd-ezDKTrw_0DZw2JIh_02twn_8KtWlWpiG5mfMQbQgUPrVTZekc7dV-eijJJ3CPqzzDcbuZTipGw81MYCuO8oAvs_H64WgaVXyv6HQLZxA80fQF2xJV7fb7yOETHsu28u3zlnSu2GfSUQ',
              }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapPinOverlay}>
              <MaterialIcons name="location-on" size={40} color="#2563EB" />
            </View>
          </View>

          {/* Address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressMain}>{reportData?.location.address}</Text>
            <Text style={styles.addressSub}>{reportData?.location.city}</Text>
          </View>
        </View>

        {/* Evidence Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="image" size={18} color="#9CA3AF" />
              <Text style={styles.sectionTitle}>Evidence</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('evidence')} activeOpacity={0.8}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoList}
          >
            {reportData?.photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="description" size={18} color="#9CA3AF" />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit('description')} activeOpacity={0.8}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{reportData?.description}</Text>
          </View>
        </View>

        {/* Assigned To Section */}
        {reportData?.assignedTo && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="assignment" size={18} color="#9CA3AF" />
                <Text style={styles.sectionTitle}>Assigned To</Text>
              </View>
            </View>

            <View style={styles.assignedCard}>
              {/* Department */}
              <View style={styles.assignedRow}>
                <View style={styles.assignedIcon}>
                  <MaterialIcons name="domain" size={20} color="#6366F1" />
                </View>
                <View style={styles.assignedText}>
                  <Text style={styles.assignedLabel}>DEPARTMENT IN CHARGE</Text>
                  <Text style={styles.assignedValue}>{reportData.assignedTo.department}</Text>
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
                  <Text style={styles.assignedValue}>{reportData.assignedTo.person}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Update Preference */}
        {reportData?.receiveUpdates && (
          <View style={styles.updateConfirmation}>
            <MaterialIcons name="check-circle" size={20} color="#2563EB" />
            <Text style={styles.updateText}>
              You have opted to receive email updates regarding the status of this report.
            </Text>
          </View>
        )}

        {/* Bottom spacing for fixed footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={onConfirm} activeOpacity={0.9}>
          <Text style={styles.submitButtonText}>Confirm & Submit</Text>
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

  // Intro Text
  introText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  // Section
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },

  // Reporter Details
  reporterDetails: {
    paddingLeft: 26,
  },
  reporterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  reporterAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  reporterEmail: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Category Badge
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 20,
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

  // Location
  locationSection: {
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
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mapContainer: {
    height: 112,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  mapPinOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
  },
  addressContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
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

  // Photos
  photoList: {
    gap: 12,
  },
  photoContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photo: {
    width: '100%',
    height: '100%',
  },

  // Description
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  // Assigned To
  assignedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  assignedDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  // Update Confirmation
  updateConfirmation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  updateText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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

export default ConfirmReportScreen;
