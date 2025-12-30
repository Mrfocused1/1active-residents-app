/**
 * DataContext - Centralized data caching and state management
 * Provides cached council data across all screens with auto-refresh
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCouncilData, CouncilData, AggregatedReport } from '../services/dataAggregator.service';
import { getRecentReports } from '../services/fixmystreet.service';
import { CACHE_CONFIG, isCacheValid, isCacheStale, getCacheKey } from '../utils/cacheUtils';

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Per-council cache
interface CouncilCache {
  councilData: CacheEntry<CouncilData> | null;
  recentReports: CacheEntry<AggregatedReport[]> | null;
}

// Context state
interface DataContextState {
  cache: Record<string, CouncilCache>;
  currentCouncil: string;
  isRefreshing: boolean;
  error: string | null;
}

// Context value (state + actions)
interface DataContextValue extends DataContextState {
  // Actions
  setCurrentCouncil: (council: string) => void;
  fetchCouncilData: (council: string, options?: CouncilDataOptions, forceRefresh?: boolean) => Promise<CouncilData | null>;
  fetchRecentReports: (council: string, status?: string, forceRefresh?: boolean) => Promise<AggregatedReport[]>;
  refreshAll: () => Promise<void>;
  clearCache: (council?: string) => void;

  // Getters
  getCouncilDataCache: (council: string) => CouncilData | null;
  getRecentReportsCache: (council: string) => AggregatedReport[] | null;
  getLastUpdated: (council: string, dataType: 'councilData' | 'recentReports') => number | null;
}

interface CouncilDataOptions {
  includeReports?: boolean;
  includeNews?: boolean;
  includeUpdates?: boolean;
  includeDepartments?: boolean;
  maxReports?: number;
  maxNews?: number;
}

// Storage keys
const CACHE_STORAGE_KEY = '@data_cache';

// Create context
const DataContext = createContext<DataContextValue | undefined>(undefined);

// Provider props
interface DataProviderProps {
  children: React.ReactNode;
  initialCouncil?: string;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  initialCouncil = 'Camden'
}) => {
  const [cache, setCache] = useState<Record<string, CouncilCache>>({});
  const [currentCouncil, setCurrentCouncil] = useState(initialCouncil);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Initialize cache from AsyncStorage on mount
  useEffect(() => {
    loadCacheFromStorage();
  }, []);

  // Set up auto-refresh timer
  useEffect(() => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Set up hourly refresh
    refreshTimerRef.current = setInterval(() => {
      if (appStateRef.current === 'active') {
        console.log('[DataContext] Auto-refresh triggered');
        refreshAll();
      }
    }, CACHE_CONFIG.REFRESH_INTERVAL);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [currentCouncil]);

  // Handle app state changes (refresh when returning to foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to foreground
        const councilCache = cache[currentCouncil];
        const lastUpdated = councilCache?.councilData?.timestamp;

        if (isCacheStale(lastUpdated)) {
          console.log('[DataContext] App resumed with stale cache, refreshing...');
          refreshAll();
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [currentCouncil, cache]);

  // Persist cache to AsyncStorage when it changes
  useEffect(() => {
    persistCacheToStorage();
  }, [cache]);

  // Load cache from AsyncStorage
  const loadCacheFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate cache entries
        const validCache: Record<string, CouncilCache> = {};
        for (const [council, councilCache] of Object.entries(parsed)) {
          const cc = councilCache as CouncilCache;
          if (cc.councilData && isCacheValid(cc.councilData.timestamp)) {
            validCache[council] = cc;
          }
        }
        setCache(validCache);
        console.log('[DataContext] Loaded cache from storage');
      }
    } catch (err) {
      console.error('[DataContext] Failed to load cache:', err);
    }
  };

  // Persist cache to AsyncStorage
  const persistCacheToStorage = async () => {
    try {
      await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
    } catch (err) {
      console.error('[DataContext] Failed to persist cache:', err);
    }
  };

  // Initialize cache for a council if not exists
  const initCouncilCache = (council: string) => {
    if (!cache[council]) {
      setCache(prev => ({
        ...prev,
        [council]: {
          councilData: null,
          recentReports: null,
        }
      }));
    }
  };

  // Fetch council data (with caching)
  const fetchCouncilData = useCallback(async (
    council: string,
    options: CouncilDataOptions = {},
    forceRefresh: boolean = false
  ): Promise<CouncilData | null> => {
    initCouncilCache(council);

    const councilCache = cache[council];
    const cachedEntry = councilCache?.councilData;

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cachedEntry && isCacheValid(cachedEntry.timestamp)) {
      console.log(`[DataContext] Using cached council data for ${council}`);
      return cachedEntry.data;
    }

    // Fetch fresh data
    try {
      setIsRefreshing(true);
      setError(null);

      console.log(`[DataContext] Fetching fresh council data for ${council}`);
      const data = await getCouncilData(council, {
        includeReports: options.includeReports ?? true,
        includeNews: options.includeNews ?? true,
        includeUpdates: options.includeUpdates ?? true,
        includeDepartments: options.includeDepartments ?? false,
        maxReports: options.maxReports ?? 20,
        maxNews: options.maxNews ?? 10,
      });

      // Update cache
      setCache(prev => ({
        ...prev,
        [council]: {
          ...prev[council],
          councilData: {
            data,
            timestamp: Date.now(),
          }
        }
      }));

      return data;
    } catch (err) {
      console.error(`[DataContext] Failed to fetch council data for ${council}:`, err);
      setError('Failed to load data. Please try again.');

      // Return stale cache if available
      if (cachedEntry) {
        return cachedEntry.data;
      }
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [cache]);

  // Fetch recent reports for map (with caching)
  const fetchRecentReports = useCallback(async (
    council: string,
    status?: string,
    forceRefresh: boolean = false
  ): Promise<AggregatedReport[]> => {
    initCouncilCache(council);

    const councilCache = cache[council];
    const cachedEntry = councilCache?.recentReports;

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cachedEntry && isCacheValid(cachedEntry.timestamp)) {
      console.log(`[DataContext] Using cached reports for ${council}`);
      // Filter by status if provided
      if (status && status !== 'all') {
        return cachedEntry.data.filter(r => r.status === status);
      }
      return cachedEntry.data;
    }

    // Fetch fresh data
    try {
      setIsRefreshing(true);
      setError(null);

      console.log(`[DataContext] Fetching fresh reports for ${council}`);
      const reports = await getRecentReports(council, undefined, 100);

      // Update cache
      setCache(prev => ({
        ...prev,
        [council]: {
          ...prev[council],
          recentReports: {
            data: reports,
            timestamp: Date.now(),
          }
        }
      }));

      // Filter by status if provided
      if (status && status !== 'all') {
        return reports.filter(r => r.status === status);
      }
      return reports;
    } catch (err) {
      console.error(`[DataContext] Failed to fetch reports for ${council}:`, err);
      setError('Failed to load reports. Please try again.');

      // Return stale cache if available
      if (cachedEntry) {
        if (status && status !== 'all') {
          return cachedEntry.data.filter(r => r.status === status);
        }
        return cachedEntry.data;
      }
      return [];
    } finally {
      setIsRefreshing(false);
    }
  }, [cache]);

  // Refresh all data for current council
  const refreshAll = useCallback(async () => {
    console.log(`[DataContext] Refreshing all data for ${currentCouncil}`);
    setIsRefreshing(true);

    try {
      await Promise.all([
        fetchCouncilData(currentCouncil, {}, true),
        fetchRecentReports(currentCouncil, undefined, true),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [currentCouncil, fetchCouncilData, fetchRecentReports]);

  // Clear cache
  const clearCache = useCallback((council?: string) => {
    if (council) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[council];
        return newCache;
      });
    } else {
      setCache({});
      AsyncStorage.removeItem(CACHE_STORAGE_KEY);
    }
  }, []);

  // Get cached council data
  const getCouncilDataCache = useCallback((council: string): CouncilData | null => {
    return cache[council]?.councilData?.data || null;
  }, [cache]);

  // Get cached recent reports
  const getRecentReportsCache = useCallback((council: string): AggregatedReport[] | null => {
    return cache[council]?.recentReports?.data || null;
  }, [cache]);

  // Get last updated timestamp
  const getLastUpdated = useCallback((
    council: string,
    dataType: 'councilData' | 'recentReports'
  ): number | null => {
    return cache[council]?.[dataType]?.timestamp || null;
  }, [cache]);

  const value: DataContextValue = {
    cache,
    currentCouncil,
    isRefreshing,
    error,
    setCurrentCouncil,
    fetchCouncilData,
    fetchRecentReports,
    refreshAll,
    clearCache,
    getCouncilDataCache,
    getRecentReportsCache,
    getLastUpdated,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use data context
export const useDataContext = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
