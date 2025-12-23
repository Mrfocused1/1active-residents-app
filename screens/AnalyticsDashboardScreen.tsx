import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ApiService from '../services/api.service';

interface AnalyticsDashboardScreenProps {
  onBack: () => void;
  onFilter?: () => void;
}

const { width } = Dimensions.get('window');

const AnalyticsDashboardScreen: React.FC<AnalyticsDashboardScreenProps> = ({ onBack, onFilter }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalReports: 0,
    emailsSent: 0,
    avgResponseTime: '0 days',
    resolvedIssues: 0,
  });

  const [reportsByStatus, setReportsByStatus] = useState<Array<{
    status: string;
    count: number;
    color: string;
    percentage: number;
  }>>([]);

  const [departments, setDepartments] = useState<Array<{
    name: string;
    contacted: number;
    icon: string;
  }>>([]);

  const [emailActivity, setEmailActivity] = useState<Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
    status: string;
  }>>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeframe]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getReportStats();

      if (response.data) {
        const data = response.data;

        // Update stats
        setStats({
          totalReports: data.totalReports || 0,
          emailsSent: data.emailsSent || 0,
          avgResponseTime: data.avgResponseTime || '0 days',
          resolvedIssues: data.resolvedIssues || 0,
        });

        // Update reports by status
        if (data.reportsByStatus) {
          const total = data.reportsByStatus.reduce((sum: number, r: any) => sum + r.count, 0);
          const statusColors: Record<string, string> = {
            'Resolved': '#4DB6AC',
            'In Progress': '#FFD572',
            'Pending': '#FF8C66',
          };

          setReportsByStatus(
            data.reportsByStatus.map((r: any) => ({
              status: r.status,
              count: r.count,
              color: statusColors[r.status] || '#9CA3AF',
              percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
            }))
          );
        }

        // Update departments
        if (data.departments) {
          const departmentIcons: Record<string, string> = {
            'Roads & Transport': 'directions-car',
            'Waste Management': 'delete',
            'Parks & Recreation': 'park',
            'Public Safety': 'local-police',
          };

          setDepartments(
            data.departments.map((d: any) => ({
              name: d.name,
              contacted: d.contacted || 0,
              icon: departmentIcons[d.name] || 'business',
            }))
          );
        }

        // Update email activity
        if (data.emailActivity) {
          setEmailActivity(data.emailActivity);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Keep default empty values if API fails
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Timeframe Selector */}
        <View style={styles.timeframeContainer}>
          <TouchableOpacity
            style={[styles.timeframeButton, selectedTimeframe === 'week' && styles.timeframeButtonActive]}
            activeOpacity={0.7}
            onPress={() => setSelectedTimeframe('week')}
          >
            <Text style={[styles.timeframeText, selectedTimeframe === 'week' && styles.timeframeTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeframeButton, selectedTimeframe === 'month' && styles.timeframeButtonActive]}
            activeOpacity={0.7}
            onPress={() => setSelectedTimeframe('month')}
          >
            <Text style={[styles.timeframeText, selectedTimeframe === 'month' && styles.timeframeTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeframeButton, selectedTimeframe === 'year' && styles.timeframeButtonActive]}
            activeOpacity={0.7}
            onPress={() => setSelectedTimeframe('year')}
          >
            <Text style={[styles.timeframeText, selectedTimeframe === 'year' && styles.timeframeTextActive]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#5B7CFA" />
            <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>
              Loading analytics...
            </Text>
          </View>
        ) : (
          <>
            {/* Overview Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#5B7CFA' }]}>
                <MaterialIcons name="assignment" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{stats.totalReports}</Text>
              <Text style={styles.statLabel}>Total Reports</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#F0FDFA' }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#4DB6AC' }]}>
                <MaterialIcons name="email" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{stats.emailsSent}</Text>
              <Text style={styles.statLabel}>Emails Sent</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FF8C66' }]}>
                <MaterialIcons name="schedule" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{stats.avgResponseTime}</Text>
              <Text style={styles.statLabel}>Avg Response</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#4ADE80' }]}>
                <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{stats.resolvedIssues}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>
        </View>

        {/* Activity Chart */}
        {stats.totalReports > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Over Time</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#5B7CFA' }]} />
                  <Text style={styles.legendText}>Reports Created</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4DB6AC' }]} />
                  <Text style={styles.legendText}>Emails Sent</Text>
                </View>
              </View>

              {/* Chart will be populated with real data */}
              <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialIcons name="bar-chart" size={64} color="#D1D5DB" />
                <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14, textAlign: 'center' }}>
                  Activity data will appear here as you create reports
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Report Status Breakdown */}
        {reportsByStatus.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Status</Text>
            <View style={styles.statusCard}>
              <View style={styles.donutContainer}>
                <View style={styles.donutChart}>
                  <View style={styles.donutCenter}>
                    <Text style={styles.donutTotal}>{stats.totalReports}</Text>
                    <Text style={styles.donutLabel}>Total</Text>
                  </View>
                </View>
              </View>

              <View style={styles.statusList}>
                {reportsByStatus.map((item, index) => (
                  <View key={index} style={styles.statusItem}>
                    <View style={styles.statusLeft}>
                      <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                      <Text style={styles.statusName}>{item.status}</Text>
                    </View>
                    <View style={styles.statusRight}>
                      <Text style={styles.statusCount}>{item.count}</Text>
                      <Text style={styles.statusPercentage}>{item.percentage}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Departments Contacted */}
        {departments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Departments Contacted</Text>
            <View style={styles.departmentsCard}>
              {departments.map((dept, index) => (
                <View key={index} style={styles.departmentItem}>
                  <View style={styles.departmentLeft}>
                    <View style={styles.departmentIconContainer}>
                      <MaterialIcons name={dept.icon as any} size={22} color="#5B7CFA" />
                    </View>
                    <Text style={styles.departmentName}>{dept.name}</Text>
                  </View>
                  <View style={styles.departmentBadge}>
                    <Text style={styles.departmentCount}>{dept.contacted}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Email Performance - Only show when there's email activity */}
        {stats.emailsSent > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Performance</Text>
            <View style={styles.performanceCard}>
              <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialIcons name="email" size={64} color="#D1D5DB" />
                <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14, textAlign: 'center' }}>
                  Email performance metrics will appear here
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Email Activity Timeline */}
        {emailActivity.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Email Activity</Text>
            <View style={styles.activityCard}>
              {emailActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={[
                    styles.activityIconContainer,
                    { backgroundColor: activity.type === 'sent' ? '#EEF2FF' : '#F0FDFA' }
                  ]}>
                    <MaterialIcons
                      name={activity.type === 'sent' ? 'send' : 'inbox'}
                      size={18}
                      color={activity.type === 'sent' ? '#5B7CFA' : '#4DB6AC'}
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <View style={styles.activityFooter}>
                      <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
                      <View style={[
                        styles.activityStatusBadge,
                        { backgroundColor: activity.status === 'delivered' ? '#DBEAFE' : '#D1FAE5' }
                      ]}>
                        <Text style={[
                          styles.activityStatusText,
                          { color: activity.status === 'delivered' ? '#1E40AF' : '#065F46' }
                        ]}>
                          {activity.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State - Show when there's no data at all */}
        {stats.totalReports === 0 && (
          <View style={{ padding: 60, alignItems: 'center' }}>
            <MaterialIcons name="analytics" size={80} color="#D1D5DB" />
            <Text style={{ marginTop: 24, color: '#6B7280', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
              No Analytics Data Yet
            </Text>
            <Text style={{ marginTop: 8, color: '#9CA3AF', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 }}>
              Start creating reports to see your impact and analytics
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  timeframeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeframeButtonActive: {
    backgroundColor: '#5B7CFA',
    borderColor: '#5B7CFA',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartLegend: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  chartBarGroup: {
    flex: 1,
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: 8,
  },
  chartBar: {
    width: 6,
    borderRadius: 3,
  },
  chartLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  donutContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  donutChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 20,
    borderColor: '#4DB6AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    alignItems: 'center',
  },
  donutTotal: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  donutLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusList: {
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusName: {
    fontSize: 14,
    color: '#374151',
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusPercentage: {
    fontSize: 14,
    color: '#6B7280',
    width: 40,
    textAlign: 'right',
  },
  departmentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  departmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  departmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  departmentName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  departmentBadge: {
    backgroundColor: '#5B7CFA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  departmentCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  performanceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  performanceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  performanceTextContainer: {
    marginLeft: 10,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  performanceLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 6,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  activityStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activityStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AnalyticsDashboardScreen;
