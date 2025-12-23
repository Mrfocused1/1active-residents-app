import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';
import ApiService from '../services/api.service';

interface ProfileScreenProps {
  council?: string;
  refreshKey?: number; // Trigger refresh when this changes
  onBack?: () => void;
  onHome?: () => void;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onCouncilUpdate?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  onTermsPrivacy?: () => void;
  onEditProfile?: () => void;
  onAnalyticsDashboard?: () => void;
}

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postcode: string;
  };
  location?: string;
  initials?: string;
  profilePhoto?: string | null;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  council,
  refreshKey,
  onBack,
  onHome,
  onStartReport,
  onSeeAll,
  onCouncilUpdate,
  onSettings,
  onHelp,
  onTermsPrivacy,
  onEditProfile,
  onAnalyticsDashboard,
}) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    name: 'User',
    email: 'user@example.com',
    initials: 'U',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [refreshKey]); // Re-fetch when profile is updated

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getCurrentUser();

      if (response.data) {
        const user = response.data;
        const initials = user.name
          ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
          : 'U';

        setUserData({
          name: user.name || 'User',
          email: user.email || 'user@example.com',
          phone: user.phone,
          address: user.address,
          location: user.address?.city || user.location,
          initials,
          profilePhoto: user.profilePhoto || null,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep default values if API fails
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeIn delay={100}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <ScalePress onPress={onSettings}>
              <View style={styles.settingsButton}>
                <MaterialIcons name="settings" size={24} color="#64748B" />
              </View>
            </ScalePress>
          </View>
        </FadeIn>

        {/* Profile Avatar & Info */}
        <FadeIn delay={200}>
          <View style={styles.profileSection}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#5B7CFA" style={{ marginVertical: 32 }} />
            ) : (
              <>
                <ScalePress onPress={onEditProfile}>
                  <View style={styles.avatarContainer}>
                    {userData.profilePhoto ? (
                      <Image source={{ uri: userData.profilePhoto }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarGradient}>
                        <View style={styles.avatarInner}>
                          <Text style={styles.avatarText}>{userData.initials}</Text>
                        </View>
                      </View>
                    )}
                    <View style={styles.editBadge}>
                      <MaterialIcons name="edit" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                </ScalePress>
                <Text style={styles.profileName}>{userData.name}</Text>
                {council && (
                  <View style={styles.locationContainer}>
                    <MaterialIcons name="location-on" size={16} color="#5B7CFA" />
                    <Text style={styles.locationText}>{council}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </FadeIn>

        {/* Contact Info */}
        <SlideIn delay={300} from="bottom" distance={20}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <View style={styles.card}>
              <ScalePress>
                <View style={styles.contactItem}>
                  <View style={[styles.contactIcon, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                    <MaterialIcons name="mail" size={20} color="#5B7CFA" />
                  </View>
                  <View style={styles.contactText}>
                    <Text style={styles.contactLabel}>EMAIL</Text>
                    <Text style={styles.contactValue}>{userData.email}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                </View>
              </ScalePress>

              {userData.phone && (
                <>
                  <View style={styles.divider} />
                  <ScalePress>
                    <View style={styles.contactItem}>
                      <View style={[styles.contactIcon, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                        <MaterialIcons name="phone" size={20} color="#4DB6AC" />
                      </View>
                      <View style={styles.contactText}>
                        <Text style={styles.contactLabel}>MOBILE</Text>
                        <Text style={styles.contactValue}>{userData.phone}</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                    </View>
                  </ScalePress>
                </>
              )}

              {userData.address && (
                <>
                  <View style={styles.divider} />
                  <ScalePress>
                    <View style={styles.contactItem}>
                      <View style={[styles.contactIcon, { backgroundColor: 'rgba(255, 140, 102, 0.1)' }]}>
                        <MaterialIcons name="home" size={20} color="#FF8C66" />
                      </View>
                      <View style={styles.contactText}>
                        <Text style={styles.contactLabel}>HOME ADDRESS</Text>
                        <Text style={styles.contactValue}>
                          {userData.address.street}, {userData.address.postcode}
                        </Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                    </View>
                  </ScalePress>
                </>
              )}
            </View>
          </View>
        </SlideIn>

        {/* Activity & Insights */}
        <SlideIn delay={400} from="bottom" distance={20}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity & Insights</Text>
            <View style={styles.card}>
              <ScalePress onPress={onAnalyticsDashboard}>
                <View style={styles.contactItem}>
                  <View style={[styles.contactIcon, { backgroundColor: 'rgba(255, 213, 114, 0.2)' }]}>
                    <MaterialIcons name="insights" size={20} color="#FFD572" />
                  </View>
                  <View style={styles.contactText}>
                    <Text style={styles.contactLabel}>ANALYTICS</Text>
                    <Text style={styles.contactValue}>View your impact dashboard</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                </View>
              </ScalePress>
            </View>
          </View>
        </SlideIn>

        {/* Preferences */}
        <SlideIn delay={500} from="bottom" distance={20}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <View style={styles.preferenceIcon}>
                    <MaterialIcons name="notifications" size={20} color="#6B7280" />
                  </View>
                  <Text style={styles.preferenceText}>Push Notifications</Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>
          </View>
        </SlideIn>

        {/* Support */}
        <SlideIn delay={600} from="bottom" distance={20}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.card}>
              <ScalePress onPress={onHelp}>
                <View style={styles.supportItem}>
                  <Text style={styles.supportText}>Help Center</Text>
                  <MaterialIcons name="open-in-new" size={20} color="#D1D5DB" />
                </View>
              </ScalePress>

              <View style={styles.divider} />

              <ScalePress onPress={onTermsPrivacy}>
                <View style={styles.supportItem}>
                  <Text style={styles.supportText}>Terms & Privacy Policy</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                </View>
              </ScalePress>
            </View>
          </View>
        </SlideIn>

        {/* Log Out Button */}
        <FadeIn delay={700}>
          <ScalePress>
            <View style={styles.logoutButton}>
              <MaterialIcons name="logout" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Log Out</Text>
            </View>
          </ScalePress>
        </FadeIn>

        {/* App Version */}
        <FadeIn delay={800}>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>App Version 2.4.0</Text>
          </View>
        </FadeIn>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <ScalePress onPress={onHome || onBack}>
            <View style={styles.navItem}>
              <MaterialIcons name="home" size={28} color="#9CA3AF" />
              <Text style={styles.navLabel}>Home</Text>
            </View>
          </ScalePress>

          <ScalePress onPress={onCouncilUpdate}>
            <View style={styles.navItem}>
              <MaterialIcons name="chat-bubble-outline" size={28} color="#9CA3AF" />
              <Text style={styles.navLabel}>Updates</Text>
            </View>
          </ScalePress>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <ScalePress onPress={onStartReport}>
              <View style={styles.navFab}>
                <MaterialIcons name="add" size={32} color="#FFFFFF" />
              </View>
            </ScalePress>
          </View>

          <ScalePress onPress={onSeeAll}>
            <View style={styles.navItem}>
              <MaterialIcons name="history" size={28} color="#9CA3AF" />
              <Text style={styles.navLabel}>History</Text>
            </View>
          </ScalePress>

          <ScalePress>
            <View style={styles.navItem}>
              <MaterialIcons name="person" size={28} color="#5B7CFA" />
              <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
            </View>
          </ScalePress>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: '#333344',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarGradient: {
    width: 112,
    height: 112,
    borderRadius: 56,
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
    borderRadius: 52,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 36,
    fontWeight: '700',
    color: '#5B7CFA',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
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
  profileName: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 24,
    fontWeight: '700',
    color: '#333344',
    marginTop: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
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
    marginBottom: 12,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Contact Items
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 16,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333344',
  },

  // Preferences
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333344',
  },

  // Support
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  supportText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333344',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Version
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Bottom Navigation
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    pointerEvents: 'box-none',
  },
  navGradient: {
    height: 128,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  navBar: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#5B7CFA',
  },
  navFabContainer: {
    position: 'relative',
    top: -32,
  },
  navFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B7CFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
});

export default ProfileScreen;
