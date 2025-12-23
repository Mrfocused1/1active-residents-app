import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EmailPreviewScreenProps {
  onBack: () => void;
  reportId?: string;
  initialSubject?: string;
  initialBody?: string;
  recipientEmail?: string;
  userEmail?: string;
  attachmentNames?: string[];
}

const EmailPreviewScreen: React.FC<EmailPreviewScreenProps> = ({
  onBack,
  reportId = '',
  initialSubject = '',
  initialBody = '',
  recipientEmail = '',
  userEmail = '',
  attachmentNames = [],
}) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [emailSubject, setEmailSubject] = useState<string>(initialSubject);
  const [emailBody, setEmailBody] = useState<string>(initialBody);

  const emailData = {
    from: userEmail,
    to: recipientEmail,
    cc: userEmail,
    attachments: attachmentNames,
  };

  const openDefaultMailApp = async () => {
    try {
      // Create mailto URL with prefilled data
      const subject = encodeURIComponent(emailSubject);
      const body = encodeURIComponent(emailBody);
      const to = emailData.to;
      const cc = emailData.cc;

      const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}&cc=${cc}`;

      // Check if the device can open mailto links
      const canOpen = await Linking.canOpenURL(mailtoUrl);

      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        Alert.alert(
          'Email App Opened',
          'Your default email app has been opened with the pre-filled information. Please send the email from there.',
          [{ text: 'OK', onPress: onBack }]
        );
      } else {
        Alert.alert(
          'Cannot Open Email App',
          'Unable to open your email app. Please check your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening mail app:', error);
      Alert.alert(
        'Error',
        'An error occurred while trying to open your email app.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSend = () => {
    if (!isConfirmed) {
      Alert.alert('Confirmation Required', 'Please confirm that you have reviewed the email before sending.');
      return;
    }

    // Since user hasn't connected their email account, open default mail app
    Alert.alert(
      'Send Email',
      'This will open your default email app with the pre-filled information. You can review and send from there.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Email App',
          onPress: openDefaultMailApp,
        },
      ]
    );
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', { emailSubject, emailBody });
    Alert.alert('Draft Saved', 'Your email has been saved as a draft.');
  };

  const handleQuickEdit = (field: string) => {
    setIsEditing(true);
    // Focus on the appropriate field
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Send</Text>
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.7}
          onPress={() => setIsEditing(!isEditing)}
        >
          <MaterialIcons name={isEditing ? "done" : "edit"} size={24} color="#5B7CFA" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Email Header */}
        <View style={styles.section}>
          <View style={styles.emailHeaderCard}>
            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>From:</Text>
              <Text style={styles.headerValue}>{emailData.from}</Text>
              <TouchableOpacity onPress={() => handleQuickEdit('from')} activeOpacity={0.7}>
                <MaterialIcons name="edit" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>To:</Text>
              <Text style={styles.headerValue}>{emailData.to}</Text>
              <TouchableOpacity onPress={() => handleQuickEdit('to')} activeOpacity={0.7}>
                <MaterialIcons name="edit" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>CC:</Text>
              <Text style={styles.headerValue} numberOfLines={2}>{emailData.cc}</Text>
              <TouchableOpacity onPress={() => handleQuickEdit('cc')} activeOpacity={0.7}>
                <MaterialIcons name="edit" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.headerRow}>
              <Text style={styles.headerLabel}>Subject:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.headerInput}
                  value={emailSubject}
                  onChangeText={setEmailSubject}
                  multiline
                />
              ) : (
                <Text style={styles.headerValue}>{emailSubject}</Text>
              )}
              <TouchableOpacity onPress={() => handleQuickEdit('subject')} activeOpacity={0.7}>
                <MaterialIcons name="edit" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Attachments */}
        {emailData.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments ({emailData.attachments.length})</Text>
            <View style={styles.attachmentsCard}>
              {emailData.attachments.map((attachment, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <View style={styles.attachmentLeft}>
                    <MaterialIcons name="attach-file" size={20} color="#5B7CFA" />
                    <Text style={styles.attachmentName}>{attachment}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7}>
                    <MaterialIcons name="close" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Email Body */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Body</Text>
          <View style={styles.emailBodyCard}>
            {isEditing ? (
              <TextInput
                style={styles.emailBodyInput}
                value={emailBody}
                onChangeText={setEmailBody}
                multiline
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.emailBodyText}>{emailBody}</Text>
            )}
          </View>
        </View>

        {/* Quick Edit Options */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsCard}>
              <TouchableOpacity
                style={styles.quickActionButton}
                activeOpacity={0.8}
                onPress={() => setIsEditing(true)}
              >
                <MaterialIcons name="edit" size={20} color="#5B7CFA" />
                <Text style={styles.quickActionText}>Edit Content</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                activeOpacity={0.8}
                onPress={() => console.log('Add attachment')}
              >
                <MaterialIcons name="attach-file" size={20} color="#5B7CFA" />
                <Text style={styles.quickActionText}>Add Attachment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                activeOpacity={0.8}
                onPress={() => console.log('Change recipients')}
              >
                <MaterialIcons name="people" size={20} color="#5B7CFA" />
                <Text style={styles.quickActionText}>Change Recipients</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Confirmation Checkbox */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.confirmationRow}
            activeOpacity={0.7}
            onPress={() => setIsConfirmed(!isConfirmed)}
          >
            <View style={[styles.checkbox, isConfirmed && styles.checkboxChecked]}>
              {isConfirmed && <MaterialIcons name="check" size={18} color="#FFFFFF" />}
            </View>
            <Text style={styles.confirmationText}>
              I have reviewed the email and confirm it is ready to send
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.section}>
          <View style={styles.infoBanner}>
            <MaterialIcons name="info" size={20} color="#5B7CFA" />
            <Text style={styles.infoBannerText}>
              A copy of this email will be sent to your inbox and saved in your analytics dashboard.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.draftButton}
              activeOpacity={0.8}
              onPress={handleSaveDraft}
            >
              <MaterialIcons name="save" size={20} color="#6B7280" />
              <Text style={styles.draftButtonText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sendButton, !isConfirmed && styles.sendButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleSend}
              disabled={!isConfirmed}
            >
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  editButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emailHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 70,
  },
  headerValue: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginRight: 8,
  },
  headerInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginRight: 8,
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  attachmentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attachmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  emailBodyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 200,
  },
  emailBodyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  emailBodyInput: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    minHeight: 200,
    padding: 0,
  },
  quickActionsCard: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionText: {
    fontSize: 12,
    color: '#5B7CFA',
    marginTop: 6,
    textAlign: 'center',
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4DB6AC',
    borderColor: '#4DB6AC',
  },
  confirmationText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#5B7CFA',
    marginLeft: 12,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  draftButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#5B7CFA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default EmailPreviewScreen;
