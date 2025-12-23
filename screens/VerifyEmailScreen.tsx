import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface VerifyEmailScreenProps {
  onBack?: () => void;
  onVerify?: (code: string) => void;
  onSkip?: () => void;
  onResendCode?: () => void;
  onEditEmail?: () => void;
  email?: string;
}

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  onBack,
  onVerify,
  onSkip,
  onResendCode,
  onEditEmail,
  email = 'sarah@example.com',
}) => {
  const [code, setCode] = useState('');

  const canVerify = code.length === 4;

  const handleVerify = () => {
    if (canVerify) {
      onVerify?.(code);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Check your inbox</Text>
            <Text style={styles.headerSubtitle}>
              We've sent a verification code to your email address.
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialIcons name="mark-email-unread" size={24} color="#7E8CE0" />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Email Info Card */}
        <View style={styles.emailCard}>
          <View style={styles.emailHeader}>
            <View style={styles.emailInfo}>
              <View style={styles.emailIconContainer}>
                <MaterialIcons name="alternate-email" size={20} color="#5B7CFA" />
              </View>
              <View style={styles.emailTextContainer}>
                <Text style={styles.emailLabel}>Sent to</Text>
                <Text style={styles.emailAddress}>{email}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEditEmail} activeOpacity={0.8}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Code Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Enter Verification Code</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="••••"
              placeholderTextColor="#D1D5DB"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={4}
              textAlign="center"
            />
          </View>
        </View>

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            Didn't receive the email?{' '}
            <TouchableOpacity onPress={onResendCode} activeOpacity={0.8}>
              <Text style={styles.resendLink}>
                Resend Code{' '}
                <MaterialIcons name="refresh" size={16} color="#5B7CFA" />
              </Text>
            </TouchableOpacity>
          </Text>

          <View style={styles.infoBox}>
            <MaterialIcons name="info-outline" size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              Please check your <Text style={styles.infoTextBold}>Spam</Text> or{' '}
              <Text style={styles.infoTextBold}>Junk</Text> folder if you don't see the email in
              your inbox within a few minutes.
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomGradient} />
        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={[styles.verifyButton, !canVerify && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            activeOpacity={canVerify ? 0.8 : 1}
            disabled={!canVerify}
          >
            <MaterialIcons
              name="verified-user"
              size={20}
              color={canVerify ? '#FFFFFF' : '#9CA3AF'}
            />
            <Text
              style={[
                styles.verifyButtonText,
                !canVerify && styles.verifyButtonTextDisabled,
              ]}
            >
              Verify Email
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={canVerify ? '#FFFFFF' : '#9CA3AF'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={onSkip} activeOpacity={0.8}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
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
    paddingHorizontal: 20,
    paddingTop: 32,
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
    maxWidth: 280,
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
    lineHeight: 20,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(126, 140, 224, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  content: {
    flex: 1,
  },

  // Email Card
  emailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 32,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  emailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailTextContainer: {
    gap: 2,
  },
  emailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emailAddress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B7CFA',
  },

  // Input Section
  inputSection: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    textAlign: 'center',
  },
  codeInput: {
    backgroundColor: '#F4F7FE',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    fontSize: 36,
    fontWeight: '700',
    color: '#333344',
    textAlign: 'center',
    letterSpacing: 16,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Help Section
  helpSection: {
    alignItems: 'center',
    gap: 16,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B7CFA',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  infoTextBold: {
    fontWeight: '700',
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
    height: 140,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0.1,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  verifyButtonTextDisabled: {
    color: '#9CA3AF',
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default VerifyEmailScreen;
