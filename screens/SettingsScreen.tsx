import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Switch,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import councilsDatabaseService from '../services/councilsDatabase.service';
import pushNotifications from '../services/pushNotifications.service';

interface SettingsScreenProps {
  onBack?: () => void;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
  onHelp?: () => void;
  onChangePassword?: () => void;
  onPrivacySettings?: () => void;
  onEmailConnection?: () => void;
  onLanguage?: () => void;
  onTheme?: () => void;
  onAbout?: () => void;
  onDeleteAccount?: () => void;
  onCouncilChange?: (council: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onStartReport,
  onSeeAll,
  onCouncilUpdate,
  onProfile,
  onHelp,
  onChangePassword,
  onPrivacySettings,
  onEmailConnection,
  onLanguage,
  onTheme,
  onAbout,
  onDeleteAccount,
  onCouncilChange,
}) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [isTogglingPush, setIsTogglingPush] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [isTogglingEmail, setIsTogglingEmail] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [currentCouncil, setCurrentCouncil] = useState('Camden');
  const [showCouncilModal, setShowCouncilModal] = useState(false);
  const [availableCouncils, setAvailableCouncils] = useState<string[]>([]);

  // Load preferences on mount
  useEffect(() => {
    loadCouncilPreference();
    loadAvailableCouncils();
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      // Load push notification preference
      const pushPref = await AsyncStorage.getItem('@push_notifications_enabled');
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== 'granted') {
        setPushNotificationsEnabled(false);
      } else if (pushPref !== null) {
        setPushNotificationsEnabled(pushPref === 'true');
      }

      // Load email updates preference
      const emailPref = await AsyncStorage.getItem('@email_updates_enabled');
      if (emailPref !== null) {
        setEmailUpdates(emailPref === 'true');
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const handlePushNotificationToggle = async (value: boolean) => {
    setIsTogglingPush(true);
    try {
      if (value) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();

          if (status !== 'granted') {
            Alert.alert(
              'Permission Required',
              'To receive push notifications, please enable them in your device settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
            setIsTogglingPush(false);
            return;
          }
        }

        await AsyncStorage.setItem('@push_notifications_enabled', 'true');
        setPushNotificationsEnabled(true);
        await pushNotifications.registerForPushNotifications();
      } else {
        await AsyncStorage.setItem('@push_notifications_enabled', 'false');
        setPushNotificationsEnabled(false);
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      Alert.alert('Error', 'Could not update notification settings.');
    } finally {
      setIsTogglingPush(false);
    }
  };

  const handleEmailUpdatesToggle = async (value: boolean) => {
    setIsTogglingEmail(true);
    try {
      await AsyncStorage.setItem('@email_updates_enabled', value ? 'true' : 'false');
      setEmailUpdates(value);
      // In production, this would also call an API to update email preferences on the backend
    } catch (error) {
      console.error('Error toggling email updates:', error);
      Alert.alert('Error', 'Could not update email settings.');
    } finally {
      setIsTogglingEmail(false);
    }
  };

  const loadCouncilPreference = async () => {
    try {
      const savedCouncil = await AsyncStorage.getItem('selectedCouncil');
      console.log('📍 Settings: Loaded council from storage:', savedCouncil);
      if (savedCouncil) {
        setCurrentCouncil(savedCouncil);
        console.log('📍 Settings: Set current council to:', savedCouncil);
      } else {
        console.log('📍 Settings: No saved council, using default Camden');
      }
    } catch (error) {
      console.error('Error loading council preference:', error);
    }
  };

  const loadAvailableCouncils = () => {
    const councils = councilsDatabaseService.getAllCouncils();
    setAvailableCouncils(councils);
  };

  const handleCouncilSelect = async (council: string) => {
    try {
      console.log('📍 Settings: Saving council to storage:', council);
      await AsyncStorage.setItem('selectedCouncil', council);
      setCurrentCouncil(council);
      setShowCouncilModal(false);

      // Notify App.tsx of council change to update all screens
      if (onCouncilChange) {
        console.log('📍 Settings: Notifying App.tsx of council change');
        onCouncilChange(council);
      }
    } catch (error) {
      console.error('Error saving council preference:', error);
    }
  };

  const getThemeModeLabel = (mode: ThemeMode): string => {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
      default:
        return 'Light';
    }
  };

  const handleThemeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowThemeModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.surface }]} onPress={onBack} activeOpacity={0.8}>
            <MaterialIcons name="arrow-back" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Management</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={onChangePassword}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                <MaterialIcons name="lock" size={20} color="#5B7CFA" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Change Password</Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.border} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={onPrivacySettings}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(126, 140, 224, 0.1)' }]}>
                <MaterialIcons name="shield" size={20} color="#7E8CE0" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Privacy Settings</Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.border} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={onEmailConnection}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                <MaterialIcons name="email" size={20} color="#4DB6AC" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Email Connection</Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.border} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} activeOpacity={0.8} onPress={onDeleteAccount}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
                <MaterialIcons name="person-remove" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.menuTextDanger}>Delete Account</Text>
              <MaterialIcons name="chevron-right" size={24} color="#FEE2E2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* My Council */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>My Council</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={() => setShowCouncilModal(true)}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                <MaterialIcons name="account-balance" size={20} color="#5B7CFA" />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>Current Council</Text>
              <Text style={styles.menuValue}>{currentCouncil}</Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.border} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Preferences</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={onLanguage}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                <MaterialIcons name="language" size={20} color="#4DB6AC" />
              </View>
              <Text style={styles.menuText}>Language</Text>
              <Text style={styles.menuValue}>English (UK)</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={() => setShowThemeModal(true)}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(255, 140, 102, 0.1)' }]}>
                <MaterialIcons name="palette" size={20} color="#FF8C66" />
              </View>
              <Text style={styles.menuText}>Theme</Text>
              <Text style={styles.menuValue}>{getThemeModeLabel(themeMode)}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIcon, { backgroundColor: 'rgba(255, 213, 114, 0.2)' }]}>
                  <MaterialIcons name="notifications-active" size={20} color="#FFD572" />
                </View>
                <Text style={styles.toggleText}>Push Notifications</Text>
              </View>
              <Switch
                value={pushNotificationsEnabled}
                onValueChange={handlePushNotificationToggle}
                disabled={isTogglingPush}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.toggleItem}>
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIcon, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                  <MaterialIcons name="email" size={20} color="#5B7CFA" />
                </View>
                <Text style={styles.toggleText}>Email Updates</Text>
              </View>
              <Switch
                value={emailUpdates}
                onValueChange={handleEmailUpdatesToggle}
                disabled={isTogglingEmail}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>
          </View>
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>General</Text>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.simpleMenuItem} activeOpacity={0.8} onPress={onAbout}>
              <Text style={styles.simpleMenuText}>About</Text>
              <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.simpleMenuItem} activeOpacity={0.8} onPress={onHelp}>
              <Text style={styles.simpleMenuText}>Help & Support</Text>
              <MaterialIcons name="open-in-new" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>App Version 2.4.0 (Build 1024)</Text>
        </View>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Choose Theme</Text>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && styles.themeOptionSelected
              ]}
              onPress={() => handleThemeSelect('light')}
            >
              <View style={styles.themeOptionLeft}>
                <MaterialIcons name="light-mode" size={24} color="#5B7CFA" />
                <Text style={styles.themeOptionText}>Light</Text>
              </View>
              {themeMode === 'light' && (
                <MaterialIcons name="check" size={24} color="#5B7CFA" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && styles.themeOptionSelected
              ]}
              onPress={() => handleThemeSelect('dark')}
            >
              <View style={styles.themeOptionLeft}>
                <MaterialIcons name="dark-mode" size={24} color="#5B7CFA" />
                <Text style={styles.themeOptionText}>Dark</Text>
              </View>
              {themeMode === 'dark' && (
                <MaterialIcons name="check" size={24} color="#5B7CFA" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'auto' && styles.themeOptionSelected
              ]}
              onPress={() => handleThemeSelect('auto')}
            >
              <View style={styles.themeOptionLeft}>
                <MaterialIcons name="brightness-auto" size={24} color="#5B7CFA" />
                <Text style={styles.themeOptionText}>Auto</Text>
              </View>
              {themeMode === 'auto' && (
                <MaterialIcons name="check" size={24} color="#5B7CFA" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Council Selection Modal */}
      <Modal
        visible={showCouncilModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCouncilModal(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}
          activeOpacity={1}
          onPress={() => setShowCouncilModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Your Council</Text>
            <Text style={styles.modalSubtitle}>Choose which council you want to track</Text>

            <ScrollView style={styles.councilScrollView} showsVerticalScrollIndicator={false}>
              {availableCouncils.map((council) => (
                <TouchableOpacity
                  key={council}
                  style={[
                    styles.councilOption,
                    currentCouncil === council && styles.councilOptionSelected
                  ]}
                  onPress={() => handleCouncilSelect(council)}
                >
                  <View style={styles.councilOptionLeft}>
                    <View style={[
                      styles.councilIcon,
                      currentCouncil === council && styles.councilIconSelected
                    ]}>
                      <MaterialIcons
                        name="account-balance"
                        size={20}
                        color={currentCouncil === council ? '#5B7CFA' : '#9CA3AF'}
                      />
                    </View>
                    <View style={styles.councilInfo}>
                      <Text style={[
                        styles.councilName,
                        currentCouncil === council && styles.councilNameSelected
                      ]}>
                        {council}
                      </Text>
                      <Text style={styles.councilType}>
                        {councilsDatabaseService.getCouncilInfo(council)?.type || 'Council'}
                      </Text>
                    </View>
                  </View>
                  {currentCouncil === council && (
                    <MaterialIcons name="check-circle" size={24} color="#5B7CFA" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCouncilModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onBack}>
            <MaterialIcons name="home" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onCouncilUpdate}>
            <MaterialIcons name="chat-bubble-outline" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Updates</Text>
          </TouchableOpacity>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <TouchableOpacity style={styles.navFab} activeOpacity={0.9} onPress={onStartReport}>
              <MaterialIcons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onSeeAll}>
            <MaterialIcons name="history" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onProfile}>
            <MaterialIcons name="person" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: '#333344',
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

  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 16,
    borderRadius: 12,
  },
  menuItemDanger: {
    backgroundColor: 'rgba(255, 107, 107, 0.02)',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333344',
  },
  menuTextDanger: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  menuValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginRight: 4,
  },

  // Toggle Items
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333344',
  },

  // Simple Menu Items
  simpleMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  simpleMenuText: {
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

  // Version
  versionContainer: {
    alignItems: 'center',
    paddingTop: 16,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 20,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  themeOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#5B7CFA',
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333344',
  },
  modalCancelButton: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Council Modal
  modalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -8,
  },
  councilScrollView: {
    maxHeight: 400,
  },
  councilOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  councilOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#5B7CFA',
  },
  councilOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  councilIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  councilIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  councilInfo: {
    flex: 1,
  },
  councilName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333344',
    marginBottom: 2,
  },
  councilNameSelected: {
    color: '#5B7CFA',
    fontWeight: '700',
  },
  councilType: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default SettingsScreen;
