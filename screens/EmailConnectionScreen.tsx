import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import emailService from '../services/email.service';

interface EmailConnectionScreenProps {
  onBack: () => void;
}

const EmailConnectionScreen: React.FC<EmailConnectionScreenProps> = ({ onBack }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [autoSendReports, setAutoSendReports] = useState<boolean>(true);
  const [receiveCopies, setReceiveCopies] = useState<boolean>(true);
  const [trackEmails, setTrackEmails] = useState<boolean>(true);
  const [showDisconnectModal, setShowDisconnectModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const connected = await emailService.isConnected();
      setIsConnected(connected);

      if (connected) {
        const email = await emailService.getUserEmail();
        if (email) {
          setUserEmail(email);
        }

        const prefs = await emailService.getPreferences();
        setAutoSendReports(prefs.autoSendReports);
        setReceiveCopies(prefs.receiveCopies);
        setTrackEmails(prefs.trackEmails);
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      console.log('🔐 Initiating Gmail OAuth...');
      const success = await emailService.connectGmail();

      if (success) {
        setIsConnected(true);
        const email = await emailService.getUserEmail();
        if (email) {
          setUserEmail(email);
        }
        Alert.alert(
          'Success!',
          'Your Gmail account has been connected successfully.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          'Unable to connect your Gmail account. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert(
        'Error',
        'An error occurred while connecting your Gmail account.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = async () => {
    try {
      await emailService.disconnect();
      setIsConnected(false);
      setUserEmail('');
      setShowDisconnectModal(false);
      Alert.alert(
        'Disconnected',
        'Your Gmail account has been disconnected.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Disconnect error:', error);
      Alert.alert(
        'Error',
        'An error occurred while disconnecting your account.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSaveChanges = async () => {
    try {
      await emailService.savePreferences({
        autoSendReports,
        receiveCopies,
        trackEmails,
      });
      Alert.alert(
        'Saved',
        'Your email preferences have been saved.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        'Error',
        'An error occurred while saving your preferences.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTestEmail = async () => {
    try {
      Alert.alert(
        'Sending Test Email',
        'A test email will be sent to your connected Gmail account.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send',
            onPress: async () => {
              const success = await emailService.sendTestEmail();
              if (success) {
                Alert.alert(
                  'Success',
                  'Test email sent! Check your inbox.',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Failed',
                  'Unable to send test email. Please try again.',
                  [{ text: 'OK' }]
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Test email error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5B7CFA" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Email Connection</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Connection Status Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Status</Text>
          <View style={[styles.statusCard, isConnected && styles.statusCardConnected]}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIconContainer}>
                <MaterialIcons
                  name={isConnected ? "check-circle" : "mail-outline"}
                  size={28}
                  color={isConnected ? "#4DB6AC" : "#6B7280"}
                />
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </Text>
                {isConnected && userEmail && (
                  <Text style={styles.statusEmail}>{userEmail}</Text>
                )}
              </View>
            </View>

            {isConnected ? (
              <>
                <TouchableOpacity
                  style={styles.disconnectButton}
                  activeOpacity={0.8}
                  onPress={handleDisconnect}
                >
                  <Text style={styles.disconnectButtonText}>Disconnect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.testEmailButton}
                  activeOpacity={0.8}
                  onPress={handleTestEmail}
                >
                  <MaterialIcons name="send" size={18} color="#5B7CFA" />
                  <Text style={styles.testEmailButtonText}>Send Test Email</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
                activeOpacity={0.8}
                onPress={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.connectButtonText}>Connecting...</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="mail" size={20} color="#FFFFFF" />
                    <Text style={styles.connectButtonText}>Connect Gmail Account</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Email Preferences */}
        {isConnected && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Preferences</Text>
            <View style={styles.preferencesCard}>
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <MaterialIcons name="send" size={22} color="#5B7CFA" />
                  <View style={styles.preferenceTextContainer}>
                    <Text style={styles.preferenceTitle}>Auto-send Reports</Text>
                    <Text style={styles.preferenceSubtitle}>
                      Automatically send reports from your email
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoSendReports}
                  onValueChange={setAutoSendReports}
                  trackColor={{ false: '#D1D5DB', true: '#A5D6A7' }}
                  thumbColor={autoSendReports ? '#4DB6AC' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <MaterialIcons name="content-copy" size={22} color="#5B7CFA" />
                  <View style={styles.preferenceTextContainer}>
                    <Text style={styles.preferenceTitle}>Receive CC Copies</Text>
                    <Text style={styles.preferenceSubtitle}>
                      Get a copy of all sent emails
                    </Text>
                  </View>
                </View>
                <Switch
                  value={receiveCopies}
                  onValueChange={setReceiveCopies}
                  trackColor={{ false: '#D1D5DB', true: '#A5D6A7' }}
                  thumbColor={receiveCopies ? '#4DB6AC' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <MaterialIcons name="timeline" size={22} color="#5B7CFA" />
                  <View style={styles.preferenceTextContainer}>
                    <Text style={styles.preferenceTitle}>Track Email Activity</Text>
                    <Text style={styles.preferenceSubtitle}>
                      Monitor email opens and responses
                    </Text>
                  </View>
                </View>
                <Switch
                  value={trackEmails}
                  onValueChange={setTrackEmails}
                  trackColor={{ false: '#D1D5DB', true: '#A5D6A7' }}
                  thumbColor={trackEmails ? '#4DB6AC' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>
          </View>
        )}

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.benefitsCard}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <MaterialIcons name="verified" size={20} color="#4DB6AC" />
              </View>
              <Text style={styles.benefitText}>
                Send reports directly from your personal email
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <MaterialIcons name="verified" size={20} color="#4DB6AC" />
              </View>
              <Text style={styles.benefitText}>
                Track all email correspondence in one place
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <MaterialIcons name="verified" size={20} color="#4DB6AC" />
              </View>
              <Text style={styles.benefitText}>
                Get CC'd on all communications with departments
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <MaterialIcons name="verified" size={20} color="#4DB6AC" />
              </View>
              <Text style={styles.benefitText}>
                View detailed analytics on email activity
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <MaterialIcons name="verified" size={20} color="#4DB6AC" />
              </View>
              <Text style={styles.benefitText}>
                Maintain professional communication records
              </Text>
            </View>
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.privacyCard}>
            <View style={styles.privacyItem}>
              <MaterialIcons name="lock" size={20} color="#6B7280" />
              <Text style={styles.privacyText}>
                Your email credentials are securely stored using OAuth 2.0
              </Text>
            </View>

            <View style={styles.privacyItem}>
              <MaterialIcons name="visibility-off" size={20} color="#6B7280" />
              <Text style={styles.privacyText}>
                We never read your personal emails or access your inbox
              </Text>
            </View>

            <View style={styles.privacyItem}>
              <MaterialIcons name="shield" size={20} color="#6B7280" />
              <Text style={styles.privacyText}>
                All communications are encrypted end-to-end
              </Text>
            </View>

            <View style={styles.privacyItem}>
              <MaterialIcons name="cancel" size={20} color="#6B7280" />
              <Text style={styles.privacyText}>
                You can disconnect your email at any time
              </Text>
            </View>
          </View>
        </View>

        {/* Save Changes Button */}
        {isConnected && (
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Disconnect Confirmation Modal */}
      <Modal
        visible={showDisconnectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDisconnectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <MaterialIcons name="warning" size={48} color="#FF8C66" />
            </View>
            <Text style={styles.modalTitle}>Disconnect Email?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to disconnect your email? You will no longer be able to send reports from your email address or track email activity.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                activeOpacity={0.8}
                onPress={() => setShowDisconnectModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                activeOpacity={0.8}
                onPress={confirmDisconnect}
              >
                <Text style={styles.modalConfirmText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusCardConnected: {
    borderColor: '#4DB6AC',
    borderWidth: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  connectButton: {
    backgroundColor: '#5B7CFA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disconnectButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  disconnectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  testEmailButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  testEmailButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5B7CFA',
    marginLeft: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  preferencesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  preferenceTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  privacyCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: '#5B7CFA',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 32,
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EmailConnectionScreen;
