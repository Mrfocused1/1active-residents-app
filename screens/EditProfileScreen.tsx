import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ApiService from '../services/api.service';

interface EditProfileScreenProps {
  onBack?: () => void;
  onSave?: (profileData: any) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack, onSave }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log('📸 Profile photo state changed:', profilePhoto ? profilePhoto.substring(0, 50) + '...' : 'null');
  }, [profilePhoto]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getCurrentUser();

      if (response.data) {
        const user = response.data;
        setFullName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setAddress(user.address?.street || '');
        setCity(user.address?.city || '');
        setPostcode(user.address?.postcode || '');
        setProfilePhoto(user.profilePhoto || null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhoto = async () => {
    console.log('📸 handleChangePhoto called');

    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    console.log('📸 Permissions:', { camera: cameraPermission.status, media: mediaLibraryPermission.status });

    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow camera and photo library access to change your profile photo.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Show action sheet to choose camera or library
    Alert.alert(
      'Change Profile Photo',
      'Choose a photo source',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              console.log('📸 Launching camera...');
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              console.log('📸 Camera result:', { canceled: result.canceled, hasAssets: !!result.assets });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                const photoUri = result.assets[0].uri;
                console.log('📸 Setting profile photo:', photoUri);
                setProfilePhoto(photoUri);
              }
            } catch (error) {
              console.error('❌ Error taking photo:', error);
              Alert.alert('Error', 'Failed to take photo. Please try again.');
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            try {
              console.log('📸 Launching image library...');
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              console.log('📸 Library result:', { canceled: result.canceled, hasAssets: !!result.assets });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                const photoUri = result.assets[0].uri;
                console.log('📸 Setting profile photo:', photoUri);
                setProfilePhoto(photoUri);
              } else {
                console.log('📸 Photo selection was canceled or no assets');
              }
            } catch (error) {
              console.error('❌ Error selecting photo:', error);
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

  const handleSave = async () => {
    if (!canSave) return;

    try {
      setIsSaving(true);

      const profileData = {
        name: fullName,
        phone,
        address: {
          street: address,
          city,
          postcode,
        },
        profilePhoto,
      };

      console.log('💾 Saving profile with photo:', profilePhoto ? 'Yes' : 'No');
      console.log('💾 Profile data:', profileData);

      await ApiService.updateProfile(profileData);

      console.log('✅ Profile saved successfully');

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            console.log('✅ Calling onSave callback');
            onSave?.(profileData);
            onBack?.();
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = fullName.trim().length > 0; // Only require name to be filled

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <Text style={styles.headerSubtitle}>Update your personal information</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="edit" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#5B7CFA" />
            <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>
              Loading profile...
            </Text>
          </View>
        ) : (
          <>
            {/* Profile Photo */}
            <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarGradient}>
                <View style={styles.avatarInner}>
                  <MaterialIcons name="person" size={48} color="#5B7CFA" />
                </View>
              </View>
            )}
            <TouchableOpacity style={styles.editBadge} activeOpacity={0.8} onPress={handleChangePhoto}>
              <MaterialIcons name="camera-alt" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'fullName' && styles.inputContainerFocused,
              ]}
            >
              <MaterialIcons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'email' && styles.inputContainerFocused,
              ]}
            >
              <MaterialIcons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'phone' && styles.inputContainerFocused,
              ]}
            >
              <MaterialIcons name="phone-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'address' && styles.inputContainerFocused,
              ]}
            >
              <MaterialIcons name="home-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your street address"
                placeholderTextColor="#9CA3AF"
                value={address}
                onChangeText={setAddress}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'city' && styles.inputContainerFocused,
              ]}
            >
              <MaterialIcons name="location-city" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your city"
                placeholderTextColor="#9CA3AF"
                value={city}
                onChangeText={setCity}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Postcode</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'postcode' && styles.inputContainerFocused,
              ]}
            >
              <MaterialIcons name="markunread-mailbox" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your postcode"
                placeholderTextColor="#9CA3AF"
                value={postcode}
                onChangeText={setPostcode}
                onFocus={() => setFocusedField('postcode')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="info-outline" size={20} color="#5B7CFA" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Privacy Note</Text>
            <Text style={styles.infoText}>
              Your personal information is kept secure and will only be shared with your local
              council when you submit a report.
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
          </>
        )}
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomGradient} />
        <View style={styles.bottomContent}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onBack} activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, (!canSave || isSaving) && styles.saveButtonDisabled]}
              onPress={handleSave}
              activeOpacity={canSave && !isSaving ? 0.8 : 1}
              disabled={!canSave || isSaving}
            >
              {isSaving ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Text
                    style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}
                  >
                    Save Changes
                  </Text>
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={canSave ? '#FFFFFF' : '#9CA3AF'}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Photo Section
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 4,
    backgroundColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333344',
    borderWidth: 4,
    borderColor: '#F4F7FE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 16,
    paddingLeft: 4,
  },

  // Input Groups
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOpacity: 0.1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333344',
    fontWeight: '500',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(91, 124, 250, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 124, 250, 0.1)',
    gap: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Bottom Container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  bottomGradient: {
    height: 80,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default EditProfileScreen;
