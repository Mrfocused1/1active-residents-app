import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';
import { getCouncilData, AggregatedNews } from '../services/dataAggregator.service';
import CouncilsService from '../services/councils.service';

interface AllUpdatesScreenProps {
  council?: string;
  onBack?: () => void;
  onHome?: () => void;
  onStartReport?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
  onSort?: () => void;
  onLoadMore?: () => void;
  onUpdatePress?: (updateData: any) => void;
  onHistory?: () => void;
}

type SortOption = 'newest' | 'oldest' | 'category';

const AllUpdatesScreen: React.FC<AllUpdatesScreenProps> = ({
  council = 'Camden',
  onBack,
  onHome,
  onStartReport,
  onCouncilUpdate,
  onProfile,
  onSort,
  onLoadMore,
  onUpdatePress,
  onHistory,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortedUpdates, setSortedUpdates] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [allUpdatesData, setAllUpdatesData] = useState<any[]>([]);

  const filters = [
    'All',
    'Alert',
    'News',
    'Council Updates',
    'Roadworks',
    'Events',
    'Services',
    'Community',
    'Environment'
  ];

  const sortOptions = [
    { value: 'newest' as SortOption, label: 'Newest First', icon: 'schedule' },
    { value: 'oldest' as SortOption, label: 'Oldest First', icon: 'history' },
    { value: 'category' as SortOption, label: 'Category', icon: 'category' },
  ];

  // Fetch council-specific news on mount and when council changes
  useEffect(() => {
    fetchCouncilNews();
  }, [council]);

  const fetchCouncilNews = async () => {
    try {
      setLoadingNews(true);

      // Fetch council-specific news from our data aggregator
      const councilData = await getCouncilData(council, {
        includeReports: false, // Don't need reports in news feed
        includeNews: true,
        includeUpdates: false,
        maxNews: 20,
      });

      // Transform the news into updates format
      const updates = councilData.news.map((news, index) => ({
        id: news.id,
        category: 'News',
        categoryColor: getCategoryColor('News'),
        title: news.title,
        description: news.summary,
        time: formatDate(news.date),
        timestamp: new Date(news.date).getTime(),
        icon: getCategoryIcon('News'),
        hasImage: !!news.imageUrl,
        image: news.imageUrl,
        source: news.source,
        url: news.url,
      }));

      setAllUpdatesData(updates);
    } catch (error) {
      console.error('Error fetching council news:', error);
      setAllUpdatesData([]);
    } finally {
      setLoadingNews(false);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Alert': '#EF4444',
      'News': '#FF8C66',
      'Council Updates': '#5B7CFA',
      'service': '#7E8CE0',
      'policy': '#9C27B0',
      'infrastructure': '#FF6B6B',
      'Roadworks': '#FF8C66',
      'Events': '#9C27B0',
      'Community': '#4DB6AC',
      'Services': '#7E8CE0',
      'Environment': '#34D399',
      'Initiative': '#FFD572',
    };
    return colors[category] || '#9CA3AF';
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Alert': 'warning',
      'News': 'article',
      'Council Updates': 'campaign',
      'service': 'settings',
      'policy': 'gavel',
      'infrastructure': 'foundation',
      'Roadworks': 'construction',
      'Events': 'event',
      'Community': 'groups',
      'Services': 'room-service',
      'Environment': 'eco',
      'Initiative': 'lightbulb',
    };
    return icons[category] || 'info';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };


  const getFilteredUpdates = () => {
    if (selectedFilter === 'All') {
      return allUpdatesData;
    }
    return allUpdatesData.filter(update => update.category === selectedFilter);
  };

  // Sort filtered updates when sort option or filter changes
  useEffect(() => {
    sortUpdates();
  }, [sortOption, allUpdatesData, selectedFilter]);

  const sortUpdates = () => {
    const filtered = getFilteredUpdates();
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return b.timestamp - a.timestamp; // Newest first (descending)
        case 'oldest':
          return a.timestamp - b.timestamp; // Oldest first (ascending)
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setSortedUpdates(sorted);
  };

  const handleSortSelect = (option: SortOption) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const getSortLabel = (): string => {
    const option = sortOptions.find(opt => opt.value === sortOption);
    return option?.label || 'Newest First';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeIn delay={100}>
          <View style={styles.header}>
            <ScalePress onPress={onBack}>
              <View style={styles.headerButton}>
                <MaterialIcons name="arrow-back" size={24} color="#64748B" />
              </View>
            </ScalePress>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>{council} Updates</Text>
              {loadingNews && (
                <Text style={styles.headerSubtitle}>Fetching latest news...</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={fetchCouncilNews}
              disabled={loadingNews}
            >
              {loadingNews ? (
                <ActivityIndicator size="small" color="#5B7CFA" />
              ) : (
                <MaterialIcons name="refresh" size={24} color="#5B7CFA" />
              )}
            </TouchableOpacity>
          </View>
        </FadeIn>

        {/* Filter Buttons */}
        <SlideIn delay={200}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
            style={styles.filterScrollView}
          >
            {filters.map((filter, index) => (
              <FadeIn key={filter} delay={300 + index * 50}>
                <ScalePress onPress={() => setSelectedFilter(filter)}>
                  <View
                    style={[
                      styles.filterButton,
                      selectedFilter === filter && styles.filterButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === filter && styles.filterButtonTextActive,
                      ]}
                    >
                      {filter}
                    </Text>
                  </View>
                </ScalePress>
              </FadeIn>
            ))}
          </ScrollView>
        </SlideIn>

        {/* Sort Header */}
        <View style={styles.sortHeader}>
          <Text style={styles.resultCount}>Showing {sortedUpdates.length} updates</Text>
          <TouchableOpacity
            style={styles.sortButton}
            activeOpacity={0.8}
            onPress={() => setShowSortModal(true)}
          >
            <Text style={styles.sortButtonText}>Sort by: {getSortLabel()}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="#5B7CFA" />
          </TouchableOpacity>
        </View>

        {/* Updates List */}
        <View style={styles.updatesList}>
          {loadingNews ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5B7CFA" />
              <Text style={styles.loadingText}>
                Loading {council} Council news...
              </Text>
            </View>
          ) : sortedUpdates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No updates found</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'All'
                  ? `No recent news or updates available for ${council} Council`
                  : `No ${selectedFilter.toLowerCase()} updates found`}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchCouncilNews}
              >
                <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            sortedUpdates.map((update, index) => (
            <SlideIn key={update.id} delay={500 + index * 100} from="bottom" distance={20}>
              <ScalePress onPress={() => onUpdatePress?.(update)}>
                <View style={styles.updateCard}>
                  {/* Icon/Image */}
                  <View style={styles.updateIconContainer}>
                    {update.hasImage ? (
                      <View style={styles.updateImageWrapper}>
                        <Image
                          source={{ uri: update.image }}
                          style={styles.updateImage}
                          resizeMode="cover"
                        />
                        <View style={[styles.updateImageOverlay, { backgroundColor: `${update.categoryColor}1A` }]} />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.updateIconBg,
                          { backgroundColor: `${update.categoryColor}1A` },
                        ]}
                      >
                        <MaterialIcons name={update.icon as any} size={32} color={update.categoryColor} />
                      </View>
                    )}
                  </View>

                  {/* Content */}
                  <View style={styles.updateContent}>
                    <View style={styles.updateHeader}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: `${update.categoryColor}1A` },
                        ]}
                      >
                        <Text style={[styles.categoryBadgeText, { color: update.categoryColor }]}>
                          {update.category.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.updateTime}>{update.time}</Text>
                    </View>
                    <Text style={styles.updateTitle} numberOfLines={1}>
                      {update.title}
                    </Text>
                    <Text style={styles.updateDescription} numberOfLines={2}>
                      {update.description}
                    </Text>
                  </View>

                  {/* Chevron */}
                  <View style={styles.updateChevron}>
                    <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                  </View>
                </View>
              </ScalePress>
            </SlideIn>
          ))
          )}
        </View>

        {/* Load More Button */}
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton} activeOpacity={0.8} onPress={onLoadMore}>
            <Text style={styles.loadMoreText}>Load more updates</Text>
            <MaterialIcons name="expand-more" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={onHome || onBack} activeOpacity={0.8}>
            <MaterialIcons name="home" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onCouncilUpdate}>
            <MaterialIcons name="chat-bubble-outline" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Updates</Text>
          </TouchableOpacity>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <TouchableOpacity style={styles.navFab} activeOpacity={0.9} onPress={onStartReport}>
              <MaterialIcons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onHistory}>
            <MaterialIcons name="history" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onProfile}>
            <MaterialIcons name="person-outline" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptions}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    sortOption === option.value && styles.modalOptionActive,
                  ]}
                  onPress={() => handleSortSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalOptionLeft}>
                    <View
                      style={[
                        styles.modalOptionIcon,
                        sortOption === option.value && styles.modalOptionIconActive,
                      ]}
                    >
                      <MaterialIcons
                        name={option.icon as any}
                        size={20}
                        color={sortOption === option.value ? '#5B7CFA' : '#9CA3AF'}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        sortOption === option.value && styles.modalOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  {sortOption === option.value && (
                    <MaterialIcons name="check" size={24} color="#5B7CFA" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 24,
    fontWeight: '700',
    color: '#333344',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Filter Buttons
  filterScrollView: {
    marginBottom: 24,
  },
  filterContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  // Sort Header
  sortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B7CFA',
  },

  // Updates List
  updatesList: {
    gap: 16,
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#5B7CFA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  updateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  updateImageWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  updateImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  updateImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  updateIconBg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateContent: {
    flex: 1,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  updateTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  updateTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 16,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  updateChevron: {
    justifyContent: 'center',
  },

  // Load More
  loadMoreContainer: {
    paddingTop: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
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

  // Sort Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalOptions: {
    gap: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modalOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#5B7CFA',
  },
  modalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionIconActive: {
    backgroundColor: '#DBEAFE',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalOptionTextActive: {
    color: '#5B7CFA',
    fontWeight: '700',
  },
});

export default AllUpdatesScreen;
