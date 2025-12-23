import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorScreenProps {
  onBack?: () => void;
  onRetry?: () => void;
  onContactSupport?: () => void;
  errorMessage?: string;
  errorType?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  onBack,
  onRetry,
  onContactSupport,
  errorMessage = "We're having trouble connecting to the server. Please check your internet connection.",
  errorType = 'Connection Timeout',
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
          <MaterialIcons name="arrow-back" size={20} color="#6B7280" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <MaterialIcons name="wifi-off" size={64} color="#FF8C66" />
              <View style={styles.errorBadge}>
                <MaterialIcons name="priority-high" size={20} color="#333344" />
              </View>
            </View>
          </View>
        </View>

        {/* Error Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Oops, something went wrong!</Text>
          <Text style={styles.description}>{errorMessage}</Text>
        </View>

        {/* Error Type Badge */}
        <View style={styles.errorTypeBadge}>
          <View style={styles.errorDot} />
          <Text style={styles.errorTypeText}>Error: {errorType}</Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.supportButton}
          onPress={onContactSupport}
          activeOpacity={0.8}
        >
          <Text style={styles.supportButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    marginBottom: 16,
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

  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Icon
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  iconGlow: {
    position: 'absolute',
    inset: 16,
    backgroundColor: 'rgba(255, 140, 102, 0.2)',
    borderRadius: 80,
    opacity: 0.6,
  },
  iconOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  iconInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255, 140, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  errorBadge: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Message
  messageContainer: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: '#333344',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Error Type Badge
  errorTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 32,
  },
  errorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8C66',
  },
  errorTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Bottom Buttons
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  retryButton: {
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
  retryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
  },
  supportButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
});

export default ErrorScreen;
