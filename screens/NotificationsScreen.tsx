import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';
import ApiService from '../services/api.service';

interface NotificationsScreenProps {
  onBack?: () => void;
  onSettings?: () => void;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
  onNotificationPress?: (notification: Notification) => void;
}

interface Notification {
  id: string;
  type: 'resolved' | 'update' | 'progress' | 'received' | 'alert';
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
  isRead?: boolean;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onSettings,
  onStartReport,
  onSeeAll,
  onCouncilUpdate,
  onProfile,
  onNotificationPress,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);

      // Check for auth token first
      const token = await AsyncStorage.getItem('@active_residents_token');
      if (!token) {
        console.log('📝 No auth token, showing empty notifications');
        setIsLoading(false);
        return;
      }

      const response = await ApiService.getNotifications({ limit: 20 });

      if (response.data && Array.isArray(response.data)) {
        const formattedNotifications = response.data.map((notif: any) =>
          formatNotification(notif)
        );
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.log('📝 Could not fetch notifications (user may not be logged in)');
      // Keep empty array if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const formatNotification = (notif: any): Notification => {
    const typeConfig: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
      resolved: { icon: 'check-circle', iconBg: 'rgba(77, 182, 172, 0.1)', iconColor: '#4DB6AC' },
      update: { icon: 'campaign', iconBg: 'rgba(126, 140, 224, 0.1)', iconColor: '#7E8CE0' },
      progress: { icon: 'build', iconBg: 'rgba(255, 213, 114, 0.1)', iconColor: '#FFD572' },
      received: { icon: 'notifications', iconBg: '#F3F4F6', iconColor: '#6B7280' },
      alert: { icon: 'warning', iconBg: 'rgba(255, 140, 102, 0.1)', iconColor: '#FF8C66' },
    };

    const config = typeConfig[notif.type] || typeConfig.received;

    return {
      id: notif._id || notif.id,
      type: notif.type,
      icon: config.icon,
      iconBg: config.iconBg,
      iconColor: config.iconColor,
      title: notif.title,
      description: notif.description || notif.message,
      time: notif.time || formatTime(notif.createdAt),
      isNew: notif.isNew,
      isRead: notif.isRead,
    };
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await ApiService.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isRead: true, isNew: false } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await ApiService.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true, isNew: false }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ApiService.deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete all notifications from backend
              const deletePromises = notifications.map(notif =>
                ApiService.deleteNotification(notif.id)
              );
              await Promise.all(deletePromises);
              setNotifications([]);
            } catch (error) {
              console.error('Error clearing notifications:', error);
              Alert.alert('Error', 'Failed to clear notifications. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getTodayNotifications = () => notifications.filter((n) => n.time.includes('ago'));
  const getYesterdayNotifications = () =>
    notifications.filter((n) => n.time.includes('Yesterday'));
  const getEarlierNotifications = () =>
    notifications.filter((n) => !n.time.includes('ago') && !n.time.includes('Yesterday'));

  const hasNewNotifications = notifications.some((n) => n.isNew);

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
                  <MaterialIcons name="arrow-back-ios" size={18} color="#64748B" />
                  <Text style={styles.backButtonText}>Back to Home</Text>
                </View>
              </ScalePress>
              <Text style={styles.headerTitle}>Your Notifications</Text>
            </View>
            <ScalePress onPress={handleClearAll}>
              <View style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </View>
            </ScalePress>
          </View>
        </FadeIn>

        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#5B7CFA" />
            <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>
              Loading notifications...
            </Text>
          </View>
        ) : (
          <>
            {notifications.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialIcons name="notifications-none" size={64} color="#D1D5DB" />
                <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 16, fontWeight: '600' }}>
                  No notifications yet
                </Text>
                <Text style={{ marginTop: 8, color: '#9CA3AF', fontSize: 14, textAlign: 'center' }}>
                  When you receive updates about your reports, they'll appear here
                </Text>
              </View>
            ) : (
              <>
                {/* Today Section */}
                {getTodayNotifications().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY</Text>
            <View style={styles.notificationsList}>
              {getTodayNotifications().map((notification, index) => (
                <SlideIn key={notification.id} delay={500 + index * 100} from="bottom" distance={20}>
                  <ScalePress onPress={() => onNotificationPress?.(notification)}>
                    <View
                      style={[
                        styles.notificationCard,
                        !notification.isRead && styles.notificationCardUnread,
                      ]}
                    >
                  <View style={styles.notificationContent}>
                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: notification.iconBg },
                      ]}
                    >
                      <MaterialIcons
                        name={notification.icon as any}
                        size={20}
                        color={notification.iconColor}
                      />
                    </View>

                    <View style={styles.notificationBody}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        {notification.isNew && (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>New</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.notificationDescription}>
                        {notification.description}
                      </Text>

                      <View style={styles.notificationFooter}>
                        <View style={styles.notificationTime}>
                          <MaterialIcons name="schedule" size={10} color="#9CA3AF" />
                          <Text style={styles.notificationTimeText}>{notification.time}</Text>
                        </View>
                        {!notification.isRead && (
                          <ScalePress
                            onPress={() => handleMarkAsRead(notification.id)}
                          >
                            <View>
                              <Text style={styles.markAsReadText}>Mark as read</Text>
                            </View>
                          </ScalePress>
                        )}
                      </View>
                    </View>
                  </View>
                    </View>
                  </ScalePress>
                </SlideIn>
              ))}
            </View>
          </View>
        )}

        {/* Yesterday Section */}
        {getYesterdayNotifications().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YESTERDAY</Text>
            <View style={styles.notificationsList}>
              {getYesterdayNotifications().map((notification, index) => (
                <SlideIn key={notification.id} delay={500 + index * 100} from="bottom" distance={20}>
                  <ScalePress onPress={() => onNotificationPress?.(notification)}>
                    <View style={[styles.notificationCard, styles.notificationCardRead]}>
                  <View style={styles.notificationContent}>
                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: notification.iconBg },
                      ]}
                    >
                      <MaterialIcons
                        name={notification.icon as any}
                        size={20}
                        color={notification.iconColor}
                      />
                    </View>

                    <View style={styles.notificationBody}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>

                      <Text style={styles.notificationDescriptionRead}>
                        {notification.description}
                      </Text>

                      <View style={styles.notificationFooterRead}>
                        <View style={styles.notificationTime}>
                          <MaterialIcons name="schedule" size={10} color="#9CA3AF" />
                          <Text style={styles.notificationTimeText}>{notification.time}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
                      </View>
                    </View>
                  </View>
                    </View>
                  </ScalePress>
                </SlideIn>
              ))}
            </View>
          </View>
        )}

        {/* Earlier Section */}
        {getEarlierNotifications().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EARLIER</Text>
            <View style={styles.notificationsList}>
              {getEarlierNotifications().map((notification, index) => (
                <SlideIn key={notification.id} delay={500 + index * 100} from="bottom" distance={20}>
                  <ScalePress onPress={() => onNotificationPress?.(notification)}>
                    <View style={[styles.notificationCard, styles.notificationCardOlder]}>
                  <View style={styles.notificationContent}>
                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: notification.iconBg },
                      ]}
                    >
                      <MaterialIcons
                        name={notification.icon as any}
                        size={20}
                        color={notification.iconColor}
                      />
                    </View>

                    <View style={styles.notificationBody}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>

                      <Text style={styles.notificationDescriptionRead}>
                        {notification.description}
                      </Text>

                      <View style={styles.notificationFooterRead}>
                        <View style={styles.notificationTime}>
                          <MaterialIcons name="schedule" size={10} color="#9CA3AF" />
                          <Text style={styles.notificationTimeText}>{notification.time}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={18} color="#D1D5DB" />
                      </View>
                    </View>
                  </View>
                    </View>
                  </ScalePress>
                </SlideIn>
              ))}
            </View>
          </View>
        )}
              </>
            )}

            {/* Settings Button - Always visible */}
            <FadeIn delay={800}>
              <ScalePress onPress={onSettings}>
                <View style={styles.settingsCard}>
                  <View style={styles.settingsContent}>
                    <View style={styles.settingsIcon}>
                      <MaterialIcons name="settings" size={20} color="#5B7CFA" />
                    </View>
                    <View style={styles.settingsText}>
                      <Text style={styles.settingsTitle}>Change Notification Settings</Text>
                      <Text style={styles.settingsSubtitle}>Manage your preferences</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={18} color="#9CA3AF" />
                </View>
              </ScalePress>
            </FadeIn>
          </>
        )}

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
              <View style={styles.navItemWithBadge}>
                <MaterialIcons name="chat-bubble-outline" size={28} color="#5B7CFA" />
                {hasNewNotifications && <View style={styles.notificationBadge} />}
              </View>
              <Text style={[styles.navLabel, styles.navLabelActive]}>Updates</Text>
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

          <ScalePress onPress={onSeeAll}>
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
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  clearButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B7CFA',
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 16,
    paddingLeft: 4,
  },
  notificationsList: {
    gap: 12,
  },

  // Notification Cards
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#5B7CFA',
  },
  notificationCardRead: {
    opacity: 0.9,
  },
  notificationCardOlder: {
    opacity: 0.8,
  },
  notificationContent: {
    flexDirection: 'row',
    gap: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBody: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
  },
  newBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5B7CFA',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationDescriptionRead: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationFooterRead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notificationTimeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  markAsReadText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5B7CFA',
  },

  // Settings Card
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
  },
  settingsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
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
  navItemWithBadge: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8C66',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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

export default NotificationsScreen;
