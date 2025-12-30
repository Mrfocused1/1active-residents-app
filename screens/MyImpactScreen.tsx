import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';

interface MyImpactScreenProps {
  onBack?: () => void;
  onStartReport?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
  onIssuePress?: (issueId: string) => void;
  onHistory?: () => void;
}

const MyImpactScreen: React.FC<MyImpactScreenProps> = ({ onBack, onStartReport, onCouncilUpdate, onProfile, onIssuePress, onHistory }) => {
  const [selectedFilter, setSelectedFilter] = useState('All Fixed');
  const progressBarWidth = useRef(new Animated.Value(0)).current;

  const filters = ['All Fixed', 'This Month', 'Roads', 'Environment'];

  const resolvedIssues: any[] = [];

  // Calculate progress (0% initially - will be calculated from real data)
  const progress = 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - progress);

  // Badge progress (0 out of 16 issues = 0%)
  const badgeProgress = 0;

  // Animate progress bar on mount
  useEffect(() => {
    Animated.timing(progressBarWidth, {
      toValue: badgeProgress,
      duration: 1500,
      useNativeDriver: false,
      delay: 300,
    }).start();
  }, []);

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
            <View>
              <ScalePress onPress={onBack}>
                <View style={styles.backButton}>
                  <MaterialIcons name="arrow-back" size={16} color="#64748B" />
                  <Text style={styles.backButtonText}>Back</Text>
                </View>
              </ScalePress>
              <Text style={styles.headerTitle}>My Impact</Text>
            </View>
          </View>
        </FadeIn>

        {/* Impact Summary Card */}
        <FadeIn delay={200}>
          <LinearGradient
            colors={['#5B7CFA', '#3c5ce0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.impactCard}
          >
          {/* Decorative blobs */}
          <View style={styles.impactBlob1} />
          <View style={styles.impactBlob2} />

          <View style={styles.impactContent}>
            {/* Left side - Text */}
            <View style={styles.impactText}>
              <View style={styles.championBadge}>
                <MaterialIcons name="emoji-events" size={14} color="#FFD572" />
                <Text style={styles.championText}>Community Champion</Text>
              </View>

              <View style={styles.issuesCount}>
                <Text style={styles.issuesNumber}>0</Text>
                <Text style={styles.issuesLabel}>Issues</Text>
              </View>

              <Text style={styles.issuesSubtext}>Resolved this month</Text>

              <Text style={styles.impactMessage}>
                Thanks to you, the neighborhood is safer and cleaner!
              </Text>
            </View>

            {/* Right side - Circular Progress */}
            <View style={styles.progressContainer}>
              <Svg width={112} height={112} style={styles.progressSvg}>
                {/* Background circle */}
                <Circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress circle */}
                <Circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="#FFD572"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="56, 56"
                />
              </Svg>
              <View style={styles.progressIcon}>
                <MaterialIcons name="check-circle" size={32} color="#FFFFFF" />
              </View>
            </View>
          </View>
          </LinearGradient>
        </FadeIn>

        {/* Filter Buttons */}
        <FadeIn delay={300}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
            style={styles.filterScrollView}
          >
            {filters.map((filter) => (
              <ScalePress
                key={filter}
                onPress={() => setSelectedFilter(filter)}
              >
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
            ))}
          </ScrollView>
        </FadeIn>

        {/* Resolved Issues List */}
        <View style={styles.issuesList}>
          {resolvedIssues.map((issue, index) => (
            <SlideIn key={issue.id} delay={500 + index * 100} from="bottom" distance={20}>
              <ScalePress onPress={() => onIssuePress?.(issue.id)}>
                <View style={[styles.issueCard, index === 2 && { opacity: 0.9 }]}>
              {/* Top border gradient */}
              <LinearGradient
                colors={['#4DB6AC', '#5B7CFA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.issueTopBorder}
              />

              {/* Issue Header */}
              <View style={styles.issueHeader}>
                <View style={styles.issueHeaderLeft}>
                  <View style={[styles.issueIcon, { backgroundColor: issue.iconBg }]}>
                    <MaterialIcons
                      name={issue.icon as any}
                      size={24}
                      color={issue.iconColor}
                    />
                  </View>
                  <View>
                    <Text style={styles.issueResolvedTime}>{issue.resolvedTime}</Text>
                    <Text style={styles.issueTitle}>{issue.title}</Text>
                  </View>
                </View>
                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsText}>+{issue.points} pts</Text>
                </View>
              </View>

              {/* Before/After Images */}
              <View style={styles.imagesContainer}>
                {/* Before */}
                <View style={styles.imageWrapper}>
                  {issue.hasBeforeImage ? (
                    <Image
                      source={{ uri: issue.beforeImage }}
                      style={styles.beforeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <MaterialIcons name="image" size={32} color="#9CA3AF" />
                    </View>
                  )}
                  <View style={styles.imageLabel}>
                    <Text style={styles.imageLabelText}>Before</Text>
                  </View>
                </View>

                {/* Arrow */}
                <View style={styles.arrowContainer}>
                  <MaterialIcons name="arrow-forward" size={16} color="#5B7CFA" />
                </View>

                {/* After */}
                <View style={styles.imageWrapper}>
                  <View style={styles.afterImageBg}>
                    <MaterialIcons
                      name={issue.afterIcon as any}
                      size={32}
                      color="#4DB6AC"
                    />
                  </View>
                  <View style={[styles.imageLabel, styles.imageLabelFixed]}>
                    <Text style={styles.imageLabelTextFixed}>Fixed</Text>
                  </View>
                </View>
              </View>

              {/* Timeline (for pothole) */}
              {issue.showTimeline && (
                <View style={styles.timeline}>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDotGray} />
                    <Text style={styles.timelineText}>Reported on {issue.reportedDate}</Text>
                  </View>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineDotGreen} />
                    <Text style={styles.timelineTextGreen}>Fixed on {issue.fixedDate}</Text>
                  </View>
                </View>
              )}

              {/* Issue Footer */}
              <View style={styles.issueFooter}>
                <Text style={styles.issueLocation}>{issue.location}</Text>
                <View style={styles.thankedBy}>
                  <MaterialIcons name="thumb-up" size={12} color="#9CA3AF" />
                  <Text style={styles.thankedByText}>
                    {issue.thankedBy} Neighbors thanked you
                  </Text>
                </View>
              </View>
                </View>
              </ScalePress>
            </SlideIn>
          ))}
        </View>

        {/* Badge Progress Card */}
        <FadeIn delay={800}>
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badgeCard}
          >
          <View style={styles.badgeBlob} />
          <View style={styles.badgeContent}>
            <View style={styles.badgeText}>
              <Text style={styles.badgeTitle}>Next Badge Unlocked?</Text>
              <Text style={styles.badgeSubtitle}>
                Report 3 more issues to earn the "Street Scout" badge!
              </Text>

              {/* Animated Progress Bar */}
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: progressBarWidth.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
                <View style={styles.progressBarLabels}>
                  <Text style={styles.progressBarText}>0/16 issues</Text>
                  <Text style={styles.progressBarText}>0%</Text>
                </View>
              </View>
            </View>
            <View style={styles.badgeIcon}>
              <MaterialIcons name="military-tech" size={24} color="#FFFFFF" />
            </View>
          </View>
          </LinearGradient>
        </FadeIn>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <ScalePress onPress={onBack}>
            <View style={styles.navItem}>
              <MaterialIcons name="home" size={28} color="#9CA3AF" />
              <Text style={styles.navLabel}>Home</Text>
            </View>
          </ScalePress>

          <ScalePress onPress={onCouncilUpdate}>
            <View style={styles.navItem}>
              <MaterialIcons name="chat-bubble-outline" size={28} color="#9CA3AF" />
              <Text style={styles.navLabel}>Updates</Text>
            </View>
          </ScalePress>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <ScalePress onPress={onStartReport}>
              <View style={styles.navFab}>
                <MaterialIcons name="add" size={32} color="#FFFFFF" />
              </View>
            </ScalePress>
          </View>

          <ScalePress onPress={onHistory}>
            <View style={styles.navItem}>
              <MaterialIcons name="history" size={28} color="#9CA3AF" />
              <Text style={styles.navLabel}>History</Text>
            </View>
          </ScalePress>

          <ScalePress onPress={onProfile}>
            <View style={styles.navItem}>
              <MaterialIcons name="person-outline" size={28} color="#9CA3AF" />
              <Text style={styles.navLabel}>Profile</Text>
            </View>
          </ScalePress>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: '#333344',
  },
  shareButton: {
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

  // Impact Summary Card
  impactCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  impactBlob1: {
    position: 'absolute',
    right: -16,
    top: '50%',
    transform: [{ translateY: -96 }],
    width: 192,
    height: 192,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 96,
  },
  impactBlob2: {
    position: 'absolute',
    left: '50%',
    bottom: -40,
    transform: [{ translateX: -64 }],
    width: 128,
    height: 128,
    backgroundColor: 'rgba(126, 140, 224, 0.3)',
    borderRadius: 64,
  },
  impactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    position: 'relative',
    zIndex: 10,
  },
  impactText: {
    flex: 1,
  },
  championBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  championText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  issuesCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  issuesNumber: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  issuesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  issuesSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  impactMessage: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
    maxWidth: 160,
  },
  progressContainer: {
    position: 'relative',
    width: 112,
    height: 112,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  progressIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#5B7CFA',
    borderColor: '#5B7CFA',
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

  // Issues List
  issuesList: {
    gap: 24,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  issueTopBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  // Issue Header
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  issueHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  issueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueResolvedTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  issueTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
  },
  pointsBadge: {
    backgroundColor: 'rgba(77, 182, 172, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4DB6AC',
  },

  // Before/After Images
  imagesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    position: 'relative',
  },
  imageWrapper: {
    flex: 1,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  beforeImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  afterImageBg: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(77, 182, 172, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLabel: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  imageLabelFixed: {
    backgroundColor: '#4DB6AC',
  },
  imageLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  imageLabelTextFixed: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  arrowContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },

  // Timeline
  timeline: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineDotGray: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  timelineDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4DB6AC',
  },
  timelineText: {
    fontSize: 12,
    color: '#6B7280',
  },
  timelineTextGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4DB6AC',
  },

  // Issue Footer
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  issueLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  thankedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thankedByText: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Badge Progress Card
  badgeCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeBlob: {
    position: 'absolute',
    left: -24,
    bottom: -40,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 48,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
    zIndex: 10,
  },
  badgeText: {
    flex: 1,
  },
  badgeTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badgeSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  badgeIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 12,
  },

  // Progress Bar
  progressBarContainer: {
    marginTop: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressBarText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
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

export default MyImpactScreen;
