/**
 * useCouncilData Hook
 * Custom hook for consuming cached council data
 */

import { useState, useEffect, useCallback } from 'react';
import { useDataContext } from '../contexts/DataContext';
import { CouncilData } from '../services/dataAggregator.service';
import { isCacheValid } from '../utils/cacheUtils';

export interface UseCouncilDataOptions {
  includeReports?: boolean;
  includeNews?: boolean;
  includeUpdates?: boolean;
  includeDepartments?: boolean;
  maxReports?: number;
  maxNews?: number;
}

export interface UseCouncilDataResult {
  data: CouncilData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isStale: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching and caching council data
 * @param council - Council name
 * @param options - Fetch options
 * @returns Cached data, loading state, and refresh function
 */
export const useCouncilData = (
  council: string,
  options: UseCouncilDataOptions = {}
): UseCouncilDataResult => {
  const {
    fetchCouncilData,
    getCouncilDataCache,
    getLastUpdated,
    isRefreshing,
    error: contextError,
  } = useDataContext();

  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Get cached data
  const cachedData = getCouncilDataCache(council);
  const lastUpdatedTimestamp = getLastUpdated(council, 'councilData');
  const lastUpdated = lastUpdatedTimestamp ? new Date(lastUpdatedTimestamp) : null;
  const isStale = !lastUpdatedTimestamp || !isCacheValid(lastUpdatedTimestamp);

  // Fetch data on mount if not cached
  useEffect(() => {
    const loadData = async () => {
      // Skip if we already have valid cached data
      if (cachedData && !isStale) {
        setInitialLoadDone(true);
        return;
      }

      setLoading(true);
      try {
        await fetchCouncilData(council, options);
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
      await fetchCouncilData(council, options, true);
    } finally {
      setLoading(false);
    }
  }, [council, options, fetchCouncilData]);

  return {
    data: cachedData,
    loading: loading || (isRefreshing && !cachedData),
    error: contextError,
    lastUpdated,
    isStale,
    refresh,
  };
};

export default useCouncilData;
