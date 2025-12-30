/**
 * RefreshButton Component
 * Displays "Updated X minutes ago" with manual refresh button
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatTimeAgo } from '../utils/cacheUtils';

interface RefreshButtonProps {
  lastUpdated: Date | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  style,
  compact = false,
}) => {
  const timeAgoText = formatTimeAgo(lastUpdated);

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, style]}
        onPress={onRefresh}
        disabled={isRefreshing}
        activeOpacity={0.7}
      >
        {isRefreshing ? (
          <ActivityIndicator size="small" color="#5B7CFA" />
        ) : (
          <MaterialIcons name="refresh" size={20} color="#5B7CFA" />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onRefresh}
      disabled={isRefreshing}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isRefreshing ? (
          <>
            <ActivityIndicator size="small" color="#5B7CFA" style={styles.icon} />
            <Text style={styles.text}>Refreshing...</Text>
          </>
        ) : (
          <>
            <MaterialIcons name="refresh" size={16} color="#5B7CFA" style={styles.icon} />
            <Text style={styles.text}>Updated {timeAgoText}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  compactContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B7CFA',
  },
});

export default RefreshButton;
