import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface HelpScreenProps {
  onBack?: () => void;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
}

interface FAQItem {
  id: string;
  icon: string;
  question: string;
  answer: string;
}

interface GuideItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  borderColor: string;
}

const HelpScreen: React.FC<HelpScreenProps> = ({
  onBack,
  onStartReport,
  onSeeAll,
  onCouncilUpdate,
  onProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const guides: GuideItem[] = [
    {
      id: '1',
      icon: 'school',
      title: 'How to Report',
      description: 'Step-by-step guide to submitting your first issue.',
      color: '#7E8CE0',
      borderColor: '#7E8CE0',
    },
    {
      id: '2',
      icon: 'build',
      title: 'Troubleshooting',
      description: 'GPS location not updating? Fix common issues.',
      color: '#FF8C66',
      borderColor: '#FF8C66',
    },
    {
      id: '3',
      icon: 'verified-user',
      title: 'Community Rules',
      description: 'What can and cannot be reported on the platform.',
      color: '#FFD572',
      borderColor: '#FFD572',
    },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      icon: 'help-outline',
      question: 'Can I report anonymously?',
      answer:
        "Yes, you can submit reports without creating an account. However, you won't receive updates on the progress of the issue.",
    },
    {
      id: '2',
      icon: 'timer',
      question: 'How long do fixes take?',
      answer:
        'Timelines vary by severity. Emergency issues (e.g., exposed wiring) are typically attended to within 4 hours. Standard repairs usually take 5-7 working days.',
    },
    {
      id: '3',
      icon: 'edit-location',
      question: 'Can I change a location?',
      answer:
        'Once submitted, locations cannot be edited to preserve the integrity of the report. Please submit a new report if the location was significantly incorrect.',
    },
    {
      id: '4',
      icon: 'category',
      question: 'What if I pick the wrong category?',
      answer:
        "Don't worry! Our triage team reviews every submission and will re-categorize your report to the correct department if necessary.",
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
              <Text style={styles.headerTitle}>Help &amp; Support</Text>
              <Text style={styles.headerSubtitle}>How can we help you today?</Text>
            </View>
            <View style={styles.supportIcon}>
              <MaterialIcons name="support-agent" size={24} color="#5B7CFA" />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <MaterialIcons name="search" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for issues, topics, or guides..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Get in Touch Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <TouchableOpacity style={styles.touchCardSingle} activeOpacity={0.8}>
            <View style={[styles.touchIconBg, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
              <MaterialIcons name="mail" size={24} color="#5B7CFA" />
            </View>
            <Text style={styles.touchCardTitle}>Email Us</Text>
            <Text style={styles.touchCardSubtitle}>Response in 24h</Text>
          </TouchableOpacity>
        </View>

        {/* Guides & Tips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Guides &amp; Tips</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.guidesContainer}
            style={styles.guidesScroll}
          >
            {guides.map((guide) => (
              <TouchableOpacity
                key={guide.id}
                style={[styles.guideCard, { borderLeftColor: guide.borderColor }]}
                activeOpacity={0.8}
              >
                <View style={styles.guideDecoration} />
                <View
                  style={[
                    styles.guideIcon,
                    { backgroundColor: `${guide.color}1A` }, // 10% opacity
                  ]}
                >
                  <MaterialIcons name={guide.icon as any} size={18} color={guide.color} />
                </View>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideDescription}>{guide.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <View
                key={faq.id}
                style={[
                  styles.faqItem,
                  index < faqs.length - 1 && styles.faqItemBorder,
                ]}
              >
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.faqHeaderLeft}>
                    <MaterialIcons
                      name={faq.icon as any}
                      size={18}
                      color={expandedFAQ === faq.id ? '#5B7CFA' : '#9CA3AF'}
                    />
                    <Text
                      style={[
                        styles.faqQuestion,
                        expandedFAQ === faq.id && styles.faqQuestionActive,
                      ]}
                    >
                      {faq.question}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="expand-more"
                    size={20}
                    color="#9CA3AF"
                    style={[
                      styles.faqChevron,
                      expandedFAQ === faq.id && styles.faqChevronExpanded,
                    ]}
                  />
                </TouchableOpacity>

                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onBack}>
            <MaterialIcons name="home" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onCouncilUpdate}>
            <MaterialIcons name="chat-bubble-outline" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Updates</Text>
          </TouchableOpacity>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <TouchableOpacity style={styles.navFab} activeOpacity={0.9} onPress={onStartReport}>
              <MaterialIcons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onSeeAll}>
            <MaterialIcons name="history" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onProfile}>
            <MaterialIcons name="person-outline" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
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
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333344',
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  viewAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B7CFA',
  },

  // Get in Touch
  touchGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  touchCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  touchCardSingle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  touchIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
  },
  touchCardSubtitle: {
    fontSize: 10,
    color: '#6B7280',
  },

  // Guides
  guidesScroll: {
    marginHorizontal: -20,
  },
  guidesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  guideCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  guideDecoration: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  guideIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },

  // FAQ
  faqContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  faqItem: {
    paddingVertical: 4,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    flex: 1,
  },
  faqQuestionActive: {
    color: '#5B7CFA',
  },
  faqChevron: {
    transform: [{ rotate: '0deg' }],
  },
  faqChevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 44,
  },
  faqAnswerText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Bottom Navigation
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    pointerEvents: 'box-none',
  },
  navGradient: {
    height: 128,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  navBar: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#5B7CFA',
  },
  navFabContainer: {
    position: 'relative',
    top: -32,
  },
  navFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B7CFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
});

export default HelpScreen;
