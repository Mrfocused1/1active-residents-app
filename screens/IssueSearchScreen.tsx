import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { searchIssueTopics, IssueTopic } from '../services/issueTopicsAPI';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';

interface IssueSearchScreenProps {
  onBack?: () => void;
  onIssueSelected?: (topic: IssueTopic) => void;
}

const IssueSearchScreen: React.FC<IssueSearchScreenProps> = ({
  onBack,
  onIssueSelected,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<IssueTopic[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Debounced search effect
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const results = await searchIssueTopics(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleIssuePress = (topic: IssueTopic) => {
    if (onIssueSelected) {
      onIssueSelected(topic);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <FadeIn delay={100}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <ScalePress onPress={onBack}>
              <View style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#1E293B" />
              </View>
            </ScalePress>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>STEP 1 OF 3</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.title}>Search for your issue</Text>
          <Text style={styles.subtitle}>
            Type keywords to find the right category for your report. This ensures it reaches the correct department.
          </Text>
        </View>
      </FadeIn>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="e.g. pothole, street light, bin collection..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.7}>
              <MaterialIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading State */}
        {isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5B7CFA" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {/* Search Results */}
        {!isSearching && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Search Results</Text>
              <View style={styles.resultsCount}>
                <Text style={styles.resultsCountText}>{searchResults.length}</Text>
              </View>
            </View>

            {searchResults.map((topic, index) => (
              <SlideIn key={topic.id} delay={500 + index * 100} from="bottom" distance={20}>
                <ScalePress onPress={() => handleIssuePress(topic)}>
                  <View style={styles.resultCard}>
                    <View style={styles.resultLeft}>
                      <View style={styles.resultIconContainer}>
                        <MaterialIcons name="description" size={24} color="#5B7CFA" />
                      </View>
                      <View style={styles.resultText}>
                        <Text style={styles.resultTitle}>{topic.title}</Text>
                        <Text style={styles.resultDescription}>{topic.description}</Text>
                        <View style={styles.departmentInfo}>
                          <View style={styles.departmentBadge}>
                            <MaterialIcons name="business" size={14} color="#059669" />
                            <Text style={styles.departmentName}>{topic.department}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <MaterialIcons name="arrow-forward-ios" size={16} color="#D1D5DB" />
                  </View>
                </ScalePress>
              </SlideIn>
            ))}
          </View>
        )}

        {/* No Results */}
        {!isSearching && hasSearched && searchResults.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="search-off" size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyMessage}>
              Try different keywords or check your spelling.{'\n'}
              You can also go back and select a general category.
            </Text>
          </View>
        )}

        {/* Initial State */}
        {!isSearching && !hasSearched && (
          <View style={styles.initialState}>
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <MaterialIcons name="lightbulb" size={24} color="#F59E0B" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Search Tips</Text>
                <Text style={styles.tipText}>
                  • Use specific keywords like "pothole", "bin", or "light"{'\n'}
                  • Describe the problem, not the location{'\n'}
                  • Try different words if you don't find a match
                </Text>
              </View>
            </View>

            <SlideIn delay={200}>
              <View style={styles.examplesSection}>
                <Text style={styles.examplesTitle}>Popular Searches</Text>
                <View style={styles.examplesGrid}>
                  {[
                    { icon: 'edit-road', text: 'Pothole', color: '#3B82F6' },
                    { icon: 'delete', text: 'Bin collection', color: '#059669' },
                    { icon: 'lightbulb', text: 'Street light', color: '#F59E0B' },
                    { icon: 'park', text: 'Overgrown', color: '#10B981' },
                    { icon: 'brush', text: 'Graffiti', color: '#DB2777' },
                    { icon: 'water-drop', text: 'Flooding', color: '#0EA5E9' },
                    { icon: 'home', text: 'Housing', color: '#8B5CF6' },
                    { icon: 'volume-up', text: 'Noise', color: '#9333EA' },
                    { icon: 'local-parking', text: 'Parking', color: '#EA580C' },
                    { icon: 'directions-car', text: 'Abandoned vehicle', color: '#DC2626' },
                    { icon: 'pets', text: 'Dog fouling', color: '#92400E' },
                    { icon: 'hiking', text: 'Broken pavement', color: '#64748B' },
                    { icon: 'traffic', text: 'Traffic lights', color: '#EF4444' },
                    { icon: 'sports-cricket', text: 'Tree issues', color: '#16A34A' },
                  ].map((example, index) => (
                    <FadeIn key={index} delay={300 + index * 50}>
                      <ScalePress onPress={() => setSearchQuery(example.text)}>
                        <View style={styles.exampleChip}>
                          <MaterialIcons name={example.icon as any} size={16} color={example.color} />
                          <Text style={styles.exampleText}>{example.text}</Text>
                        </View>
                      </ScalePress>
                    </FadeIn>
                  ))}
                </View>
              </View>
            </SlideIn>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Info Banner */}
      <View style={styles.bottomBanner}>
        <MaterialIcons name="info" size={20} color="#5B7CFA" />
        <Text style={styles.bannerText}>
          Selecting the right category ensures faster response times
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 1,
  },
  title: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },

  // Search Container
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    padding: 0,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Loading State
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },

  // Results
  resultsContainer: {
    marginTop: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultsCount: {
    backgroundColor: '#5B7CFA',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  resultIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 18,
  },
  departmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  departmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  departmentName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  dividerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
  },
  departmentHead: {
    fontSize: 11,
    color: '#6B7280',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Initial State
  initialState: {
    paddingTop: 8,
  },
  tipCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 24,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  examplesSection: {
    marginTop: 8,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  exampleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },

  // Bottom Banner
  bottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#DBEAFE',
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: '#5B7CFA',
    fontWeight: '500',
  },
});

export default IssueSearchScreen;
