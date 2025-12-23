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

interface ResetPasswordScreenProps {
  onBack?: () => void;
  onResetPassword?: (password: string) => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onBack,
  onResetPassword,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password requirements validation
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const allRequirementsMet = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;

  const handleResetPassword = () => {
    if (allRequirementsMet) {
      onResetPassword?.(newPassword);
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
              <Text style={styles.headerTitle}>Reset Password</Text>
              <Text style={styles.headerSubtitle}>Create a new secure password</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="lock-reset" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* New Password Input */}
        <View style={styles.section}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={showNewPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Requirements */}
        <View style={styles.requirementsSection}>
          <Text style={styles.requirementsTitle}>Password Requirements</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <MaterialIcons
                name={hasMinLength ? 'check-circle' : 'radio-button-unchecked'}
                size={18}
                color={hasMinLength ? '#4DB6AC' : '#D1D5DB'}
              />
              <Text style={[styles.requirementText, hasMinLength && styles.requirementTextMet]}>
                At least 8 characters
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <MaterialIcons
                name={hasUpperCase ? 'check-circle' : 'radio-button-unchecked'}
                size={18}
                color={hasUpperCase ? '#4DB6AC' : '#D1D5DB'}
              />
              <Text style={[styles.requirementText, hasUpperCase && styles.requirementTextMet]}>
                One uppercase letter
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <MaterialIcons
                name={hasLowerCase ? 'check-circle' : 'radio-button-unchecked'}
                size={18}
                color={hasLowerCase ? '#4DB6AC' : '#D1D5DB'}
              />
              <Text style={[styles.requirementText, hasLowerCase && styles.requirementTextMet]}>
                One lowercase letter
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <MaterialIcons
                name={hasNumber ? 'check-circle' : 'radio-button-unchecked'}
                size={18}
                color={hasNumber ? '#4DB6AC' : '#D1D5DB'}
              />
              <Text style={[styles.requirementText, hasNumber && styles.requirementTextMet]}>
                One number
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <MaterialIcons
                name={hasSpecialChar ? 'check-circle' : 'radio-button-unchecked'}
                size={18}
                color={hasSpecialChar ? '#4DB6AC' : '#D1D5DB'}
              />
              <Text style={[styles.requirementText, hasSpecialChar && styles.requirementTextMet]}>
                One special character (!@#$%^&*)
              </Text>
            </View>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && (
            <View style={styles.matchIndicator}>
              <MaterialIcons
                name={passwordsMatch ? 'check-circle' : 'cancel'}
                size={16}
                color={passwordsMatch ? '#4DB6AC' : '#EF4444'}
              />
              <Text style={[styles.matchText, passwordsMatch && styles.matchTextSuccess]}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}
        </View>

        {/* Security Info */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="info-outline" size={20} color="#5B7CFA" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Security Notice</Text>
            <Text style={styles.infoText}>
              Resetting your password will log you out of all devices. You'll need to log in again
              with your new password.
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomGradient} />
        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={[styles.resetButton, !allRequirementsMet && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            activeOpacity={allRequirementsMet ? 0.8 : 1}
            disabled={!allRequirementsMet}
          >
            <Text
              style={[
                styles.resetButtonText,
                !allRequirementsMet && styles.resetButtonTextDisabled,
              ]}
            >
              Reset Password
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={allRequirementsMet ? '#FFFFFF' : '#9CA3AF'}
            />
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

  // Input Section
  section: {
    marginBottom: 24,
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
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  eyeIcon: {
    padding: 4,
  },

  // Password Requirements
  requirementsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 12,
  },
  requirementsList: {
    gap: 10,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  requirementTextMet: {
    color: '#4DB6AC',
    fontWeight: '600',
  },

  // Match Indicator
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingLeft: 4,
  },
  matchText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  matchTextSuccess: {
    color: '#4DB6AC',
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
  resetButton: {
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
  resetButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resetButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default ResetPasswordScreen;
