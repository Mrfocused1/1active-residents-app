/**
 * useRecentReports Hook
 * Custom hook for consuming cached map reports
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDataContext } from '../contexts/DataContext';
import { AggregatedReport } from '../services/dataAggregator.service';
import { isCacheValid } from '../utils/cacheUtils';

export interface UseRecentReportsOptions {
  status?: string;
  limit?: number;
}

export interface UseRecentReportsResult {
  reports: AggregatedReport[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isStale: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching and caching recent reports for map view
 * @param council - Council name
 * @param options - Fetch options (status filter, limit)
 * @returns Cached reports, loading state, and refresh function
 */
export const useRecentReports = (
  council: string,
  options: UseRecentReportsOptions = {}
): UseRecentReportsResult => {
  const {
    fetchRecentReports,
    getRecentReportsCache,
    getLastUpdated,
    isRefreshing,
    error: contextError,
  } = useDataContext();

  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Get cached data
  const cachedReports = getRecentReportsCache(council);
  const lastUpdatedTimestamp = getLastUpdated(council, 'recentReports');
  const lastUpdated = lastUpdatedTimestamp ? new Date(lastUpdatedTimestamp) : null;
  const isStale = !lastUpdatedTimestamp || !isCacheValid(lastUpdatedTimestamp);

  // Filter and limit reports based on options
  const filteredReports = useMemo(() => {
    if (!cachedReports) return [];

    let result = cachedReports;

    // Filter by status
    if (options.status && options.status !== 'all') {
      result = result.filter(r => r.status === options.status);
    }

    // Apply limit
    if (options.limit) {
      result = result.slice(0, options.limit);
    }

    return result;
  }, [cachedReports, options.status, options.limit]);

  // Fetch data on mount if not cached
  useEffect(() => {
    const loadData = async () => {
      // Skip if we already have valid cached data
      if (cachedReports && !isStale) {
        setInitialLoadDone(true);
        return;
      }

      setLoading(true);
      try {
        await fetchRecentReports(council, options.status);
      } finally {
        setLoading(false);
        setInitialLoadDone(true);
      }
    };

    loadData();
  }, [council]); // Only refetch when council changes

  // Manual refresh function
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await fetchRecentReports(council, options.status, true);
    } finally {
      setLoading(false);
    }
  }, [council, options.status, fetchRecentReports]);

  return {
    reports: filteredReports,
    loading: loading || (isRefreshing && !cachedReports),
    error: contextError,
    lastUpdated,
    isStale,
    refresh,
  };
};

export default useRecentReports;
