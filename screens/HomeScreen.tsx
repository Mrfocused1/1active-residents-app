import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';
import {
  formatReportTime,
  getStatusLabel,
  getStatusColor,
  hasFixMyStreetAPI,
} from '../services/fixmystreet.service';
import { AggregatedReport, AggregatedNews, CouncilData } from '../services/dataAggregator.service';
import { CouncilInfoCard } from '../components/CouncilInfoCard';
import CouncilsService from '../services/councils.service';
import { useCouncilData } from '../hooks/useCouncilData';
import { RefreshButton } from '../components/RefreshButton';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  userName?: string;
  council?: string;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onCouncilUpdate?: () => void;
  onMyImpact?: () => void;
  onNotifications?: () => void;
  onProfile?: () => void;
  onViewMap?: () => void;
  onReportPress?: (reportId: string, reportData?: any) => void;
  onNewsPress?: (newsData: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'User',
  council = 'Camden',
  onStartReport,
  onSeeAll,
  onCouncilUpdate,
  onMyImpact,
  onNotifications,
  onProfile,
  onViewMap,
  onReportPress,
  onNewsPress
}) => {
  // Use cached council data
  const { data: councilData, loading, lastUpdated, refresh } = useCouncilData(council, {
    includeReports: true,
    includeNews: true,
    includeUpdates: true,
    includeDepartments: true,
    maxReports: 3,
    maxNews: 5,
  });

  const formatNewsDate = (dateString: string): string => {
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

  // Transform reports to UI format
  const recentReports = useMemo(() => {
    if (!councilData?.reports) return [];
    return councilData.reports.map((report: AggregatedReport) => ({
      id: report.id,
      title: report.title,
      location: report.description || report.title,
      time: formatReportTime(report.date),
      status: getStatusLabel(report.status),
      statusColor: getStatusColor(report.status),
      borderColor: getStatusColor(report.status),
      hasImage: false,
      icon: getIconForCategory(report.category),
      rawData: report,
    }));
  }, [councilData?.reports]);

  // Get council news
  const councilNews = councilData?.news || [];

  // Get latest update
  const councilUpdate = councilData?.updates?.[0]?.title || null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <FadeIn delay={100} duration={500}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.nameText} numberOfLines={1}>Hi, {userName?.split(' ')[0] || 'there'}!</Text>
            </View>
            <View style={styles.headerRight}>
              <RefreshButton
                lastUpdated={lastUpdated}
                isRefreshing={loading}
                onRefresh={refresh}
              />
              <ScalePress onPress={onNotifications}>
                <View style={styles.notificationButton}>
                  <MaterialIcons name="notifications-none" size={24} color="#64748B" />
                </View>
              </ScalePress>
            </View>
          </View>
        </FadeIn>

        {/* Report an Issue CTA */}
        <SlideIn delay={200} from="bottom" distance={30}>
          <ScalePress style={styles.ctaWrapper} scaleValue={0.98} onPress={onStartReport}>
            <LinearGradient
              colors={['#5B7CFA', '#3c5ce0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              {/* Decorative blobs */}
              <View style={styles.ctaBlob1} />
              <View style={styles.ctaBlob2} />

              {/* Background icon */}
              <View style={styles.ctaBgIcon}>
                <MaterialIcons name="add-location-alt" size={80} color="rgba(255, 255, 255, 0.2)" />
              </View>

              <View style={styles.ctaContent}>
                <View style={styles.ctaIconContainer}>
                  <MaterialIcons name="campaign" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.ctaTitle}>Report an Issue</Text>
                <Text style={styles.ctaDescription}>
                  Pothole? Graffiti? Fly-tipping?{'\n'}Let the council know instantly.
                </Text>
                <View style={styles.ctaButtonInner}>
                  <Text style={styles.ctaButtonText}>Start Report</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>
          </ScalePress>
        </SlideIn>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsGrid}>
          <SlideIn delay={300} from="left" distance={40}>
            <ScalePress style={styles.quickActionCard} onPress={onViewMap}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(255, 140, 102, 0.1)' }]}>
                <MaterialIcons name="map" size={24} color="#FF8C66" />
              </View>
              <Text style={styles.quickActionTitle}>View Map</Text>
              <Text style={styles.quickActionSubtitle}>See local reports</Text>
            </ScalePress>
          </SlideIn>

          <SlideIn delay={400} from="right" distance={40}>
            <ScalePress style={styles.quickActionCard} onPress={onMyImpact}>
              <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(77, 182, 172, 0.1)' }]}>
                <MaterialIcons name="verified" size={24} color="#4DB6AC" />
              </View>
              <Text style={styles.quickActionTitle}>My Impact</Text>
              <Text style={styles.quickActionSubtitle}>Issues you fixed</Text>
            </ScalePress>
          </SlideIn>
        </View>

        {/* Council Leadership Info */}
        {!loading && councilData?.departments && (
          <SlideIn delay={450} from="bottom" distance={20}>
            <CouncilInfoCard departmentInfo={councilData.departments} compact />
          </SlideIn>
        )}

        {/* Recent Reports Section */}
        <FadeIn delay={500}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={onSeeAll}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
        </FadeIn>

        {/* Reports List */}
        <View style={styles.reportsList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5B7CFA" />
              <Text style={styles.loadingText}>Loading data from {council} Council...</Text>
            </View>
          ) : recentReports.length === 0 && councilNews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No recent reports or news available</Text>
              {!hasFixMyStreetAPI(council) && (
                <Text style={styles.emptySubtext}>Live reports are available for Camden, Westminster, Islington, Hackney, Bromley, Southwark, Buckinghamshire, Oxfordshire, and West Northamptonshire. News data is available for all UK councils.</Text>
              )}
            </View>
          ) : recentReports.length === 0 && councilNews.length > 0 ? (
            <>
              <Text style={styles.newsHeader}>Latest News from {council}</Text>
              {councilNews.slice(0, 3).map((newsItem, index) => (
                <SlideIn key={newsItem.id} delay={600 + index * 100} from="bottom" distance={20}>
                  <ScalePress
                    style={styles.newsCard}
                    onPress={() => {
                      if (onNewsPress) {
                        const newsData = {
                          id: newsItem.id,
                          category: 'News',
                          categoryColor: '#5B7CFA',
                          title: newsItem.title,
                          description: newsItem.summary,
                          summary: newsItem.summary,
                          time: formatNewsDate(newsItem.date),
                          date: newsItem.date,
                          icon: 'article',
                          hasImage: !!newsItem.imageUrl,
                          imageUrl: newsItem.imageUrl,
                          source: newsItem.source,
                          url: newsItem.url,
                          aiSummary: newsItem.aiSummary,
                        };
                        onNewsPress(newsData);
                      }
                    }}
                  >
                    <View style={[styles.reportBorder, { backgroundColor: '#5B7CFA' }]} />

                    <View style={styles.reportIconContainer}>
                      <View style={[styles.reportIconBg, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                        <MaterialIcons name="article" size={24} color="#5B7CFA" />
                      </View>
                    </View>

                    <View style={styles.reportContent}>
                      <View style={styles.reportHeader}>
                        <Text style={styles.reportTitle} numberOfLines={2}>{newsItem.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: 'rgba(91, 124, 250, 0.1)' }]}>
                          <Text style={[styles.statusBadgeText, { color: '#5B7CFA' }]}>News</Text>
                        </View>
                      </View>
                      <Text style={styles.reportLocation} numberOfLines={2}>
                        {newsItem.aiSummary?.summary || newsItem.summary}
                      </Text>
                      <View style={styles.reportFooter}>
                        <View style={styles.reportTime}>
                          <MaterialIcons name="schedule" size={14} color="#9CA3AF" />
                          <Text style={styles.reportTimeText}>{formatNewsDate(newsItem.date)}</Text>
                        </View>
                        {newsItem.aiSummary && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <MaterialIcons name="auto-awesome" size={12} color="#6366F1" />
                            <Text style={[styles.reportSource, { color: '#6366F1' }]}>AI Summary</Text>
                          </View>
                        )}
                        {!newsItem.aiSummary && (
                          <Text style={styles.reportSource}>{newsItem.source}</Text>
                        )}
                      </View>
                    </View>
                  </ScalePress>
                </SlideIn>
              ))}
            </>
          ) : (
            recentReports.map((report, index) => (
            <SlideIn key={report.id} delay={600 + index * 100} from="bottom" distance={20}>
              <ScalePress
                style={[styles.reportCard, { opacity: report.status === 'Fixed' ? 0.7 : 1 }]}
                onPress={() => onReportPress?.(report.id, report.rawData)}
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
                    ]}
                  >
                    <MaterialIcons
                      name={report.icon as any}
                      size={24}
                      color={report.status === 'Fixed' ? '#4DB6AC' : '#9CA3AF'}
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

        {/* Council Update Banner */}
        {councilUpdate && (
          <SlideIn delay={900} from="bottom" distance={30}>
            <ScalePress scaleValue={0.98} onPress={onCouncilUpdate}>
              <LinearGradient
                colors={['#7E8CE0', '#5B7CFA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.councilUpdateBanner}
              >
                {/* Decorative blob */}
                <View style={styles.bannerBlob} />

                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>Recently Resolved</Text>
                  <Text style={styles.bannerText}>
                    {councilUpdate}
                  </Text>
                </View>

                <View style={styles.bannerButton}>
                  <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </ScalePress>
          </SlideIn>
        )}

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <MaterialIcons name="home" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  welcomeText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  nameText: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 22,
    fontWeight: '700',
    color: '#333344',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // CTA Button
  ctaWrapper: {
    marginBottom: 32,
  },
  ctaButton: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaBlob1: {
    position: 'absolute',
    right: -16,
    top: -16,
    width: 128,
    height: 128,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 64,
  },
  ctaBlob2: {
    position: 'absolute',
    right: 40,
    bottom: 0,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderRadius: 48,
  },
  ctaBgIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    transform: [{ rotate: '12deg' }],
  },
  ctaContent: {
    position: 'relative',
    zIndex: 10,
  },
  ctaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  ctaTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ctaDescription: {
    fontSize: 14,
    color: '#BFDBFE',
    lineHeight: 20,
    marginBottom: 16,
  },
  ctaButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 16,
    fontWeight: '600',
    color: '#333344',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 20,
    fontWeight: '700',
    color: '#333344',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B7CFA',
  },

  // Reports List
  reportsList: {
    gap: 16,
    marginBottom: 32,
  },
  loadingContainer: {
    padding: 40,
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
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
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

  // Council Update Banner
  councilUpdateBanner: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#7E8CE0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerBlob: {
    position: 'absolute',
    left: -24,
    bottom: -40,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 48,
  },
  bannerContent: {
    flex: 1,
    zIndex: 10,
  },
  bannerTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: '#BFDBFE',
    lineHeight: 20,
  },
  bannerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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

  // News Styles
  newsHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reportSource: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reportTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportTimeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});

export default HomeScreen;
