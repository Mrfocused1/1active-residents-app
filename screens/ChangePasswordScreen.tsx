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

interface ChangePasswordScreenProps {
  onBack?: () => void;
  onChangePassword?: (currentPassword: string, newPassword: string) => void;
  onForgotPassword?: () => void;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  onBack,
  onChangePassword,
  onForgotPassword,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStartedTyping, setCurrentStartedTyping] = useState(false);
  const [newStartedTyping, setNewStartedTyping] = useState(false);
  const [confirmStartedTyping, setConfirmStartedTyping] = useState(false);

  const handleCurrentPasswordChange = (text: string) => {
    if (text.length > 0 && !currentStartedTyping) {
      setCurrentStartedTyping(true);
    }
    setCurrentPassword(text);
  };

  const handleNewPasswordChange = (text: string) => {
    if (text.length > 0 && !newStartedTyping) {
      setNewStartedTyping(true);
    }
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    if (text.length > 0 && !confirmStartedTyping) {
      setConfirmStartedTyping(true);
    }
    setConfirmPassword(text);
  };

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength === 0) return { level: 'none', label: '', color: '#D1D5DB', width: '0%' };
    if (strength === 1) return { level: 'weak', label: 'Weak', color: '#EF4444', width: '25%' };
    if (strength === 2) return { level: 'fair', label: 'Fair', color: '#FFD572', width: '50%' };
    if (strength === 3) return { level: 'good', label: 'Good', color: '#5B7CFA', width: '75%' };
    return { level: 'strong', label: 'Strong', color: '#4DB6AC', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch;

  const handleChangePassword = () => {
    if (canSubmit) {
      onChangePassword?.(currentPassword, newPassword);
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
              <Text style={styles.headerTitle}>Change Password</Text>
              <Text style={styles.headerSubtitle}>Update your account password</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="vpn-key" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* Current Password */}
        <View style={styles.section}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={currentStartedTyping && !showCurrentPassword}
              value={currentPassword}
              onChangeText={handleCurrentPasswordChange}
              autoCapitalize="none"
              textContentType="none"
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="default"
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={showCurrentPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.forgotPasswordLink} activeOpacity={0.8} onPress={onForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <View style={styles.section}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={newStartedTyping && !showNewPassword}
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              autoCapitalize="none"
              textContentType="none"
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="default"
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

          {/* Password Strength Meter */}
          {newPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthBarFill,
                    { width: passwordStrength.width, backgroundColor: passwordStrength.color },
                  ]}
                />
              </View>
              <View style={styles.strengthLabelContainer}>
                <Text style={styles.strengthLabel}>Password Strength:</Text>
                <Text style={[styles.strengthValue, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Confirm Password */}
        <View style={styles.section}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={confirmStartedTyping && !showConfirmPassword}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              autoCapitalize="none"
              textContentType="none"
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="default"
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

        {/* Security Tips */}
        <View style={styles.tipsBox}>
          <View style={styles.tipsHeader}>
            <MaterialIcons name="lightbulb-outline" size={20} color="#FFD572" />
            <Text style={styles.tipsTitle}>Security Tips</Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <MaterialIcons name="check" size={14} color="#6B7280" />
              <Text style={styles.tipText}>Use a mix of letters, numbers, and symbols</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="check" size={14} color="#6B7280" />
              <Text style={styles.tipText}>Avoid common words and personal information</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="check" size={14} color="#6B7280" />
              <Text style={styles.tipText}>Use a unique password for this account</Text>
            </View>
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
            style={[styles.changeButton, !canSubmit && styles.changeButtonDisabled]}
            onPress={handleChangePassword}
            activeOpacity={canSubmit ? 0.8 : 1}
            disabled={!canSubmit}
          >
            <Text
              style={[
                styles.changeButtonText,
                !canSubmit && styles.changeButtonTextDisabled,
              ]}
            >
              Change Password
            </Text>
            <MaterialIcons
              name="check"
              size={20}
              color={canSubmit ? '#FFFFFF' : '#9CA3AF'}
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

  // Forgot Password Link
  forgotPasswordLink: {
    marginTop: 8,
    paddingLeft: 4,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B7CFA',
  },

  // Password Strength
  strengthContainer: {
    marginTop: 12,
  },
  strengthBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'all 0.3s ease',
  },
  strengthLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strengthLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '700',
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

  // Tips Box
  tipsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333344',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
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
  changeButton: {
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
  changeButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changeButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default ChangePasswordScreen;
