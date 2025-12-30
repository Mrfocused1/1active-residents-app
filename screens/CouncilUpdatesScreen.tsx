import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';
import { AggregatedNews } from '../services/dataAggregator.service';
import CouncilsService from '../services/councils.service';
import { useCouncilData } from '../hooks/useCouncilData';
import { RefreshButton } from '../components/RefreshButton';

interface CouncilUpdatesScreenProps {
  council?: string;
  onBack?: () => void;
  onHome?: () => void;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onProfile?: () => void;
  onSeeAllUpdates?: () => void;
  onNotifications?: () => void;
  onAlertPress?: () => void;
  onUpdatePress?: (updateData: any) => void;
}

const CouncilUpdatesScreen: React.FC<CouncilUpdatesScreenProps> = ({
  council = 'Camden',
  onBack,
  onHome,
  onStartReport,
  onSeeAll,
  onProfile,
  onSeeAllUpdates,
  onNotifications,
  onAlertPress,
  onUpdatePress,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All Updates');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUpdates, setExpandedUpdates] = useState<Set<string>>(new Set());
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Use cached council data
  const { data: councilData, loading, lastUpdated, refresh } = useCouncilData(council, {
    includeReports: false,
    includeNews: true,
    includeUpdates: true,
    maxNews: 20,
  });

  const categoryColors: Record<string, string> = {
    'Roadworks': '#FF8C66',
    'Events': '#FFD572',
    'Services': '#7E8CE0',
    'Community': '#4DB6AC',
    'Environment': '#10B981',
    'Transport': '#8B5CF6',
    'Planning': '#F97316',
    'News': '#5B7CFA',
    'Update': '#4DB6AC',
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'Roadworks': 'construction',
      'Events': 'event',
      'Services': 'miscellaneous-services',
      'Community': 'people',
      'Environment': 'eco',
      'Transport': 'directions-bus',
      'Planning': 'architecture',
      'News': 'article',
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

  // Transform news and updates to UI format
  const updates = useMemo(() => {
    if (!councilData) return [];

    const combined: any[] = [];

    // Add news items
    (councilData.news || []).forEach((newsItem: AggregatedNews) => {
      combined.push({
        id: newsItem.id,
        category: newsItem.category || 'News',
        categoryColor: categoryColors[newsItem.category || 'News'] || '#5B7CFA',
        title: newsItem.title,
        description: newsItem.summary,
        summary: newsItem.summary,
        time: formatDate(newsItem.date),
        date: newsItem.date,
        icon: 'article',
        hasImage: !!newsItem.imageUrl,
        imageUrl: newsItem.imageUrl,
        source: newsItem.source,
        url: newsItem.url,
      });
    });

    // Add updates
    (councilData.updates || []).forEach((update: AggregatedNews) => {
      combined.push({
        id: update.id,
        category: update.category || 'Update',
        categoryColor: categoryColors[update.category || 'Update'] || '#4DB6AC',
        title: update.title,
        description: update.summary,
        time: formatDate(update.date),
        date: update.date,
        icon: getCategoryIcon(update.category || 'Update'),
        hasImage: !!update.imageUrl,
        imageUrl: update.imageUrl,
        url: update.url,
      });
    });

    return combined;
  }, [councilData]);

  const toggleExpand = (updateId: string) => {
    const newExpanded = new Set(expandedUpdates);
    if (newExpanded.has(updateId)) {
      newExpanded.delete(updateId);
    } else {
      newExpanded.add(updateId);
    }
    setExpandedUpdates(newExpanded);
  };

  const allFilters = ['All Updates', 'Roadworks', 'Events', 'Waste & Recycling', 'Community', 'Environment', 'Transport', 'Planning'];
  const filters = showAllFilters ? allFilters : allFilters.slice(0, 4);

  // Filter updates based on selected filter
  const filteredUpdates = selectedFilter === 'All Updates'
    ? updates
    : updates.filter(update => update.category.toLowerCase().includes(selectedFilter.toLowerCase()));

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
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Council News</Text>
              <Text style={styles.headerSubtitle}>Latest updates & announcements</Text>
            </View>
            <View style={styles.headerRight}>
              <RefreshButton
                lastUpdated={lastUpdated}
                isRefreshing={loading}
                onRefresh={refresh}
                compact
              />
              <ScalePress onPress={onNotifications}>
                <View style={styles.notificationButton}>
                  <MaterialIcons name="notifications-none" size={24} color="#64748B" />
                </View>
              </ScalePress>
            </View>
          </View>
        </FadeIn>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <MaterialIcons name="search" size={20} color="#9CA3AF" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for news, events..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

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

            {/* More Button */}
            <FadeIn delay={300 + filters.length * 50}>
              <ScalePress onPress={() => setShowAllFilters(!showAllFilters)}>
                <View style={[styles.filterButton, styles.filterButtonMore]}>
                  <Text style={[styles.filterButtonText, styles.filterButtonMoreText]}>
                    {showAllFilters ? 'Less' : 'More'}
                  </Text>
                  <MaterialIcons
                    name={showAllFilters ? "expand-less" : "expand-more"}
                    size={16}
                    color="#5B7CFA"
                  />
                </View>
              </ScalePress>
            </FadeIn>
          </ScrollView>
        </SlideIn>

        {/* Important Notice - Only show if there are alerts */}
        {alerts.length > 0 && (
          <View style={styles.importantSection}>
            <View style={styles.importantHeader}>
              <MaterialIcons name="campaign" size={16} color="#FF8C66" />
              <Text style={styles.importantTitle}>Important Notice</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => {
                const alert = alerts[0];
                const alertData = {
                  id: `alert-${Date.now()}`,
                  category: 'Alert',
                  categoryColor: alert.severity === 'high' ? '#EF4444' : alert.severity === 'medium' ? '#F59E0B' : '#5B7CFA',
                  title: alert.title,
                  description: alert.description,
                  summary: alert.description,
                  time: formatDate(alert.date),
                  date: alert.date,
                  icon: 'warning',
                  hasImage: false,
                  url: alert.url,
                };
                onUpdatePress?.(alertData);
              }}
            >
              <LinearGradient
                colors={
                  alerts[0].severity === 'high'
                    ? ['#EF4444', '#DC2626']
                    : alerts[0].severity === 'medium'
                    ? ['#F59E0B', '#D97706']
                    : ['#7E8CE0', '#5B7CFA']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.alertCard}
              >
                {/* Decorative blob */}
                <View style={styles.alertBlob} />

                <View style={styles.alertContent}>
                  <View style={styles.alertTopRow}>
                    <View style={styles.alertBadge}>
                      <Text style={styles.alertBadgeText}>
                        {alerts[0].severity === 'high' ? 'URGENT' : 'ALERT'}
                      </Text>
                    </View>
                    <Text style={styles.alertTime}>{formatDate(alerts[0].date)}</Text>
                  </View>

                  <Text style={styles.alertCardTitle}>{alerts[0].title}</Text>
                  <Text style={styles.alertCardDescription} numberOfLines={3}>
                    {alerts[0].description}
                  </Text>

                  <View style={styles.readMoreButton}>
                    <Text style={styles.readMoreText}>Read More</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent Updates Section */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Updates</Text>
            <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.8} onPress={onSeeAllUpdates}>
              <Text style={styles.seeAllText}>See all</Text>
              <MaterialIcons name="chevron-right" size={14} color="#5B7CFA" />
            </TouchableOpacity>
          </View>

          <View style={styles.updatesList}>
            {loading ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#5B7CFA" />
                <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>
                  Loading updates from {council}...
                </Text>
              </View>
            ) : filteredUpdates.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialIcons name="info-outline" size={64} color="#D1D5DB" />
                <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 16, fontWeight: '600' }}>
                  No updates available
                </Text>
                <Text style={{ marginTop: 8, color: '#9CA3AF', fontSize: 14, textAlign: 'center' }}>
                  Check back later for council news and updates
                </Text>
              </View>
            ) : (
              filteredUpdates.map((update, index) => {
              const isExpanded = expandedUpdates.has(update.id);
              return (
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
                      <Text style={styles.updateDescription} numberOfLines={isExpanded ? undefined : 2}>
                        {update.description}
                      </Text>
                    </View>

                    {/* Chevron */}
                    <View style={styles.updateChevron}>
                      <MaterialIcons
                        name={isExpanded ? "expand-less" : "expand-more"}
                        size={24}
                        color="#5B7CFA"
                      />
                    </View>
                  </View>
                </ScalePress>
              </SlideIn>
            );
            }))}
          </View>
        </View>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={onHome} activeOpacity={0.8}>
            <MaterialIcons name="home" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <MaterialIcons name="chat-bubble-outline" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Updates</Text>
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
            <MaterialIcons name="person-outline" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Profile</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontWeight: '500',
    color: '#9CA3AF',
  },
  notificationButton: {
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

  // Search
  searchContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    fontSize: 14,
    color: '#333344',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },

  // Filters
  filterScrollView: {
    marginBottom: 8,
  },
  filterContainer: {
    gap: 12,
    paddingBottom: 16,
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
  filterButtonMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    borderWidth: 1,
  },
  filterButtonMoreText: {
    color: '#5B7CFA',
  },

  // Important Notice
  importantSection: {
    marginBottom: 32,
  },
  importantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  importantTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
  },
  alertCard: {
    borderRadius: 24,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#7E8CE0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  alertBlob: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 64,
  },
  alertContent: {
    position: 'relative',
    zIndex: 10,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  alertTime: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  alertCardTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  alertCardDescription: {
    fontSize: 14,
    color: '#BFDBFE',
    lineHeight: 20,
    marginBottom: 16,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Recent Updates
  recentSection: {
    marginBottom: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  recentTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 20,
    fontWeight: '700',
    color: '#333344',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B7CFA',
  },
  updatesList: {
    gap: 16,
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

export default CouncilUpdatesScreen;
