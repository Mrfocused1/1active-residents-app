/**
 * Push Notifications Service
 *
 * Handles push notification registration, permissions, and delivery
 * Uses Expo Notifications API
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import apiService from './api.service';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationData {
  reportId?: string;
  council?: string;
  type?: string;
  [key: string]: any;
}

class PushNotificationsService {
  private expoPushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<void> {
    try {
      // Request permissions
      const token = await this.registerForPushNotifications();

      if (token) {
        this.expoPushToken = token;
        console.log('📬 Push token:', token);

        // Send token to backend
        await this.sendTokenToBackend(token);
      }

      // Set up listeners
      this.setupListeners();

      console.log('🔔 Push notifications initialized');
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  /**
   * Register for push notifications
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Push notifications only work on physical devices');
      return null;
    }

    try {
      // Get project ID from config
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.warn('Push notifications disabled: No Expo project ID configured');
        console.info('To enable push notifications, run "eas init" or create a project at https://expo.dev');
        return null;
      }

      console.log('📬 Using Expo project ID:', projectId);

      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permission not granted');
        return null;
      }

      // Get Expo push token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      // Configure Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#5B7CFA',
        });
      }

      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Set up notification listeners
   */
  private setupListeners(): void {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received:', notification);
      // Handle foreground notification
    });

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      const data = response.notification.request.content.data as NotificationData;

      // Handle notification tap
      this.handleNotificationTap(data);
    });
  }

  /**
   * Send token to backend
   */
  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      const deviceInfo = `${Platform.OS} ${Platform.Version}`;
      await apiService.registerPushToken(token, deviceInfo);
      console.log('✅ Push token registered with backend');
    } catch (error) {
      console.error('❌ Failed to register push token with backend:', error);
    }
  }

  /**
   * Handle notification tap
   */
  private handleNotificationTap(data: NotificationData): void {
    console.log('Handling notification tap with data:', data);

    // Navigate to appropriate screen based on notification data
    if (data.type === 'report_update' && data.reportId) {
      // This will be handled by the navigation system
      console.log('Navigate to report detail:', data.reportId);
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: NotificationData,
    triggerSeconds: number = 0
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: triggerSeconds > 0 ? { seconds: triggerSeconds } : null,
    });

    console.log('📅 Scheduled notification:', id);
    return id;
  }

  /**
   * Send test notification
   */
  async sendTestNotification(): Promise<void> {
    await this.scheduleLocalNotification(
      'Test Notification',
      'This is a test notification from your app!',
      { type: 'test' }
    );
  }

  /**
   * Cancel a notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('❌ Cancelled notification:', notificationId);
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('🗑️ Cancelled all notifications');
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear badge
   */
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Get push token
   */
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Clean up listeners
   */
  cleanup(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }
}

export default new PushNotificationsService();
