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

interface ThemeSelectionScreenProps {
  onBack?: () => void;
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({
  onBack,
  onThemeChange,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('light');

  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(theme);
    onThemeChange?.(theme);
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
              <Text style={styles.headerTitle}>Theme</Text>
              <Text style={styles.headerSubtitle}>Choose your preferred app theme</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="palette" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* Theme Options */}
        <View style={styles.themesContainer}>
          {/* Light Theme */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              selectedTheme === 'light' && styles.themeCardSelected,
            ]}
            onPress={() => handleThemeSelect('light')}
            activeOpacity={0.8}
          >
            <View style={styles.themePreview}>
              <View style={styles.lightPreview}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewDot} />
                  <View style={styles.previewDot} />
                  <View style={styles.previewDot} />
                </View>
                <View style={styles.previewContent}>
                  <View style={styles.previewBar} />
                  <View style={[styles.previewBar, { width: '70%' }]} />
                  <View style={[styles.previewBar, { width: '85%' }]} />
                </View>
              </View>
            </View>
            <View style={styles.themeInfo}>
              <View style={styles.themeHeader}>
                <View style={styles.themeLeft}>
                  <MaterialIcons name="wb-sunny" size={24} color="#FFD572" />
                  <Text style={styles.themeName}>Light</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedTheme === 'light' && styles.radioButtonSelected,
                  ]}
                >
                  {selectedTheme === 'light' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
              <Text style={styles.themeDescription}>
                A bright and clean interface perfect for daytime use
              </Text>
            </View>
          </TouchableOpacity>

          {/* Dark Theme */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              selectedTheme === 'dark' && styles.themeCardSelected,
            ]}
            onPress={() => handleThemeSelect('dark')}
            activeOpacity={0.8}
          >
            <View style={styles.themePreview}>
              <View style={styles.darkPreview}>
                <View style={styles.previewHeaderDark}>
                  <View style={styles.previewDotDark} />
                  <View style={styles.previewDotDark} />
                  <View style={styles.previewDotDark} />
                </View>
                <View style={styles.previewContent}>
                  <View style={styles.previewBarDark} />
                  <View style={[styles.previewBarDark, { width: '70%' }]} />
                  <View style={[styles.previewBarDark, { width: '85%' }]} />
                </View>
              </View>
            </View>
            <View style={styles.themeInfo}>
              <View style={styles.themeHeader}>
                <View style={styles.themeLeft}>
                  <MaterialIcons name="nightlight-round" size={24} color="#5B7CFA" />
                  <Text style={styles.themeName}>Dark</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedTheme === 'dark' && styles.radioButtonSelected,
                  ]}
                >
                  {selectedTheme === 'dark' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
              <Text style={styles.themeDescription}>
                Easy on the eyes for nighttime or low-light environments
              </Text>
            </View>
          </TouchableOpacity>

          {/* System Theme */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              selectedTheme === 'system' && styles.themeCardSelected,
            ]}
            onPress={() => handleThemeSelect('system')}
            activeOpacity={0.8}
          >
            <View style={styles.themePreview}>
              <View style={styles.systemPreview}>
                <View style={styles.previewSplit}>
                  <View style={styles.previewSplitLight}>
                    <View style={styles.previewHeaderSmall}>
                      <View style={styles.previewDotSmall} />
                      <View style={styles.previewDotSmall} />
                    </View>
                    <View style={styles.previewContentSmall}>
                      <View style={styles.previewBarSmall} />
                      <View style={[styles.previewBarSmall, { width: '60%' }]} />
                    </View>
                  </View>
                  <View style={styles.previewSplitDark}>
                    <View style={styles.previewHeaderSmall}>
                      <View style={styles.previewDotSmallDark} />
                      <View style={styles.previewDotSmallDark} />
                    </View>
                    <View style={styles.previewContentSmall}>
                      <View style={styles.previewBarSmallDark} />
                      <View style={[styles.previewBarSmallDark, { width: '60%' }]} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.themeInfo}>
              <View style={styles.themeHeader}>
                <View style={styles.themeLeft}>
                  <MaterialIcons name="brightness-auto" size={24} color="#4DB6AC" />
                  <Text style={styles.themeName}>System</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedTheme === 'system' && styles.radioButtonSelected,
                  ]}
                >
                  {selectedTheme === 'system' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
              <Text style={styles.themeDescription}>
                Automatically match your device's system settings
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="info-outline" size={20} color="#5B7CFA" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Theme Tip</Text>
            <Text style={styles.infoText}>
              Dark mode can help reduce eye strain and save battery life on devices with OLED
              screens.
            </Text>
          </View>
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

  // Theme Cards
  themesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  themeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  themeCardSelected: {
    borderColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOpacity: 0.15,
  },

  // Theme Preview
  themePreview: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  lightPreview: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  darkPreview: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
  },
  systemPreview: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewSplit: {
    flexDirection: 'row',
    height: 120,
  },
  previewSplitLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
    padding: 8,
  },
  previewSplitDark: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 8,
  },

  // Preview Elements
  previewHeader: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  previewHeaderDark: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  previewHeaderSmall: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  previewDotDark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5563',
  },
  previewDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  previewDotSmallDark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4B5563',
  },
  previewContent: {
    gap: 8,
  },
  previewContentSmall: {
    gap: 6,
  },
  previewBar: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  previewBarDark: {
    height: 12,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  previewBarSmall: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  previewBarSmallDark: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
  },

  // Theme Info
  themeInfo: {
    gap: 8,
  },
  themeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333344',
  },
  themeDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Radio Button
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#5B7CFA',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5B7CFA',
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
});

export default ThemeSelectionScreen;
