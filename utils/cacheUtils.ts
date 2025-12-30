/**
 * Cache Utilities
 * Helper functions for data caching and time formatting
 */

// Cache configuration
export const CACHE_CONFIG = {
  STALE_TIME: 60 * 60 * 1000,       // 1 hour - data considered stale, triggers background refresh
  MAX_AGE: 24 * 60 * 60 * 1000,     // 24 hours - force refetch
  REFRESH_INTERVAL: 60 * 60 * 1000, // 1 hour - auto-refresh interval
};

/**
 * Format a timestamp into a human-readable "time ago" string
 * @param date - Date object or timestamp
 * @returns String like "5 minutes ago", "1 hour ago", "Just now"
 */
export const formatTimeAgo = (date: Date | number | null): string => {
  if (!date) return 'Never';

  const timestamp = typeof date === 'number' ? date : date.getTime();
  const now = Date.now();
  const diffMs = now - timestamp;

  // Less than 1 minute
  if (diffMs < 60 * 1000) {
    return 'Just now';
  }

  // Less than 1 hour
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }

  // Less than 24 hours
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  // More than 24 hours
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
};

/**
 * Check if cache is still valid (not expired)
 * @param timestamp - Cache timestamp
 * @returns true if cache is valid (less than MAX_AGE)
 */
export const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false;
  const age = Date.now() - timestamp;
  return age < CACHE_CONFIG.MAX_AGE;
};

/**
 * Check if cache is stale (should refresh in background)
 * @param timestamp - Cache timestamp
 * @returns true if cache is stale (older than STALE_TIME)
 */
export const isCacheStale = (timestamp: number | null): boolean => {
  if (!timestamp) return true;
  const age = Date.now() - timestamp;
  return age > CACHE_CONFIG.STALE_TIME;
};

/**
 * Generate a cache key for a council
 * @param council - Council name
 * @param dataType - Type of data (councilData, reports, etc.)
 * @returns Cache key string
 */
export const getCacheKey = (council: string, dataType: string): string => {
  return `@cache_${council.toLowerCase().replace(/\s+/g, '_')}_${dataType}`;
};
