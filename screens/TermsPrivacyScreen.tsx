import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TermsPrivacyScreenProps {
  onBack?: () => void;
  onAgree?: () => void;
  onDecline?: () => void;
}

const TermsPrivacyScreen: React.FC<TermsPrivacyScreenProps> = ({
  onBack,
  onAgree,
  onDecline,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAgree = () => {
    if (agreedToTerms) {
      onAgree?.();
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

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Terms &amp; Privacy</Text>
              <Text style={styles.headerSubtitle}>Last updated: October 2023</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="gavel" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.introduction}>
          <Text style={styles.introText}>
            Please take a moment to review our terms. We want you to know exactly how we handle
            your data and what we expect from our community members.
          </Text>
        </View>

        {/* Sections */}
        <View style={styles.sections}>
          {/* Data Collection */}
          <View style={[styles.section, styles.sectionPurple]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: 'rgba(126, 140, 224, 0.1)' }]}>
                <MaterialIcons name="storage" size={20} color="#7E8CE0" />
              </View>
              <Text style={styles.sectionTitle}>Data Collection</Text>
            </View>

            <Text style={styles.sectionDescription}>
              To effectively report issues to local councils, we collect the following data points
              when you submit a report:
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <MaterialIcons name="check-circle" size={14} color="#7E8CE0" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bulletBold}>GPS Location:</Text> To pinpoint the exact
                  location of the issue.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <MaterialIcons name="check-circle" size={14} color="#7E8CE0" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bulletBold}>Images:</Text> Photos uploaded to provide evidence
                  of the problem.
                </Text>
              </View>

              <View style={styles.bulletItem}>
                <MaterialIcons name="check-circle" size={14} color="#7E8CE0" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bulletBold}>Contact Info:</Text> Email address for status
                  updates (optional).
                </Text>
              </View>
            </View>
          </View>

          {/* User Responsibilities */}
          <View style={[styles.section, styles.sectionOrange]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: 'rgba(255, 140, 102, 0.1)' }]}>
                <MaterialIcons name="accessibility-new" size={20} color="#FF8C66" />
              </View>
              <Text style={styles.sectionTitle}>User Responsibilities</Text>
            </View>

            <Text style={styles.sectionDescription}>
              By using this platform, you agree to submit reports in good faith. We maintain a
              friendly community environment.
            </Text>

            <View style={styles.prohibitedBox}>
              <Text style={styles.prohibitedTitle}>Prohibited Content</Text>
              <View style={styles.prohibitedIcons}>
                <View style={styles.prohibitedItem}>
                  <MaterialIcons name="block" size={18} color="#EF4444" />
                  <Text style={styles.prohibitedLabel}>Abuse</Text>
                </View>
                <View style={styles.prohibitedItem}>
                  <MaterialIcons name="no-photography" size={18} color="#EF4444" />
                  <Text style={styles.prohibitedLabel}>Private Info</Text>
                </View>
                <View style={styles.prohibitedItem}>
                  <MaterialIcons name="campaign" size={18} color="#EF4444" />
                  <Text style={styles.prohibitedLabel}>Spam</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Privacy Policy */}
          <View style={[styles.section, styles.sectionGreen]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                <MaterialIcons name="security" size={20} color="#4DB6AC" />
              </View>
              <Text style={styles.sectionTitle}>Privacy Policy</Text>
            </View>

            <Text style={styles.sectionDescription}>
              We respect your privacy. We do not sell your personal data to third parties. Data is
              only shared with the relevant local authority to resolve the specific issue you have
              reported.
            </Text>

            <TouchableOpacity style={styles.readMoreButton} activeOpacity={0.8}>
              <Text style={styles.readMoreText}>Read Full Privacy Policy</Text>
              <MaterialIcons name="open-in-new" size={14} color="#5B7CFA" />
            </TouchableOpacity>
          </View>

          {/* Cookies */}
          <View style={[styles.section, styles.sectionYellow]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconBg, { backgroundColor: 'rgba(255, 213, 114, 0.1)' }]}>
                <MaterialIcons name="cookie" size={20} color="#FFD572" />
              </View>
              <Text style={styles.sectionTitle}>Cookies</Text>
            </View>

            <Text style={styles.sectionDescription}>
              We use essential cookies to keep you logged in and functional cookies to improve your
              experience. By continuing, you consent to our cookie usage.
            </Text>
          </View>
        </View>

        {/* Bottom spacing for fixed footer */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomGradient} />
        <View style={styles.bottomContent}>
          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
            >
              {agreedToTerms && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>
              I confirm that I have read, understood, and agree to the Terms of Service and Privacy
              Policy.
            </Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={onDecline || onBack}
              activeOpacity={0.8}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.agreeButton,
                !agreedToTerms && styles.agreeButtonDisabled,
              ]}
              onPress={handleAgree}
              activeOpacity={agreedToTerms ? 0.8 : 1}
              disabled={!agreedToTerms}
            >
              <Text
                style={[
                  styles.agreeButtonText,
                  !agreedToTerms && styles.agreeButtonTextDisabled,
                ]}
              >
                Agree &amp; Continue
              </Text>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Introduction
  introduction: {
    marginBottom: 24,
  },
  introText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Sections
  sections: {
    gap: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sectionPurple: {
    // Can add hover effect via borderColor if needed
  },
  sectionOrange: {},
  sectionGreen: {},
  sectionYellow: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },

  // Bullet List
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  bulletBold: {
    fontWeight: '700',
  },

  // Prohibited Box
  prohibitedBox: {
    backgroundColor: '#F4F7FE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },
  prohibitedTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  prohibitedIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  prohibitedItem: {
    alignItems: 'center',
    gap: 4,
  },
  prohibitedLabel: {
    fontSize: 10,
    color: '#6B7280',
  },

  // Read More Button
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B7CFA',
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
    height: 160,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 8,
    borderRadius: 12,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#5B7CFA',
    borderColor: '#5B7CFA',
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  declineButton: {
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
  declineButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  agreeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  agreeButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  agreeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  agreeButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default TermsPrivacyScreen;
