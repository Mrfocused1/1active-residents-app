import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';
import {
  formatReportTime,
  getStatusLabel,
  getStatusColor,
} from '../services/fixmystreet.service';
import { AggregatedReport } from '../services/dataAggregator.service';
import apiService from '../services/api.service';
import { cleanReportTitle, getShortSummary } from '../utils/titleUtils';
import { useCouncilData } from '../hooks/useCouncilData';
import { RefreshButton } from '../components/RefreshButton';

interface AllReportsScreenProps {
  council?: string;
  showMyReports?: boolean;
  onBack?: () => void;
  onHome?: () => void;
  onStartReport?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
  onViewMap?: () => void;
  onReportPress?: (reportId: string) => void;
  onSort?: () => void;
  onLoadMore?: () => void;
}

type SortOption = 'newest' | 'oldest' | 'status' | 'location';

const AllReportsScreen: React.FC<AllReportsScreenProps> = ({
  council = 'Camden',
  showMyReports = false,
  onBack,
  onHome,
  onStartReport,
  onCouncilUpdate,
  onProfile,
  onViewMap,
  onReportPress,
  onSort,
  onLoadMore
}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [myReportsData, setMyReportsData] = useState<any[]>([]);
  const [myReportsLoading, setMyReportsLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortModal, setShowSortModal] = useState(false);

  // Use cached council data (only when not showing personal reports)
  const { data: councilData, loading: councilLoading, lastUpdated, refresh } = useCouncilData(
    showMyReports ? '' : council,
    {
      includeReports: true,
      includeNews: false,
      includeUpdates: false,
      maxReports: 50,
    }
  );

  const filters = ['All', 'Open', 'Fixed', 'In Progress'];

  const sortOptions = [
    { value: 'newest' as SortOption, label: 'Newest First', icon: 'schedule' },
    { value: 'oldest' as SortOption, label: 'Oldest First', icon: 'history' },
    { value: 'status' as SortOption, label: 'Status', icon: 'sort' },
    { value: 'location' as SortOption, label: 'Location', icon: 'place' },
  ];

  // Load personal reports when in showMyReports mode
  useEffect(() => {
    if (showMyReports) {
      loadMyReports();
    }
  }, [showMyReports]);

  const loadMyReports = async () => {
    try {
      setMyReportsLoading(true);
      const response = await apiService.getReports({ myReports: true });
      const transformedReports = (response.data || []).map((report: any) => ({
        id: report.id,
        title: cleanReportTitle(report.title),
        category: report.category,
        status: report.status || 'open',
        date: report.createdAt,
        location: report.location,
      }));
      setMyReportsData(transformedReports);
    } catch (error) {
      console.warn('Error loading my reports:', error);
    } finally {
      setMyReportsLoading(false);
    }
  };

  const getIconForCategory = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Potholes': 'warning',
      'Road Defect': 'warning',
      'Street Lights': 'lightbulb',
      'Bins': 'delete-outline',
      'Other tree issue': 'park',
      'Faded': 'edit-road',
    };
    return categoryMap[category] || 'report-problem';
  };

  // Transform and filter reports
  const allReports = useMemo(() => {
    let transformedReports: any[] = [];

    if (showMyReports) {
      transformedReports = myReportsData;
    } else if (councilData?.reports) {
      transformedReports = councilData.reports.map((report: AggregatedReport) => ({
        id: report.id,
        title: cleanReportTitle(report.title),
        location: getShortSummary(report.description, 50) || report.category || 'Location not specified',
        time: formatReportTime(report.date),
        status: getStatusLabel(report.status),
        statusColor: getStatusColor(report.status),
        borderColor: getStatusColor(report.status),
        hasImage: false,
        icon: getIconForCategory(report.category),
        rawData: report,
      }));
    }

    // Apply client-side filtering
    if (selectedFilter === 'Open') {
      return transformedReports.filter(r => r.status === 'Received' || r.status === 'In Progress');
    } else if (selectedFilter === 'Fixed') {
      return transformedReports.filter(r => r.status === 'Fixed' || r.status === 'Closed');
    } else if (selectedFilter === 'In Progress') {
      return transformedReports.filter(r => r.status === 'In Progress');
    }

    return transformedReports;
  }, [showMyReports, myReportsData, councilData?.reports, selectedFilter]);

  // Sort reports
  const sortedReports = useMemo(() => {
    const sorted = [...allReports].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return 0;
        case 'oldest':
          return 0;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    if (sortOption === 'oldest') {
      sorted.reverse();
    }

    return sorted;
  }, [allReports, sortOption]);

  const loading = showMyReports ? myReportsLoading : councilLoading;

  const handleSortSelect = (option: SortOption) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const getSortLabel = (): string => {
    const option = sortOptions.find(opt => opt.value === sortOption);
    return option?.label || 'Newest First';
  };

  const handleRefresh = () => {
    if (showMyReports) {
      loadMyReports();
    } else {
      refresh();
    }
  };

  const mockReports = [
    {
      id: '1',
      title: 'Deep Pothole',
      location: 'High Street, London',
      time: 'Reported 2 days ago',
      status: 'In Progress',
      statusColor: '#FFD572',
      borderColor: '#FFD572',
      hasImage: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdge0wMvbT2UQAHxTIq7e-syzYZ9CbxPapKop2EbqG0cVMfO1tgtndyBbDXCJ6rXy8cdLs-7jxXra8Ty6clhqI29CUgR5fx1FouPdgKqEIBWkw_TY8oIGRoRvmegUudqs7IrBKzetk5l9Vfzrt8SK2rSui6vCOF_WfzQhAQhJ2ucMG3JRh6CZpZV37i5wDT3W9yyX9DT62ULg8SgyDyWf-GhlciH4jJVQzQsvKrUUWkVP7ISlv_XNzh70cAda-f9k9wjiVNFP5geg',
    },
    {
      id: '2',
      title: 'Missed Bin Collection',
      location: '14 Oak Avenue',
      time: 'Reported 5 mins ago',
      status: 'Received',
      statusColor: '#9CA3AF',
      borderColor: '#D1D5DB',
      hasImage: false,
      icon: 'delete-outline',
    },
    {
      id: '3',
      title: 'Broken Streetlamp',
      location: 'Park Lane Corner',
      time: 'Resolved yesterday',
      status: 'Fixed',
      statusColor: '#4DB6AC',
      borderColor: '#4DB6AC',
      hasImage: false,
      icon: 'check',
    },
    {
      id: '4',
      title: 'Graffiti on Wall',
      location: 'Community Centre',
      time: 'Updated 3 hours ago',
      status: 'Action Required',
      statusColor: '#FF8C66',
      borderColor: '#FF8C66',
      hasImage: false,
      icon: 'warning-amber',
    },
    {
      id: '5',
      title: 'Overgrown Hedge',
      location: '56 Elm Street',
      time: 'Reported last week',
      status: 'Received',
      statusColor: '#9CA3AF',
      borderColor: '#D1D5DB',
      hasImage: false,
      icon: 'nature-people',
      opacity: 0.8,
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
        <FadeIn delay={100}>
          <View style={styles.header}>
            <ScalePress style={styles.headerButton} onPress={onBack}>
              <MaterialIcons name="arrow-back" size={24} color="#64748B" />
            </ScalePress>
            <Text style={styles.headerTitle}>{showMyReports ? 'My Reports' : 'All Recent Reports'}</Text>
            <View style={styles.headerRight}>
              <RefreshButton
                lastUpdated={lastUpdated}
                isRefreshing={loading}
                onRefresh={handleRefresh}
                compact
              />
              <ScalePress
                style={styles.headerButton}
                onPress={() => {
                  console.log('Map button pressed!');
                  onViewMap?.();
                }}
              >
                <MaterialIcons name="map" size={24} color="#5B7CFA" />
              </ScalePress>
            </View>
          </View>
        </FadeIn>

        {/* Filter Buttons */}
        <SlideIn delay={200} from="left" distance={30}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
            style={styles.filterScrollView}
          >
            {filters.map((filter, index) => (
              <FadeIn key={filter} delay={300 + index * 50}>
                <ScalePress
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  {filter === 'All' && <MaterialIcons name="filter-list" size={16} color="#FFFFFF" />}
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === filter && styles.filterButtonTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </ScalePress>
              </FadeIn>
            ))}
          </ScrollView>
        </SlideIn>

        {/* Sort Header */}
        {!loading && (
          <View style={styles.sortHeader}>
            <Text style={styles.resultCount}>
              Showing {sortedReports.length} reports from {council}
            </Text>
            <TouchableOpacity
              style={styles.sortButton}
              activeOpacity={0.8}
              onPress={() => setShowSortModal(true)}
            >
              <Text style={styles.sortButtonText}>Sort by: {getSortLabel()}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color="#5B7CFA" />
            </TouchableOpacity>
          </View>
        )}

        {/* Reports List */}
        <View style={styles.reportsList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5B7CFA" />
              <Text style={styles.loadingText}>Loading reports from {council} Council...</Text>
            </View>
          ) : sortedReports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No reports found</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'All'
                  ? `No reports available from ${council} Council`
                  : `No ${selectedFilter.toLowerCase()} reports found`}
              </Text>
            </View>
          ) : (
            sortedReports.map((report, index) => (
            <SlideIn key={report.id} delay={500 + index * 100} from="bottom" distance={20}>
              <ScalePress
                style={[styles.reportCard, report.opacity && { opacity: report.opacity }]}
                onPress={() => onReportPress?.(report.id)}
              >
              {/* Status border */}
              <View style={[styles.reportBorder, { backgroundColor: report.borderColor }]} />

              {/* Icon/Image */}
              <View style={styles.reportIconContainer}>
                {report.hasImage ? (
                  <Image
                    source={{ uri: report.image }}
                    style={styles.reportImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.reportIconBg,
                      report.status === 'Fixed' && { backgroundColor: 'rgba(77, 182, 172, 0.1)' },
                      report.status === 'Action Required' && {
                        backgroundColor: 'rgba(255, 140, 102, 0.1)',
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={report.icon as any}
                      size={24}
                      color={
                        report.status === 'Fixed'
                          ? '#4DB6AC'
                          : report.status === 'Action Required'
                          ? '#FF8C66'
                          : '#9CA3AF'
                      }
                    />
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.reportContent}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          report.status === 'In Progress'
                            ? 'rgba(255, 213, 114, 0.1)'
                            : report.status === 'Fixed'
                            ? 'rgba(77, 182, 172, 0.1)'
                            : report.status === 'Action Required'
                            ? 'rgba(255, 140, 102, 0.1)'
                            : '#F3F4F6',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        {
                          color:
                            report.status === 'In Progress'
                              ? '#FFD572'
                              : report.status === 'Fixed'
                              ? '#4DB6AC'
                              : report.status === 'Action Required'
                              ? '#FF8C66'
                              : '#9CA3AF',
                        },
                      ]}
                    >
                      {report.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reportLocation}>{report.location}</Text>
                <Text style={styles.reportTime}>{report.time}</Text>
              </View>

              {/* Chevron */}
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
              </ScalePress>
            </SlideIn>
          ))
          )}
        </View>

        {/* Load More Button */}
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton} activeOpacity={0.8} onPress={onLoadMore}>
            <Text style={styles.loadMoreText}>Load more reports</Text>
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
            <MaterialIcons name="chat-bubble-outline" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Updates</Text>
          </TouchableOpacity>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <TouchableOpacity style={styles.navFab} activeOpacity={0.9} onPress={onStartReport}>
              <MaterialIcons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <MaterialIcons name="history" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>History</Text>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
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
    flex: 1,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 24,
    fontWeight: '700',
    color: '#333344',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
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

  // Reports List
  reportsList: {
    gap: 16,
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reportBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reportImage: {
    width: 48,
    height: 48,
    opacity: 0.8,
  },
  reportIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportContent: {
    flex: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reportLocation: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  reportTime: {
    fontSize: 10,
    color: '#D1D5DB',
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

export default AllReportsScreen;
