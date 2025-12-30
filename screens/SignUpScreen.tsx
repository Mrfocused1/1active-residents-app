import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SignUpScreenProps {
  onBack?: () => void;
  onSignUp?: (data: { fullName: string; email: string; password: string }) => Promise<void> | void;
  onLogin?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onBack,
  onSignUp,
  onLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // Track if user has started typing to enable secureTextEntry after first character
  const [passwordStartedTyping, setPasswordStartedTyping] = useState(false);
  const [confirmStartedTyping, setConfirmStartedTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (text: string) => {
    if (text.length > 0 && !passwordStartedTyping) {
      setPasswordStartedTyping(true);
    }
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    if (text.length > 0 && !confirmStartedTyping) {
      setConfirmStartedTyping(true);
    }
    setConfirmPassword(text);
  };

  const canSignUp =
    fullName.trim() &&
    email.trim() &&
    password.length >= 8 &&
    password === confirmPassword &&
    agreedToTerms;

  const handleSignUp = async () => {
    if (canSignUp && !isLoading) {
      setIsLoading(true);
      try {
        await onSignUp?.({ fullName, email, password });
      } finally {
        setIsLoading(false);
      }
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
              <Text style={styles.headerTitle}>Create Account</Text>
              <Text style={styles.headerSubtitle}>Join your community to make a difference</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="person-add" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="badge" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Sarah Jenkins"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="alternate-email" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="sarah@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={passwordStartedTyping && !showPassword}
                value={password}
                onChangeText={handlePasswordChange}
                autoCapitalize="none"
                textContentType="none"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                keyboardType="default"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {password.length > 0 && (
              <View style={styles.passwordHint}>
                <MaterialIcons
                  name={password.length >= 8 ? 'check-circle' : 'info'}
                  size={14}
                  color={password.length >= 8 ? '#4DB6AC' : '#9CA3AF'}
                />
                <Text style={[styles.passwordHintText, password.length >= 8 && styles.passwordHintSuccess]}>
                  {password.length >= 8 ? 'Password meets requirements' : `${password.length}/8 characters minimum`}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock-reset" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={confirmStartedTyping}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                autoCapitalize="none"
                textContentType="none"
                autoComplete="off"
                autoCorrect={false}
                spellCheck={false}
                keyboardType="default"
              />
            </View>
            {confirmPassword.length > 0 && (
              <View style={styles.matchIndicator}>
                <MaterialIcons
                  name={password === confirmPassword ? 'check-circle' : 'cancel'}
                  size={16}
                  color={password === confirmPassword ? '#4DB6AC' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.matchText,
                    password === confirmPassword && styles.matchTextSuccess,
                  ]}
                >
                  {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </Text>
              </View>
            )}
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> &{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
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
            style={[styles.signUpButton, (!canSignUp || isLoading) && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            activeOpacity={canSignUp && !isLoading ? 0.8 : 1}
            disabled={!canSignUp || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text
                  style={[
                    styles.signUpButtonText,
                    !canSignUp && styles.signUpButtonTextDisabled,
                  ]}
                >
                  Create Account
                </Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color={canSignUp ? '#FFFFFF' : '#9CA3AF'}
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onLogin} activeOpacity={0.8}>
              <Text style={styles.loginLink}>Log In</Text>
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
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
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
    marginBottom: 8,
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

  // Form
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    marginLeft: 4,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: '#333344',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  // Match Indicator
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginLeft: 4,
  },
  matchText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  matchTextSuccess: {
    color: '#4DB6AC',
  },
  passwordHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginLeft: 4,
  },
  passwordHintText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  passwordHintSuccess: {
    color: '#4DB6AC',
  },

  // Terms
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
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
    backgroundColor: '#5B7CFA',
    borderColor: '#5B7CFA',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  termsLink: {
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
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  signUpButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  signUpButtonTextDisabled: {
    color: '#9CA3AF',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B7CFA',
  },
});

export default SignUpScreen;
