/**
 * Analytics Service
 *
 * Tracks user interactions and app usage
 * Console-based analytics for development (Expo Go compatible)
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean = true;

  /**
   * Initialize analytics
   */
  async initialize(): Promise<void> {
    console.log('Analytics initialized');
  }

  /**
   * Track a screen view
   */
  async trackScreenView(screenName: string): Promise<void> {
    if (!this.enabled) return;
    console.log(`📊 Screen View: ${screenName}`);
  }

  /**
   * Track a custom event
   */
  async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: new Date(),
    };

    this.events.push(event);
    console.log(`📊 Event: ${eventName}`, properties);
  }

  /**
   * Track report submission
   */
  trackReportSubmission(category: string, council: string): void {
    this.trackEvent('report_submitted', {
      category,
      council,
    });
  }

  /**
   * Track report view
   */
  trackReportView(reportId: string, council: string): void {
    this.trackEvent('report_viewed', {
      report_id: reportId,
      council,
    });
  }

  /**
   * Track search
   */
  trackSearch(query: string): void {
    this.trackEvent('search_performed', {
      query,
    });
  }

  /**
   * Track council selection
   */
  trackCouncilSelection(council: string): void {
    this.trackEvent('council_selected', {
      council,
    });
  }

  /**
   * Set user properties
   */
  async setUserProperties(properties: Record<string, any>): Promise<void> {
    if (!this.enabled) return;
    console.log('👤 User Properties:', properties);
  }

  /**
   * Set user ID
   */
  async setUserId(userId: string): Promise<void> {
    if (!this.enabled) return;
    console.log('👤 User ID:', userId);
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`Analytics ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get recent events (for debugging)
   */
  getRecentEvents(limit: number = 10): AnalyticsEvent[] {
    return this.events.slice(-limit);
  }
}

export default new AnalyticsService();
