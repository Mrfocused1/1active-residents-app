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

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageSelectionScreenProps {
  onBack?: () => void;
  onLanguageChange?: (languageCode: string) => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onBack,
  onLanguageChange,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-GB');

  const languages: Language[] = [
    {
      code: 'en-GB',
      name: 'English (UK)',
      nativeName: 'English (United Kingdom)',
      flag: '🇬🇧',
    },
    {
      code: 'cy',
      name: 'Welsh',
      nativeName: 'Cymraeg',
      flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    },
    {
      code: 'gd',
      name: 'Scottish Gaelic',
      nativeName: 'Gàidhlig',
      flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    },
    {
      code: 'ga',
      name: 'Irish',
      nativeName: 'Gaeilge',
      flag: '🇮🇪',
    },
    {
      code: 'pl',
      name: 'Polish',
      nativeName: 'Polski',
      flag: '🇵🇱',
    },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange?.(languageCode);
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
              <Text style={styles.headerTitle}>Language</Text>
              <Text style={styles.headerSubtitle}>Choose your preferred language</Text>
            </View>
            <View style={styles.headerIcon}>
              <MaterialIcons name="translate" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* Language List */}
        <View style={styles.languagesContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                selectedLanguage === language.code && styles.languageCardSelected,
              ]}
              onPress={() => handleLanguageSelect(language.code)}
              activeOpacity={0.8}
            >
              <View style={styles.languageLeft}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNativeName}>{language.nativeName}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedLanguage === language.code && styles.radioButtonSelected,
                ]}
              >
                {selectedLanguage === language.code && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="info-outline" size={20} color="#5B7CFA" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Language Support</Text>
            <Text style={styles.infoText}>
              The app will restart to apply the language change. Some council-specific content may
              only be available in English.
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

  // Language Cards
  languagesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  languageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  languageCardSelected: {
    borderColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOpacity: 0.15,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  languageFlag: {
    fontSize: 36,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 2,
  },
  languageNativeName: {
    fontSize: 13,
    color: '#6B7280',
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

export default LanguageSelectionScreen;
