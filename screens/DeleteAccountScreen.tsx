import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DeleteAccountScreenProps {
  onBack?: () => void;
  onDeleteAccount?: (password: string) => void;
}

const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({
  onBack,
  onDeleteAccount,
}) => {
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [passwordStartedTyping, setPasswordStartedTyping] = useState(false);

  const handlePasswordChange = (text: string) => {
    if (text.length > 0 && !passwordStartedTyping) {
      setPasswordStartedTyping(true);
    }
    setPassword(text);
  };

  const canDelete = password.length > 0 && confirmed;

  const handleDelete = () => {
    if (canDelete) {
      onDeleteAccount?.(password);
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
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Delete Account</Text>
              <Text style={styles.headerSubtitle}>Permanent action</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="warning-amber" size={24} color="#EF4444" />
            </View>
          </View>
        </View>

        {/* Warning Section */}
        <View style={styles.warningSection}>
          <View style={styles.warningHeader}>
            <MaterialIcons name="report-problem" size={20} color="#EF4444" />
            <Text style={styles.warningTitle}>This action is irreversible</Text>
          </View>
          <Text style={styles.warningDescription}>
            If you delete your account, your data will be permanently removed from our servers.
            This cannot be undone.
          </Text>

          <View style={styles.consequencesList}>
            <View style={styles.consequenceItem}>
              <MaterialIcons name="remove-circle-outline" size={18} color="#EF4444" />
              <Text style={styles.consequenceText}>
                You will lose access to all your reported community issues.
              </Text>
            </View>

            <View style={styles.consequenceItem}>
              <MaterialIcons name="remove-circle-outline" size={18} color="#EF4444" />
              <Text style={styles.consequenceText}>
                Active reports will be anonymized but remain in the council system.
              </Text>
            </View>

            <View style={styles.consequenceItem}>
              <MaterialIcons name="remove-circle-outline" size={18} color="#EF4444" />
              <Text style={styles.consequenceText}>
                You will no longer receive status updates on local repairs.
              </Text>
            </View>
          </View>
        </View>

        {/* Security Verification */}
        <View style={styles.verificationSection}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="lock" size={18} color="#9CA3AF" />
            <Text style={styles.sectionTitle}>Security Verification</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Enter Password to Confirm</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={passwordStartedTyping}
                value={password}
                onChangeText={handlePasswordChange}
                autoCapitalize="none"
                textContentType="none"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                keyboardType="default"
              />
              <MaterialIcons name="key" size={20} color="#9CA3AF" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setConfirmed(!confirmed)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
              {confirmed && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.checkboxText}>
              I understand that deleting my account will result in the permanent loss of my data.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomGradient} />
        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={[styles.deleteButton, !canDelete && styles.deleteButtonDisabled]}
            onPress={handleDelete}
            activeOpacity={canDelete ? 0.8 : 1}
            disabled={!canDelete}
          >
            <MaterialIcons
              name="delete-forever"
              size={20}
              color={canDelete ? '#FFFFFF' : '#9CA3AF'}
            />
            <Text
              style={[
                styles.deleteButtonText,
                !canDelete && styles.deleteButtonTextDisabled,
              ]}
            >
              Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onBack} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Warning Section
  warningSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
    marginBottom: 24,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  warningTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  warningDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  consequencesList: {
    gap: 12,
  },
  consequenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  consequenceText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Verification Section
  verificationSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
  },

  // Input
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 48,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333344',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 20,
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Bottom Container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    pointerEvents: 'box-none',
  },
  bottomGradient: {
    height: 140,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
    pointerEvents: 'auto',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  deleteButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  deleteButtonTextDisabled: {
    color: '#9CA3AF',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default DeleteAccountScreen;
