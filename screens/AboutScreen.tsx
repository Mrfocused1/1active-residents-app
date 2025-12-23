import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AboutScreenProps {
  onBack?: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  onLicensesPress?: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({
  onBack,
  onTermsPress,
  onPrivacyPress,
  onLicensesPress,
}) => {
  const openURL = async (url: string, name: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${name}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${name}`);
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* App Icon & Name */}
        <View style={styles.appSection}>
          <View style={styles.appIconContainer}>
            <View style={styles.appIconGradient}>
              <MaterialIcons name="location-city" size={48} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.appName}>Active Residents</Text>
          <Text style={styles.appTagline}>Empowering communities, one report at a time</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 2.4.0</Text>
          </View>
        </View>

        {/* Mission Statement */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="campaign" size={20} color="#5B7CFA" />
            </View>
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.missionText}>
              Active Residents bridges the gap between UK residents and their local councils. We
              believe in the power of collective action and transparent communication to create
              better communities.
            </Text>
            <Text style={styles.missionText}>
              By making it easier to report local issues, track their progress, and stay informed
              about council updates, we're helping to build stronger, more responsive local
              governance.
            </Text>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="info-outline" size={20} color="#4DB6AC" />
            </View>
            <Text style={styles.sectionTitle}>App Information</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>2.4.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build Number</Text>
              <Text style={styles.infoValue}>240</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>October 2023</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>License</Text>
              <Text style={styles.infoValue}>Proprietary</Text>
            </View>
          </View>
        </View>

        {/* Connect With Us */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="connect-without-contact" size={20} color="#FFD572" />
            </View>
            <Text style={styles.sectionTitle}>Connect With Us</Text>
          </View>
          <View style={styles.connectGrid}>
            {/* Website */}
            <TouchableOpacity
              style={styles.connectCard}
              activeOpacity={0.8}
              onPress={() => openURL('https://www.activeresidents.co.uk', 'Website')}
            >
              <View style={[styles.connectIcon, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                <MaterialIcons name="language" size={24} color="#5B7CFA" />
              </View>
              <Text style={styles.connectLabel}>Website</Text>
            </TouchableOpacity>

            {/* Twitter */}
            <TouchableOpacity
              style={styles.connectCard}
              activeOpacity={0.8}
              onPress={() => openURL('https://twitter.com/activeresidents', 'Twitter')}
            >
              <View style={[styles.connectIcon, { backgroundColor: 'rgba(29, 161, 242, 0.1)' }]}>
                <MaterialIcons name="alternate-email" size={24} color="#1DA1F2" />
              </View>
              <Text style={styles.connectLabel}>Twitter</Text>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity
              style={styles.connectCard}
              activeOpacity={0.8}
              onPress={() => openURL('https://facebook.com/activeresidents', 'Facebook')}
            >
              <View style={[styles.connectIcon, { backgroundColor: 'rgba(24, 119, 242, 0.1)' }]}>
                <MaterialIcons name="facebook" size={24} color="#1877F2" />
              </View>
              <Text style={styles.connectLabel}>Facebook</Text>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.connectCard}
              activeOpacity={0.8}
              onPress={() => openURL('mailto:contact@activeresidents.co.uk', 'Email')}
            >
              <View style={[styles.connectIcon, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                <MaterialIcons name="email" size={24} color="#4DB6AC" />
              </View>
              <Text style={styles.connectLabel}>Email</Text>
            </TouchableOpacity>

            {/* GitHub */}
            <TouchableOpacity
              style={styles.connectCard}
              activeOpacity={0.8}
              onPress={() => openURL('https://github.com/activeresidents', 'GitHub')}
            >
              <View style={[styles.connectIcon, { backgroundColor: 'rgba(51, 51, 68, 0.1)' }]}>
                <MaterialIcons name="code" size={24} color="#333344" />
              </View>
              <Text style={styles.connectLabel}>GitHub</Text>
            </TouchableOpacity>

            {/* LinkedIn */}
            <TouchableOpacity
              style={styles.connectCard}
              activeOpacity={0.8}
              onPress={() => openURL('https://linkedin.com/company/activeresidents', 'LinkedIn')}
            >
              <View style={[styles.connectIcon, { backgroundColor: 'rgba(10, 102, 194, 0.1)' }]}>
                <MaterialIcons name="work-outline" size={24} color="#0A66C2" />
              </View>
              <Text style={styles.connectLabel}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.legalLink}
              activeOpacity={0.8}
              onPress={onTermsPress}
            >
              <Text style={styles.legalLinkText}>Terms of Service</Text>
              <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.legalLink}
              activeOpacity={0.8}
              onPress={onPrivacyPress}
            >
              <Text style={styles.legalLinkText}>Privacy Policy</Text>
              <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.legalLink}
              activeOpacity={0.8}
              onPress={onLicensesPress}
            >
              <Text style={styles.legalLinkText}>Open Source Licenses</Text>
              <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={styles.creditsText}>Made with care in the United Kingdom</Text>
          <Text style={styles.copyrightText}>© 2025 Active Residents. All rights reserved.</Text>
          <Text style={styles.websiteText}>www.activeresidents.co.uk</Text>
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
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },

  // App Section
  appSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appIconContainer: {
    marginBottom: 16,
  },
  appIconGradient: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#5B7CFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 8,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  versionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 124, 250, 0.2)',
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B7CFA',
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Mission
  missionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333344',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  // Connect Grid
  connectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  connectCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  connectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },

  // Legal Links
  legalLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  legalLinkText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333344',
  },

  // Credits
  creditsSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  creditsText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  websiteText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

export default AboutScreen;
