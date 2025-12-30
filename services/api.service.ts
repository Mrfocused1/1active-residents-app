import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// For local testing: Use your computer's IP address (not localhost)
// For production: Use your Railway URL
const LOCAL_IP = '192.168.1.185';  // Your computer's IP - update if it changes
const API_URL = __DEV__
  ? `http://${LOCAL_IP}:3000/api`  // Local backend for development
  : 'https://1active-residents-app-production.up.railway.app/api';  // Production backend

const TOKEN_KEY = '@active_residents_token';

// Enable mock mode when backend is not available
const USE_MOCK_DATA = false; // Set to true only for development without backend

// Mock Data
const MOCK_DATA = {
  currentUser: {
    data: {
      _id: '1',
      name: 'User', // Will be updated during onboarding
      email: 'user@example.com',
      phone: undefined,
      address: undefined,
      location: undefined,
      profilePhoto: null,
      createdAt: new Date().toISOString(),
    },
  },
  reportStats: {
    data: {
      totalReports: 0,
      emailsSent: 0,
      avgResponseTime: '0 days',
      resolvedIssues: 0,
      reportsByStatus: [],
      departments: [],
      emailActivity: [],
    },
  },
  notifications: {
    data: [], // Start with no notifications for new users
  },
  emailThread: {
    data: {
      messages: [],
      lastActivity: '',
      status: 'No emails',
    },
  },
};

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_URL;
    this.loadToken();
  }

  // Load token from storage
  async loadToken() {
    try {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  // Save token to storage
  async saveToken(token: string) {
    try {
      this.token = token;
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  // Remove token from storage
  async removeToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Get authorization headers
  private getHeaders(isFormData = false) {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method with timeout
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = 15000  // 15 second timeout
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(options.body instanceof FormData),
        ...options.headers,
      },
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('API Request Timeout:', endpoint);
        throw new Error('Request timed out. Please check your connection.');
      }
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

  async logout() {
    await this.removeToken();
  }

  async deleteAccount(password: string) {
    // Call backend to delete account
    const response = await this.request('/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });

    // Clear local token after successful deletion
    if (response.success) {
      await this.removeToken();
    }

    return response;
  }

  async getCurrentUser() {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Load saved profile from AsyncStorage
      try {
        const savedProfile = await AsyncStorage.getItem('@user_profile');
        if (savedProfile) {
          MOCK_DATA.currentUser.data = JSON.parse(savedProfile);
          console.log('📸 Loaded profile from AsyncStorage, photo:', MOCK_DATA.currentUser.data.profilePhoto ? 'Yes' : 'No');
        }
      } catch (error) {
        console.error('Error loading profile from AsyncStorage:', error);
      }

      return MOCK_DATA.currentUser as any;
    }
    return this.request('/auth/me');
  }

  async updateProfile(updates: {
    name?: string;
    phone?: string;
    address?: any;
    preferences?: any;
    profilePhoto?: string | null;
  }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update the mock data so it persists
      MOCK_DATA.currentUser.data = { ...MOCK_DATA.currentUser.data, ...updates };

      // Persist to AsyncStorage so it survives app restarts
      try {
        await AsyncStorage.setItem('@user_profile', JSON.stringify(MOCK_DATA.currentUser.data));
        console.log('✅ Profile saved to AsyncStorage:', updates);
      } catch (error) {
        console.error('❌ Error saving profile to AsyncStorage:', error);
      }

      return { success: true, data: MOCK_DATA.currentUser.data } as any;
    }
    return this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Report Methods
  async createReport(reportData: {
    title: string;
    description: string;
    category: string;
    location: {
      coordinates: [number, number];
      address?: string;
    };
    images?: string[];
    isPublic?: boolean;
  }) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getReports(params: {
    status?: string;
    category?: string;
    priority?: string;
    myReports?: boolean;
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    limit?: number;
  } = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/reports${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async getReport(reportId: string) {
    return this.request(`/reports/${reportId}`);
  }

  async updateReport(
    reportId: string,
    updates: {
      title?: string;
      description?: string;
      location?: any;
      isPublic?: boolean;
    }
  ) {
    return this.request(`/reports/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteReport(reportId: string) {
    return this.request(`/reports/${reportId}`, {
      method: 'DELETE',
    });
  }

  async addReportUpdate(reportId: string, message: string, status?: string) {
    return this.request(`/reports/${reportId}/update`, {
      method: 'POST',
      body: JSON.stringify({ message, status }),
    });
  }

  async voteReport(reportId: string, voteType: 'upvote' | 'downvote') {
    return this.request(`/reports/${reportId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  }

  async addComment(reportId: string, comment: string) {
    return this.request(`/reports/${reportId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async getReportStats() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.reportStats as any;
    }
    return this.request('/reports/stats/overview');
  }

  // Notification Methods
  async getNotifications(params: {
    unreadOnly?: boolean;
    limit?: number;
    page?: number;
  } = {}) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.notifications as any;
    }

    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/notifications${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  async markNotificationAsRead(notificationId: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true } as any;
    }
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true } as any;
    }
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true } as any;
    }
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  // Email Thread Methods
  async getEmailThread(reportId: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.emailThread as any;
    }
    return this.request(`/reports/${reportId}/emails`);
  }

  async sendEmailReply(reportId: string, replyData: {
    subject: string;
    body: string;
    recipientEmail?: string;
  }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, data: { message: 'Reply sent successfully' } } as any;
    }
    return this.request(`/reports/${reportId}/emails`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  }

  // Push Token Methods
  async registerPushToken(token: string, device?: string) {
    return this.request('/push-tokens', {
      method: 'POST',
      body: JSON.stringify({ token, device }),
    });
  }

  async removePushToken(token: string) {
    return this.request('/push-tokens', {
      method: 'DELETE',
      body: JSON.stringify({ token }),
    });
  }

  async getPushTokens() {
    return this.request('/push-tokens');
  }
}

// Export singleton instance
export default new ApiService();
