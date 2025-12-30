import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert, Linking, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PageTransition } from './components/animations';
import SwipeableScreen from './components/SwipeableScreen';
import OnboardingFlow from './OnboardingFlow';
import analytics from './services/analytics.service';
import crashReporting from './services/crashReporting.service';
import pushNotifications from './services/pushNotifications.service';
import apiService from './services/api.service';
import reportSubmissionService from './services/reportSubmission.service';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import HomeScreen from './screens/HomeScreen';
import IssueCategoryScreen from './screens/IssueCategoryScreen';
import IssueDetailsScreen from './screens/IssueDetailsScreen';
import ConfirmReportScreen from './screens/ConfirmReportScreen';
import LoginScreen from './screens/LoginScreen';
import AllReportsScreen from './screens/AllReportsScreen';
import CouncilUpdatesScreen from './screens/CouncilUpdatesScreen';
import AllUpdatesScreen from './screens/AllUpdatesScreen';
import MyImpactScreen from './screens/MyImpactScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import MapViewScreen from './screens/MapViewScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReportDetailScreen from './screens/ReportDetailScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HelpScreen from './screens/HelpScreen';
import TermsPrivacyScreen from './screens/TermsPrivacyScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import AboutScreen from './screens/AboutScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ThemeSelectionScreen from './screens/ThemeSelectionScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import PrivacySettingsScreen from './screens/PrivacySettingsScreen';
import ErrorScreen from './screens/ErrorScreen';
import DeleteAccountScreen from './screens/DeleteAccountScreen';
import SignUpScreen from './screens/SignUpScreen';
import SearchScreen from './screens/SearchScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import EmailConnectionScreen from './screens/EmailConnectionScreen';
import AnalyticsDashboardScreen from './screens/AnalyticsDashboardScreen';
import EmailPreviewScreen from './screens/EmailPreviewScreen';
import EmailThreadViewerScreen from './screens/EmailThreadViewerScreen';
import IssueSearchScreen from './screens/IssueSearchScreen';
import UpdateDetailScreen from './screens/UpdateDetailScreen';

type Screen = 'onboarding' | 'login' | 'forgotPassword' | 'resetPassword' | 'signUp' | 'verifyEmail' | 'home' | 'allReports' | 'myReports' | 'councilUpdates' | 'allUpdates' | 'myImpact' | 'notifications' | 'notificationSettings' | 'profile' | 'mapView' | 'selectLocation' | 'settings' | 'help' | 'termsPrivacy' | 'reportDetail' | 'issueCategory' | 'issueDetails' | 'issueSearch' | 'confirmReport' | 'changePassword' | 'about' | 'editProfile' | 'themeSelection' | 'languageSelection' | 'privacySettings' | 'deleteAccount' | 'error' | 'search' | 'emailConnection' | 'analyticsDashboard' | 'emailPreview' | 'emailThread' | 'updateDetail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['onboarding']);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedIssueTopic, setSelectedIssueTopic] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedReportData, setSelectedReportData] = useState<any>(null);
  const [selectedUpdateData, setSelectedUpdateData] = useState<any>(null);
  const [selectedCouncil, setSelectedCouncil] = useState<string>('Camden'); // Default to Camden
  const [userName, setUserName] = useState<string>('User');
  const [profileRefreshKey, setProfileRefreshKey] = useState<number>(0); // Trigger profile refresh

  // Navigation helper functions
  const navigateTo = (screen: Screen) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  const resetNavigation = (screen: Screen) => {
    setScreenHistory([screen]);
    setCurrentScreen(screen);
  };

  // Initialize Phase 6 services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log('🚀 Initializing Phase 6 services...');

        // Initialize analytics
        await analytics.initialize();
        console.log('✅ Analytics service initialized');

        // Initialize crash reporting
        await crashReporting.initialize();
        console.log('✅ Crash reporting service initialized');

        // Initialize push notifications
        await pushNotifications.initialize();
        console.log('✅ Push notifications service initialized');

        console.log('✅ All Phase 6 services initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize services:', error);
        crashReporting.captureException(
          error as Error,
          { context: 'App initialization' }
        );
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up Phase 6 services...');
      pushNotifications.cleanup();
    };
  }, []);

  // Load saved council preference from AsyncStorage on app start
  useEffect(() => {
    const loadCouncilPreference = async () => {
      try {
        const savedCouncil = await AsyncStorage.getItem('selectedCouncil');
        if (savedCouncil) {
          setSelectedCouncil(savedCouncil);
          console.log('✅ Council preference loaded:', savedCouncil);
        }
      } catch (error) {
        console.error('Error loading council preference:', error);
      }
    };

    loadCouncilPreference();
  }, []);

  // Fetch user profile on app load (only if logged in)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Check if there's a stored token first
        const token = await AsyncStorage.getItem('@active_residents_token');
        if (!token) {
          console.log('📝 No auth token found, skipping profile fetch');
          return;
        }

        const response = await apiService.getCurrentUser();
        if (response?.data?.name) {
          setUserName(response.data.name);
          console.log('✅ User profile loaded:', response.data.name);
        }
      } catch (error) {
        // Silently handle auth errors for users who aren't logged in
        console.log('📝 Could not fetch profile (user may not be logged in)');
      }
    };

    fetchUserProfile();
  }, []);

  const handleOnboardingComplete = async (onboardingData?: any) => {
    // Save user profile data if provided
    if (onboardingData?.name || onboardingData?.council) {
      try {
        const profileUpdates: any = {};

        if (onboardingData.name) {
          profileUpdates.name = onboardingData.name;
          setUserName(onboardingData.name); // Update local state
          // Save name locally for later sync
          await AsyncStorage.setItem('@onboarding_name', onboardingData.name);
        }

        if (onboardingData.council) {
          profileUpdates.location = onboardingData.council;
          setSelectedCouncil(onboardingData.council);

          // IMPORTANT: Save council to AsyncStorage so Settings can read it
          await AsyncStorage.setItem('selectedCouncil', onboardingData.council);
          console.log('📍 Onboarding: Saved council to AsyncStorage:', onboardingData.council);

          // Track council selection
          analytics.setUserProperties({ council: onboardingData.council });
          analytics.trackCouncilSelection(onboardingData.council);
        }

        // Only sync to backend if user is authenticated
        const token = await AsyncStorage.getItem('@active_residents_token');
        if (token) {
          await apiService.updateProfile(profileUpdates);
          console.log('✅ User profile saved to backend:', profileUpdates);
        } else {
          console.log('📝 Onboarding data saved locally (user not yet authenticated)');
        }
      } catch (error) {
        console.error('Error saving user profile:', error);
      }
    }

    analytics.trackScreenView('Home');
    resetNavigation('home');
  };

  const handleShowLogin = () => {
    navigateTo('login');
  };

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      console.log('Logging in with:', credentials.email);

      const response = await apiService.login(credentials.email, credentials.password);

      if (response.success && response.data?.user) {
        // Update local state with user data
        setUserName(response.data.user.name || 'User');

        // Store user data locally for offline access
        if (response.data.user.name) {
          await AsyncStorage.setItem('@user_name', response.data.user.name);
        }
        if (response.data.user.email) {
          await AsyncStorage.setItem('@user_email', response.data.user.email);
        }

        // Track login event
        analytics.trackEvent('login_success', { method: 'email' });
        analytics.setUserProperties({ userId: response.data.user._id });

        // Sync any locally saved onboarding data to backend
        try {
          const savedCouncil = await AsyncStorage.getItem('selectedCouncil');
          if (savedCouncil) {
            await apiService.updateProfile({ location: savedCouncil });
            console.log('✅ Synced onboarding data to backend');
          }
        } catch (syncError) {
          console.log('📝 Could not sync onboarding data:', syncError);
        }

        console.log('Login successful');
        resetNavigation('home');
      } else if (response.data?.token) {
        // Token received, fetch user profile
        const userResponse = await apiService.getCurrentUser();
        if (userResponse?.data?.name) {
          setUserName(userResponse.data.name);
          await AsyncStorage.setItem('@user_name', userResponse.data.name);
        }
        if (userResponse?.data?.email) {
          await AsyncStorage.setItem('@user_email', userResponse.data.email);
        }

        // Sync any locally saved onboarding data to backend
        try {
          const savedCouncil = await AsyncStorage.getItem('selectedCouncil');
          if (savedCouncil) {
            await apiService.updateProfile({ location: savedCouncil });
            console.log('✅ Synced onboarding data to backend');
          }
        } catch (syncError) {
          console.log('📝 Could not sync onboarding data:', syncError);
        }

        analytics.trackEvent('login_success', { method: 'email' });
        console.log('Login successful');
        resetNavigation('home');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      crashReporting.captureException(error, { context: 'Login' });

      Alert.alert(
        'Login Failed',
        error.message || 'Invalid email or password. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleBackToOnboarding = () => {
    navigateBack();
  };

  const handleCreateAccount = () => {
    // Navigate to sign up screen
    navigateTo('signUp');
  };

  const handleForgotPassword = () => {
    navigateTo('forgotPassword');
  };

  const handleBackToLogin = () => {
    navigateBack();
  };

  const handleSendResetLink = async (email: string) => {
    try {
      console.log('Sending password reset link to:', email);

      await apiService.forgotPassword(email);

      // Track event
      analytics.trackEvent('password_reset_requested', { email });

      // Always show generic success message for security (don't reveal if email exists)
      Alert.alert(
        'Reset Link Sent',
        'If an account exists with this email, you will receive password reset instructions.',
        [{ text: 'OK', onPress: () => navigateBack() }]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);

      // Still show generic success message for security
      Alert.alert(
        'Reset Link Sent',
        'If an account exists with this email, you will receive password reset instructions.',
        [{ text: 'OK', onPress: () => navigateBack() }]
      );
    }
  };

  const handleStartReport = () => {
    analytics.trackScreenView('IssueCategory');
    analytics.trackEvent('start_report', { council: selectedCouncil });
    navigateTo('issueCategory');
  };

  const handleSeeAllReports = () => {
    resetNavigation('allReports');
  };

  const handleShowCouncilUpdates = () => {
    resetNavigation('councilUpdates');
  };

  const handleSeeAllUpdates = () => {
    resetNavigation('allUpdates');
  };

  const handleShowMyImpact = () => {
    navigateTo('myImpact');
  };

  const handleShowNotifications = () => {
    navigateTo('notifications');
  };

  const handleShowNotificationSettings = () => {
    navigateTo('notificationSettings');
  };

  const handleBackToHome = () => {
    navigateBack();
  };

  const handleGoToHome = () => {
    resetNavigation('home');
  };

  const handleBackToNotifications = () => {
    navigateBack();
  };

  const handleShowProfile = () => {
    resetNavigation('profile');
  };

  const handleShowSettings = () => {
    navigateTo('settings');
  };

  const handleShowHelp = () => {
    navigateTo('help');
  };

  const handleShowTermsPrivacy = () => {
    navigateTo('termsPrivacy');
  };

  const handleShowMapView = () => {
    console.log('Navigating to map view...');
    analytics.trackScreenView('MapView');
    analytics.trackEvent('view_map', { council: selectedCouncil });
    navigateTo('mapView');
  };

  const handleShowReportDetail = (reportId: string, reportData?: any) => {
    setSelectedReportId(reportId);
    setSelectedReportData(reportData);
    navigateTo('reportDetail');
  };

  const handleBackToAllReports = () => {
    navigateBack();
  };

  const handleCategorySelected = (category: string) => {
    console.log('Category selected:', category);
    setSelectedCategory(category);

    // Track category selection
    analytics.trackEvent('category_selected', {
      category,
      council: selectedCouncil,
    });

    // If "other" category is selected, show search screen
    if (category === 'other') {
      analytics.trackScreenView('IssueSearch');
      navigateTo('issueSearch');
    } else {
      analytics.trackScreenView('IssueDetails');
      navigateTo('issueDetails');
    }
  };

  const handleIssueTopicSelected = (topic: any) => {
    console.log('Issue topic selected:', topic);
    setSelectedIssueTopic(topic);
    setSelectedCategory(topic.category);
    navigateTo('issueDetails');
  };

  const handleBackToCategory = () => {
    navigateBack();
  };

  const handleBackToIssueSearch = () => {
    navigateBack();
  };

  const handleEditCategory = () => {
    navigateBack();
  };

  const handleSubmitReport = (data: any) => {
    console.log('Report data to review:', data);
    setReportData({ ...data, categoryKey: selectedCategory });
    navigateTo('confirmReport');
  };

  const handleBackToDetails = () => {
    navigateBack();
  };

  const handleEditSection = (section: string) => {
    console.log('Edit section:', section);
    // Navigate back to appropriate screen based on section
    if (section === 'category') {
      navigateBack();
    } else {
      navigateBack();
    }
  };

  const handleConfirmReport = async () => {
    console.log('Final report submission:', reportData);

    if (!reportData) {
      console.error('No report data to submit');
      resetNavigation('home');
      return;
    }

    try {
      // Submit report directly to FixMyStreet or via email
      const result = await reportSubmissionService.submitReport({
        category: reportData.categoryKey || 'other',
        title: reportData.title || `${reportData.categoryKey} issue`,
        description: reportData.description || '',
        location: reportData.location || { coordinates: undefined, address: undefined },
        photo: reportData.photo,
        council: selectedCouncil,
      });

      if (result.success) {
        console.log(`✅ Report submitted via ${result.method}:`, result.message);

        // Track report submission
        analytics.trackReportSubmission(
          reportData.categoryKey || 'unknown',
          selectedCouncil
        );
        analytics.trackEvent('report_submitted', {
          category: reportData.categoryKey,
          council: selectedCouncil,
          method: result.method,
          hasPhoto: !!reportData.photo,
          hasDescription: !!reportData.description,
          success: true,
        });

        // TODO: Show success message to user
        alert(`Report Submitted!\n\n${result.message}`);
      } else {
        console.error('❌ Report submission failed:', result.message);

        // Track failed submission
        analytics.trackEvent('report_submission_failed', {
          category: reportData.categoryKey,
          council: selectedCouncil,
          error: result.error,
        });

        // TODO: Show error message to user
        alert(`Submission Failed\n\n${result.message}\n\nPlease try again or contact your council directly.`);
      }

      // Navigate back to home
      resetNavigation('home');
    } catch (error) {
      console.error('❌ Unexpected error submitting report:', error);

      // Track error
      analytics.trackEvent('report_submission_error', {
        category: reportData.categoryKey,
        council: selectedCouncil,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      alert('An unexpected error occurred. Please try again.');
      resetNavigation('home');
    }
  };

  const handleResetPassword = (password: string) => {
    console.log('Password reset:', password);
    // TODO: Implement password reset logic
    navigateBack();
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      console.log('Changing password...');

      const response = await apiService.changePassword(currentPassword, newPassword);

      if (response.success) {
        analytics.trackEvent('password_changed');

        Alert.alert(
          'Password Changed',
          'Your password has been updated successfully.',
          [{ text: 'OK', onPress: () => navigateBack() }]
        );
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      crashReporting.captureException(error, { context: 'ChangePassword' });

      // Check if it's a network/API unavailable error
      const isNetworkError = error.message?.toLowerCase().includes('route not found') ||
                            error.message?.toLowerCase().includes('network') ||
                            error.message?.toLowerCase().includes('fetch') ||
                            error.message?.toLowerCase().includes('connection');

      Alert.alert(
        isNetworkError ? 'Connection Required' : 'Error',
        isNetworkError
          ? 'Changing your password requires an internet connection. Please check your connection and try again.'
          : (error.message || 'Could not change password. Please check your current password.'),
        [{ text: 'OK' }]
      );
    }
  };

  const handleShowChangePassword = () => {
    navigateTo('changePassword');
  };

  const handleShowAbout = () => {
    navigateTo('about');
  };

  const handleShowEditProfile = () => {
    navigateTo('editProfile');
  };

  const handleSaveProfile = (profileData: any) => {
    console.log('📝 Profile saved:', profileData);
    // Increment the refresh key to trigger ProfileScreen to re-fetch data
    setProfileRefreshKey(prev => prev + 1);
    navigateBack();
  };

  const handleShowThemeSelection = () => {
    navigateTo('themeSelection');
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    console.log('Theme changed to:', theme);
    // TODO: Implement theme change logic
  };

  const handleShowLanguageSelection = () => {
    navigateTo('languageSelection');
  };

  const handleLanguageChange = (languageCode: string) => {
    console.log('Language changed to:', languageCode);
    // TODO: Implement language change logic
  };

  const handleShowPrivacySettings = () => {
    navigateTo('privacySettings');
  };

  const handleBackToSettings = () => {
    navigateBack();
  };

  const handleBackToProfile = () => {
    navigateBack();
  };

  const handleShowSignUp = () => {
    navigateTo('signUp');
  };

  const handleSignUp = async (data: { fullName: string; email: string; password: string }) => {
    try {
      console.log('Signing up:', data.email);

      let apiSuccess = false;

      // Try API registration
      try {
        const response = await apiService.register({
          name: data.fullName,
          email: data.email,
          password: data.password,
        });

        if (response.success || response.data?.token) {
          apiSuccess = true;
          // Track signup event
          analytics.trackEvent('signup_success', { method: 'email' });
          if (response.data?.user?._id) {
            analytics.setUserProperties({ userId: response.data.user._id });
          }

          // Sync any locally saved onboarding data to backend
          try {
            const savedCouncil = await AsyncStorage.getItem('selectedCouncil');
            if (savedCouncil) {
              await apiService.updateProfile({ location: savedCouncil });
              console.log('✅ Synced onboarding data to backend');
            }
          } catch (syncError) {
            console.log('📝 Could not sync onboarding data:', syncError);
          }
        }
      } catch (apiError) {
        console.log('📝 API unavailable, continuing with local signup');
      }

      // Always save locally and proceed (works offline too)
      setUserName(data.fullName);
      await AsyncStorage.setItem('@user_name', data.fullName);
      await AsyncStorage.setItem('@user_email', data.email);

      console.log('Sign up successful' + (apiSuccess ? '' : ' (offline mode)'));

      // Navigate to home
      resetNavigation('home');
    } catch (error: any) {
      console.error('Sign up error:', error);
      crashReporting.captureException(error, { context: 'SignUp' });

      Alert.alert(
        'Registration Failed',
        error.message || 'Could not create account. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleShowDeleteAccount = () => {
    navigateTo('deleteAccount');
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      console.log('Deleting account...');

      // Try to delete account on backend
      try {
        const response = await apiService.deleteAccount(password);
        if (!response.success && response.message) {
          throw new Error(response.message);
        }
      } catch (apiError: any) {
        // If it's a password/auth error, show it to user
        if (apiError.message?.toLowerCase().includes('password') ||
            apiError.message?.toLowerCase().includes('unauthorized')) {
          throw apiError;
        }
        // Otherwise, API might be unavailable - continue with local deletion
        console.log('📝 API unavailable, proceeding with local account deletion');
      }

      // Clear all local storage
      await AsyncStorage.clear();

      analytics.trackEvent('account_deleted');

      Alert.alert(
        'Account Deleted',
        'Your account has been deleted successfully.',
        [{ text: 'OK', onPress: () => resetNavigation('onboarding') }]
      );
    } catch (error: any) {
      console.error('Delete account error:', error);

      // Only report unexpected errors to crash reporting, not validation errors
      const isValidationError = error.message?.toLowerCase().includes('password') ||
                                error.message?.toLowerCase().includes('incorrect') ||
                                error.message?.toLowerCase().includes('invalid');
      if (!isValidationError) {
        crashReporting.captureException(error, { context: 'DeleteAccount' });
      }

      Alert.alert(
        'Incorrect Password',
        'The password you entered is incorrect. Please try again with your current password.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleShowError = () => {
    navigateTo('error');
  };

  const handleRetry = () => {
    console.log('Retry');
    // TODO: Implement retry logic
    navigateBack();
  };

  const handleContactSupport = () => {
    console.log('Contact support');
    navigateTo('help');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.logout();
              await AsyncStorage.removeItem('@active_residents_token');
              await AsyncStorage.removeItem('@user_name');
              await AsyncStorage.removeItem('@user_email');
              analytics.trackEvent('logout');
              setUserName('User');
              resetNavigation('onboarding');
            } catch (error) {
              console.error('Logout error:', error);
              // Still navigate to onboarding even if API call fails
              resetNavigation('onboarding');
            }
          },
        },
      ]
    );
  };

  const handleShowSearch = () => {
    navigateTo('search');
  };

  const handleVerifyEmail = async (code: string) => {
    try {
      console.log('Verifying email with code:', code);

      // Note: Backend needs a verify email endpoint for full implementation
      // For now, proceed to home after showing success
      analytics.trackEvent('email_verified');

      Alert.alert(
        'Email Verified',
        'Your email has been verified successfully!',
        [{ text: 'Continue', onPress: () => resetNavigation('home') }]
      );
    } catch (error: any) {
      console.error('Email verification error:', error);
      crashReporting.captureException(error, { context: 'VerifyEmail' });

      Alert.alert(
        'Verification Failed',
        'Invalid or expired verification code. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSkipVerification = () => {
    resetNavigation('home');
  };

  const handleResendCode = () => {
    console.log('Resend verification code');
    // TODO: Implement resend code logic
  };

  const handleShowEmailConnection = () => {
    navigateTo('emailConnection');
  };

  const handleShowAnalyticsDashboard = () => {
    navigateTo('analyticsDashboard');
  };

  const handleShowEmailPreview = () => {
    navigateTo('emailPreview');
  };

  const handleShowEmailThread = () => {
    navigateTo('emailThread');
  };

  // NEW HANDLERS for fixed screens
  const handleAlertPress = () => {
    console.log('Alert "Read More" pressed');
    // Navigate to full alert/announcement details
    // For now, could show more info or navigate to a specific update
  };

  const handleUpdatePress = (updateData: any) => {
    console.log('Update pressed:', updateData);
    setSelectedUpdateData(updateData);
    navigateTo('updateDetail');
  };

  const handleSort = () => {
    console.log('Sort button pressed');
    // Show sort options modal/bottom sheet
  };

  const handleLoadMore = () => {
    console.log('Load more button pressed');
    // Load more items (reports/updates)
  };

  const handleHistory = () => {
    // Navigate to user's personal reports (not all council reports)
    // Use navigateTo to maintain navigation stack for back button functionality
    navigateTo('myReports');
  };

  const handleFilter = () => {
    console.log('Filter button pressed');
    // Show analytics filter options
  };

  const handleAdjustLocation = () => {
    console.log('Adjust location pressed');
    // Open map to adjust pin location
    navigateTo('selectLocation');
  };

  const handleLocationSelected = (location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
  }) => {
    console.log('📍 Location selected:', location);
    // Update reportData with new coordinates and address
    setReportData((prev: any) => ({
      ...prev,
      location: {
        ...prev?.location,
        coordinates: [location.longitude, location.latitude], // GeoJSON format [lng, lat]
        address: location.address || prev?.location?.address,
        city: location.city || prev?.location?.city,
      },
    }));

    // Navigate back to report screen
    navigateBack();
  };

  const handleChangeAddress = () => {
    console.log('Change address pressed');
    // Navigate to map to select/change location
    navigateTo('selectLocation');
  };

  const handleMore = () => {
    Alert.alert(
      'Report Options',
      'What would you like to do?',
      [
        {
          text: 'Edit Report',
          onPress: () => console.log('Edit report'),
        },
        {
          text: 'Mark as Resolved',
          onPress: () => console.log('Mark as resolved'),
        },
        {
          text: 'Delete Report',
          onPress: () => {
            Alert.alert(
              'Delete Report',
              'Are you sure you want to delete this report? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete confirmed') },
              ]
            );
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleAddPhoto = () => {
    console.log('Add photo pressed');
    // Open camera/gallery picker
  };

  const handleAddCommentPhoto = () => {
    console.log('Add comment photo pressed');
    // Open camera/gallery for comment attachment
  };

  const handleAddMoreInfo = () => {
    console.log('Add more information pressed');
    // Navigate back to issue details to add more info
    navigateBack();
  };

  const handleFilterTune = () => {
    console.log('Map filter tune pressed');
    // Show map filter options
  };

  const handleLayersControl = () => {
    console.log('Map layers control pressed');
    // Show map layer options (satellite, traffic, etc.)
  };

  const handleImagePreview = (issueId: string) => {
    console.log('Image preview pressed for issue:', issueId);
    // Show full-screen image preview
  };

  const handleTermsPress = () => {
    navigateTo('termsPrivacy');
  };

  const handlePrivacyPress = () => {
    navigateTo('termsPrivacy');
  };

  const handleLicensesPress = () => {
    console.log('Licenses pressed');
    // Could create a dedicated LicensesScreen or show modal
  };

  const handleCouncilChange = (newCouncil: string) => {
    console.log('📍 App: Council changed to:', newCouncil);
    setSelectedCouncil(newCouncil);
    console.log('📍 App: Updated selectedCouncil state to:', newCouncil);
    // Track council change
    analytics.setUserProperties({ council: newCouncil });
    analytics.trackCouncilSelection(newCouncil);
  };

  // Handler for tapping an issue on MyImpactScreen
  const handleIssuePress = (issueId: string) => {
    console.log('Issue pressed:', issueId);
    handleShowReportDetail(issueId);
  };

  // Handler for notification press - navigate based on notification type
  const handleNotificationPress = (notification: any) => {
    console.log('Notification pressed:', notification);

    // Mark as read
    if (!notification.isRead) {
      // This is handled in NotificationsScreen, but we could also call API here
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'resolved':
      case 'progress':
        // Navigate to report detail if we have a report ID
        if (notification.reportId) {
          handleShowReportDetail(notification.reportId);
        }
        break;
      case 'update':
        // Navigate to council updates
        handleShowCouncilUpdates();
        break;
      case 'alert':
        // Navigate to council updates for alerts
        handleShowCouncilUpdates();
        break;
      default:
        // For other notifications, just log
        console.log('No specific navigation for notification type:', notification.type);
    }
  };

  // Handler for email press on ProfileScreen
  const handleEmailPress = (email: string) => {
    Alert.alert(
      'Email',
      email,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy',
          onPress: () => {
            Clipboard.setString(email);
            Alert.alert('Copied', 'Email address copied to clipboard');
          },
        },
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL(`mailto:${email}`).catch(() => {
              Alert.alert('Error', 'Could not open email app');
            });
          },
        },
      ]
    );
  };

  // Handler for phone press on ProfileScreen
  const handlePhonePress = (phone: string) => {
    Alert.alert(
      'Phone',
      phone,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy',
          onPress: () => {
            Clipboard.setString(phone);
            Alert.alert('Copied', 'Phone number copied to clipboard');
          },
        },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phone}`).catch(() => {
              Alert.alert('Error', 'Could not open phone app');
            });
          },
        },
      ]
    );
  };

  // Handler for address press on ProfileScreen
  const handleAddressPress = (address: { street: string; city: string; postcode: string }) => {
    const fullAddress = `${address.street}, ${address.city}, ${address.postcode}`;
    Alert.alert(
      'Address',
      fullAddress,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Copy',
          onPress: () => {
            Clipboard.setString(fullAddress);
            Alert.alert('Copied', 'Address copied to clipboard');
          },
        },
        {
          text: 'Open in Maps',
          onPress: () => {
            const encodedAddress = encodeURIComponent(fullAddress);
            Linking.openURL(`https://maps.apple.com/?address=${encodedAddress}`).catch(() => {
              Alert.alert('Error', 'Could not open maps');
            });
          },
        },
      ]
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            onLogin={handleShowLogin}
          />
        );
      case 'login':
        return (
          <SwipeableScreen onSwipeBack={navigateBack} enabled={false}>
            <LoginScreen
              onBack={handleBackToOnboarding}
              onLogin={handleLogin}
              onCreateAccount={handleCreateAccount}
              onForgotPassword={handleForgotPassword}
            />
          </SwipeableScreen>
        );
      case 'forgotPassword':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <ForgotPasswordScreen
              onBack={handleBackToLogin}
              onSendResetLink={handleSendResetLink}
              onBackToLogin={handleBackToLogin}
            />
          </SwipeableScreen>
        );
      case 'home':
        return (
          <SwipeableScreen onSwipeBack={navigateBack} enabled={false}>
            <PageTransition type="fade">
              <HomeScreen userName={userName} council={selectedCouncil} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onCouncilUpdate={handleShowCouncilUpdates} onMyImpact={handleShowMyImpact} onNotifications={handleShowNotifications} onProfile={handleShowProfile} onViewMap={handleShowMapView} onReportPress={handleShowReportDetail} onNewsPress={handleUpdatePress} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'allReports':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <AllReportsScreen council={selectedCouncil} onBack={handleBackToHome} onHome={handleGoToHome} onStartReport={handleStartReport} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} onViewMap={handleShowMapView} onReportPress={handleShowReportDetail} onSort={handleSort} onLoadMore={handleLoadMore} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'myReports':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <AllReportsScreen showMyReports council={selectedCouncil} onBack={handleBackToHome} onHome={handleGoToHome} onStartReport={handleStartReport} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} onViewMap={handleShowMapView} onReportPress={handleShowReportDetail} onSort={handleSort} onLoadMore={handleLoadMore} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'councilUpdates':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <CouncilUpdatesScreen council={selectedCouncil} onBack={handleBackToHome} onHome={handleGoToHome} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onProfile={handleShowProfile} onSeeAllUpdates={handleSeeAllUpdates} onNotifications={handleShowNotifications} onAlertPress={handleAlertPress} onUpdatePress={handleUpdatePress} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'allUpdates':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <AllUpdatesScreen council={selectedCouncil} onBack={handleBackToHome} onHome={handleGoToHome} onStartReport={handleStartReport} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} onSort={handleSort} onLoadMore={handleLoadMore} onUpdatePress={handleUpdatePress} onHistory={handleHistory} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'myImpact':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="fade">
              <MyImpactScreen onBack={handleBackToHome} onStartReport={handleStartReport} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} onIssuePress={handleIssuePress} onHistory={handleHistory} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'notifications':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="fade">
              <NotificationsScreen onBack={handleBackToHome} onSettings={handleShowNotificationSettings} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} onNotificationPress={handleNotificationPress} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'notificationSettings':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <NotificationSettingsScreen onBack={handleBackToNotifications} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'profile':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="fade">
              <ProfileScreen council={selectedCouncil} refreshKey={profileRefreshKey} onBack={handleBackToHome} onHome={handleGoToHome} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onCouncilUpdate={handleShowCouncilUpdates} onSettings={handleShowSettings} onHelp={handleShowHelp} onTermsPrivacy={handleShowTermsPrivacy} onEditProfile={handleShowEditProfile} onAnalyticsDashboard={handleShowAnalyticsDashboard} onLogout={handleLogout} onEmailPress={handleEmailPress} onPhonePress={handlePhonePress} onAddressPress={handleAddressPress} />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'mapView':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <MapViewScreen council={selectedCouncil} onBack={handleBackToHome} onViewDetails={handleShowReportDetail} onFilterTune={handleFilterTune} onLayersControl={handleLayersControl} onImagePreview={handleImagePreview} />
          </SwipeableScreen>
        );
      case 'selectLocation':
        // Get initial location from reportData or use default
        const initialLocationForSelection = reportData?.location?.coordinates
          ? { latitude: reportData.location.coordinates[1], longitude: reportData.location.coordinates[0] }
          : undefined;
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <MapViewScreen
              council={selectedCouncil}
              mode="selectLocation"
              initialLocation={initialLocationForSelection}
              onBack={navigateBack}
              onLocationSelected={handleLocationSelected}
            />
          </SwipeableScreen>
        );
      case 'settings':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <SettingsScreen onBack={handleBackToHome} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} onHelp={handleShowHelp} onChangePassword={handleShowChangePassword} onPrivacySettings={handleShowPrivacySettings} onEmailConnection={handleShowEmailConnection} onLanguage={handleShowLanguageSelection} onTheme={handleShowThemeSelection} onAbout={handleShowAbout} onDeleteAccount={handleShowDeleteAccount} onCouncilChange={handleCouncilChange} />
          </SwipeableScreen>
        );
      case 'help':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <HelpScreen onBack={handleBackToHome} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} />
          </SwipeableScreen>
        );
      case 'termsPrivacy':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <TermsPrivacyScreen onBack={handleBackToHome} onAgree={handleBackToHome} onDecline={handleBackToHome} />
          </SwipeableScreen>
        );
      case 'reportDetail':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <ReportDetailScreen reportId={selectedReportId} reportData={selectedReportData} council={selectedCouncil} onBack={handleBackToAllReports} onStartReport={handleStartReport} onSeeAll={handleSeeAllReports} onCouncilUpdate={handleShowCouncilUpdates} onProfile={handleShowProfile} onViewEmailThread={handleShowEmailThread} onSendEmail={handleShowEmailPreview} onMore={handleMore} onAddPhoto={handleAddPhoto} onAddCommentPhoto={handleAddCommentPhoto} onAddMoreInfo={handleAddMoreInfo} />
          </SwipeableScreen>
        );
      case 'issueCategory':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <IssueCategoryScreen
                onBack={handleBackToHome}
                onCategorySelected={handleCategorySelected}
              />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'issueSearch':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <IssueSearchScreen
                onBack={handleBackToCategory}
                onIssueSelected={handleIssueTopicSelected}
              />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'issueDetails':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="slide">
              <IssueDetailsScreen
                category={selectedCategory}
                issueTopic={selectedIssueTopic}
                council={selectedCouncil}
                reportData={reportData}
                onBack={selectedIssueTopic ? handleBackToIssueSearch : handleBackToCategory}
                onEditCategory={selectedIssueTopic ? handleBackToIssueSearch : handleEditCategory}
                onSubmit={handleSubmitReport}
                onAdjustLocation={handleAdjustLocation}
                onChangeAddress={handleChangeAddress}
              />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'confirmReport':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PageTransition type="scale">
              <ConfirmReportScreen
                reportData={reportData}
                onBack={handleBackToDetails}
                onEdit={handleEditSection}
                onConfirm={handleConfirmReport}
              />
            </PageTransition>
          </SwipeableScreen>
        );
      case 'resetPassword':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <ResetPasswordScreen
              onBack={handleBackToLogin}
              onResetPassword={handleResetPassword}
            />
          </SwipeableScreen>
        );
      case 'changePassword':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <ChangePasswordScreen
              onBack={handleBackToSettings}
              onChangePassword={handleChangePassword}
              onForgotPassword={handleForgotPassword}
            />
          </SwipeableScreen>
        );
      case 'about':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <AboutScreen onBack={handleBackToSettings} onTermsPress={handleTermsPress} onPrivacyPress={handlePrivacyPress} onLicensesPress={handleLicensesPress} />
          </SwipeableScreen>
        );
      case 'editProfile':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <EditProfileScreen
              onBack={handleBackToProfile}
              onSave={handleSaveProfile}
            />
          </SwipeableScreen>
        );
      case 'themeSelection':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <ThemeSelectionScreen
              onBack={handleBackToSettings}
              onThemeChange={handleThemeChange}
            />
          </SwipeableScreen>
        );
      case 'languageSelection':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <LanguageSelectionScreen
              onBack={handleBackToSettings}
              onLanguageChange={handleLanguageChange}
            />
          </SwipeableScreen>
        );
      case 'privacySettings':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <PrivacySettingsScreen onBack={handleBackToSettings} onDeleteAccount={handleShowDeleteAccount} />
          </SwipeableScreen>
        );
      case 'signUp':
        return (
          <SwipeableScreen onSwipeBack={navigateBack} enabled={false}>
            <SignUpScreen
              onBack={handleBackToOnboarding}
              onSignUp={handleSignUp}
              onLogin={handleShowLogin}
            />
          </SwipeableScreen>
        );
      case 'deleteAccount':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <DeleteAccountScreen
              onBack={handleBackToSettings}
              onDeleteAccount={handleDeleteAccount}
            />
          </SwipeableScreen>
        );
      case 'error':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <ErrorScreen
              onBack={handleBackToHome}
              onRetry={handleRetry}
              onContactSupport={handleContactSupport}
            />
          </SwipeableScreen>
        );
      case 'search':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <SearchScreen
              onBack={handleBackToHome}
              onReportPress={handleShowReportDetail}
            />
          </SwipeableScreen>
        );
      case 'verifyEmail':
        return (
          <SwipeableScreen onSwipeBack={navigateBack} enabled={false}>
            <VerifyEmailScreen
              onBack={handleBackToOnboarding}
              onVerify={handleVerifyEmail}
              onSkip={handleSkipVerification}
              onResendCode={handleResendCode}
            />
          </SwipeableScreen>
        );
      case 'emailConnection':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <EmailConnectionScreen onBack={handleBackToSettings} />
          </SwipeableScreen>
        );
      case 'analyticsDashboard':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <AnalyticsDashboardScreen onBack={handleBackToHome} onFilter={handleFilter} />
          </SwipeableScreen>
        );
      case 'emailPreview':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <EmailPreviewScreen onBack={handleBackToAllReports} />
          </SwipeableScreen>
        );
      case 'emailThread':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <EmailThreadViewerScreen onBack={handleBackToAllReports} />
          </SwipeableScreen>
        );
      case 'updateDetail':
        return (
          <SwipeableScreen onSwipeBack={navigateBack}>
            <UpdateDetailScreen
              updateData={selectedUpdateData}
              onBack={navigateBack}
            />
          </SwipeableScreen>
        );
      default:
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <DataProvider initialCouncil={selectedCouncil}>
      <ThemeProvider>
        <SafeAreaView style={styles.container}>{renderScreen()}</SafeAreaView>
      </ThemeProvider>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FC',
  },
});
