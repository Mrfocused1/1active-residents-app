/**
 * Crash Reporting Service
 *
 * Captures and reports application crashes and errors
 * Console-based error reporting for development (Expo Go compatible)
 */

import * as Device from 'expo-device';

interface ErrorContext {
  userId?: string;
  council?: string;
  screen?: string;
  [key: string]: any;
}

class CrashReportingService {
  private context: ErrorContext = {};
  private enabled: boolean = true;

  /**
   * Initialize crash reporting
   */
  async initialize(): Promise<void> {
    if (!this.enabled) return;

    try {
      // Set device context
      this.setContext('device', {
        model: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
        brand: Device.brand,
      });

      console.log('🛡️ Crash reporting initialized');
    } catch (error) {
      console.error('Failed to initialize crash reporting:', error);
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: ErrorContext): void {
    if (!this.enabled) return;

    console.error('❌ Exception captured:', error);
    console.error('Context:', { ...this.context, ...context });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext): void {
    if (!this.enabled) return;

    console.log(`📝 Message (${level}):`, message);
    console.log('Context:', { ...this.context, ...context });
  }

  /**
   * Set global context
   */
  setContext(key: string, value: any): void {
    this.context[key] = value;
  }

  /**
   * Set user context
   */
  setUser(user: { id?: string; email?: string; username?: string; [key: string]: any }): void {
    this.context.userId = user.id;
    console.log('👤 User context set:', user);
  }

  /**
   * Add breadcrumb (navigation trail)
   */
  addBreadcrumb(message: string, category: string = 'action', data?: Record<string, any>): void {
    if (!this.enabled) return;
    console.log(`🍞 Breadcrumb [${category}]:`, message, data);
  }

  /**
   * Enable/disable crash reporting
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`Crash reporting ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Test crash reporting
   */
  testCrash(): void {
    console.log('⚠️ Testing crash reporting...');
    this.captureException(new Error('Test crash from CrashReportingService'));
  }
}

export default new CrashReportingService();
