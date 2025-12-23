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

interface SearchScreenProps {
  onBack?: () => void;
  onReportPress?: (reportId: string) => void;
  onArticlePress?: (articleId: string) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({
  onBack,
  onReportPress,
  onArticlePress,
}) => {
  const [searchQuery, setSearchQuery] = useState('Waste');

  const recentSearches = ['Missed collection', 'Fly-tipping', 'Recycling guide'];

  const searchResults = [
    {
      id: '8821',
      title: 'Missed Bin Collection',
      location: '12 Oakwood Avenue, Westside',
      time: '2 hrs ago',
      status: 'In Progress',
      statusColor: '#FFD572',
      icon: 'delete-outline',
      iconBg: 'rgba(255, 140, 102, 0.1)',
      iconColor: '#FF8C66',
    },
    {
      id: '8755',
      title: 'Damaged Recycling Box',
      location: 'Near Central Park Entrance, High St.',
      time: '2 days ago',
      status: 'Resolved',
      statusColor: '#4DB6AC',
      icon: 'recycling',
      iconBg: 'rgba(156, 163, 175, 0.1)',
      iconColor: '#6B7280',
    },
  ];

  const helpArticles = [
    {
      id: '1',
      title: 'Understanding Waste Types',
      description:
        'Learn what items can be placed in your general waste bin and what must be taken to the recycling center.',
      icon: 'menu-book',
      iconBg: 'rgba(91, 124, 250, 0.1)',
      iconColor: '#5B7CFA',
    },
    {
      id: '2',
      title: 'Holiday Collection Schedule',
      description: 'Changes to bin collection dates during bank holidays and the festive period.',
      icon: 'calendar-today',
      iconBg: 'rgba(126, 140, 224, 0.1)',
      iconColor: '#7E8CE0',
    },
    {
      id: '3',
      title: 'How to report a missing bin',
      description:
        'Step-by-step guide on reporting lost or stolen bins and requesting a replacement.',
      icon: 'contact-support',
      iconBg: 'rgba(77, 182, 172, 0.1)',
      iconColor: '#4DB6AC',
    },
  ];

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

          <Text style={styles.headerTitle}>Search</Text>
          <Text style={styles.headerSubtitle}>Find reports, articles, and help</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Try 'Missed bin' or 'Pothole'"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.clearLink}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity key={index} style={styles.tag} activeOpacity={0.8}>
                <MaterialIcons
                  name={index === 2 ? 'trending-up' : 'history'}
                  size={16}
                  color={index === 2 ? '#5B7CFA' : '#9CA3AF'}
                />
                <Text style={styles.tagText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reported Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitleLarge}>Reported Issues</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{searchResults.length}</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultsContainer}>
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={styles.resultCard}
                onPress={() => onReportPress?.(result.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.resultIcon, { backgroundColor: result.iconBg }]}>
                  <MaterialIcons name={result.icon as any} size={24} color={result.iconColor} />
                </View>
                <View style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>{result.title}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            result.status === 'In Progress'
                              ? 'rgba(255, 213, 114, 0.1)'
                              : 'rgba(77, 182, 172, 0.1)',
                        },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: result.statusColor }]}>
                        {result.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.resultLocation}>{result.location}</Text>
                  <View style={styles.resultMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={14} color="#9CA3AF" />
                      <Text style={styles.metaText}>{result.time}</Text>
                    </View>
                    <View style={styles.metaDot} />
                    <Text style={styles.metaText}>Ref #{result.id}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Help Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleLarge}>Help Articles</Text>

          <View style={styles.articlesContainer}>
            {helpArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => onArticlePress?.(article.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.articleIcon, { backgroundColor: article.iconBg }]}>
                  <MaterialIcons name={article.icon as any} size={18} color={article.iconColor} />
                </View>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleDescription} numberOfLines={2}>
                    {article.description}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.seeMoreButton} activeOpacity={0.8}>
            <Text style={styles.seeMoreText}>See more articles about "Waste"</Text>
          </TouchableOpacity>
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
    paddingBottom: 40,
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

  // Search Bar
  searchContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingLeft: 44,
    paddingRight: 48,
    paddingVertical: 16,
    fontSize: 14,
    color: '#333344',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
    borderRadius: 20,
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleLarge: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 20,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 16,
    paddingLeft: 4,
  },
  clearLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B7CFA',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B7CFA',
  },
  badge: {
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B7CFA',
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333344',
  },

  // Results
  resultsContainer: {
    gap: 16,
  },
  resultCard: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },

  // Articles
  articlesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  articleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  seeMoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(91, 124, 250, 0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B7CFA',
  },
});

export default SearchScreen;
