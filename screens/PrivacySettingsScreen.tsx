import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PrivacySettingsScreenProps {
  onBack?: () => void;
}

const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({ onBack }) => {
  const [dataTracking, setDataTracking] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [usageAnalytics, setUsageAnalytics] = useState(true);
  const [crashReports, setCrashReports] = useState(true);

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
              <Text style={styles.headerTitle}>Privacy Settings</Text>
              <Text style={styles.headerSubtitle}>Manage your data and privacy</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="shield" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* Data Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="storage" size={18} color="#7E8CE0" />
            </View>
            <Text style={styles.sectionTitle}>Data Collection</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                  <MaterialIcons name="track-changes" size={20} color="#5B7CFA" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Data Tracking</Text>
                  <Text style={styles.settingDescription}>
                    Allow us to track your activity for personalized experience
                  </Text>
                </View>
              </View>
              <Switch
                value={dataTracking}
                onValueChange={setDataTracking}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                  <MaterialIcons name="bar-chart" size={20} color="#4DB6AC" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Usage Analytics</Text>
                  <Text style={styles.settingDescription}>
                    Help us improve by sharing anonymous usage data
                  </Text>
                </View>
              </View>
              <Switch
                value={usageAnalytics}
                onValueChange={setUsageAnalytics}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 140, 102, 0.1)' }]}>
                  <MaterialIcons name="bug-report" size={20} color="#FF8C66" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Crash Reports</Text>
                  <Text style={styles.settingDescription}>
                    Automatically send crash reports to help fix issues
                  </Text>
                </View>
              </View>
              <Switch
                value={crashReports}
                onValueChange={setCrashReports}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>
          </View>
        </View>

        {/* Location & Visibility */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="visibility" size={18} color="#4DB6AC" />
            </View>
            <Text style={styles.sectionTitle}>Location & Visibility</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                  <MaterialIcons name="my-location" size={20} color="#5B7CFA" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Location Services</Text>
                  <Text style={styles.settingDescription}>
                    Required for accurate report location tracking
                  </Text>
                </View>
              </View>
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                  <MaterialIcons name="visibility" size={20} color="#4DB6AC" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Profile Visibility</Text>
                  <Text style={styles.settingDescription}>
                    Make your profile visible to other community members
                  </Text>
                </View>
              </View>
              <Switch
                value={profileVisibility}
                onValueChange={setProfileVisibility}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </View>
          </View>
        </View>

        {/* Communications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="campaign" size={18} color="#FFD572" />
            </View>
            <Text style={styles.sectionTitle}>Communications</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 213, 114, 0.1)' }]}>
                  <MaterialIcons name="mail-outline" size={20} color="#FFD572" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Marketing Emails</Text>
                  <Text style={styles.settingDescription}>
                    Receive updates about new features and improvements
                  </Text>
                </View>
              </View>
              <Switch
                value={marketingEmails}
                onValueChange={setMarketingEmails}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
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
            <Text style={styles.infoTitle}>About Privacy Settings</Text>
            <Text style={styles.infoText}>
              These settings help you control what data we collect and how we use it. You can
              change these at any time. Location services are required for reporting issues.
            </Text>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionItem} activeOpacity={0.8}>
              <View style={styles.actionLeft}>
                <MaterialIcons name="download" size={20} color="#5B7CFA" />
                <Text style={styles.actionText}>Download My Data</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionItem} activeOpacity={0.8}>
              <View style={styles.actionLeft}>
                <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete All My Data</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    marginBottom: 32,
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

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
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

  // Setting Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    gap: 12,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },

  // Action Items
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333344',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
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
    marginBottom: 24,
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
});

export default PrivacySettingsScreen;
