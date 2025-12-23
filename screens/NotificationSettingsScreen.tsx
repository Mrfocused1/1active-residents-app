import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NotificationSettingsScreenProps {
  onBack?: () => void;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
}

interface NotificationCategory {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  isRequired?: boolean;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  onBack,
  onStartReport,
  onSeeAll,
  onCouncilUpdate,
  onProfile,
}) => {
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'alerts',
      icon: 'warning',
      iconBg: 'rgba(239, 68, 68, 0.1)',
      iconColor: '#EF4444',
      title: 'Alerts',
      subtitle: 'Urgent notices & emergencies',
      enabled: true,
    },
    {
      id: 'news',
      icon: 'article',
      iconBg: 'rgba(91, 124, 250, 0.1)',
      iconColor: '#5B7CFA',
      title: 'News',
      subtitle: 'Council news & announcements',
      enabled: true,
    },
    {
      id: 'roadworks',
      icon: 'construction',
      iconBg: 'rgba(255, 140, 102, 0.1)',
      iconColor: '#FF8C66',
      title: 'Roadworks',
      subtitle: 'Road closures & traffic updates',
      enabled: true,
    },
    {
      id: 'waste-collection',
      icon: 'recycling',
      iconBg: 'rgba(77, 182, 172, 0.1)',
      iconColor: '#4DB6AC',
      title: 'Waste & Recycling',
      subtitle: 'Collection schedule changes',
      enabled: true,
    },
    {
      id: 'events',
      icon: 'event',
      iconBg: 'rgba(156, 39, 176, 0.1)',
      iconColor: '#9C27B0',
      title: 'Events',
      subtitle: 'Community fairs & meetings',
      enabled: true,
    },
    {
      id: 'services',
      icon: 'room-service',
      iconBg: 'rgba(126, 140, 224, 0.1)',
      iconColor: '#7E8CE0',
      title: 'Services',
      subtitle: 'Council service updates',
      enabled: true,
    },
    {
      id: 'community',
      icon: 'groups',
      iconBg: 'rgba(77, 182, 172, 0.15)',
      iconColor: '#4DB6AC',
      title: 'Community',
      subtitle: 'Local initiatives & projects',
      enabled: true,
    },
    {
      id: 'environment',
      icon: 'eco',
      iconBg: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10B981',
      title: 'Environment',
      subtitle: 'Parks, green spaces & nature',
      enabled: true,
    },
    {
      id: 'transport',
      icon: 'directions-bus',
      iconBg: 'rgba(139, 92, 246, 0.1)',
      iconColor: '#8B5CF6',
      title: 'Transport',
      subtitle: 'Public transport updates',
      enabled: true,
    },
    {
      id: 'planning',
      icon: 'architecture',
      iconBg: 'rgba(255, 213, 114, 0.1)',
      iconColor: '#FFD572',
      title: 'Planning Applications',
      subtitle: 'New builds & developments',
      enabled: true,
    },
    {
      id: 'council-updates',
      icon: 'campaign',
      iconBg: 'rgba(91, 124, 250, 0.15)',
      iconColor: '#5B7CFA',
      title: 'Council Updates',
      subtitle: 'Policy changes & decisions',
      enabled: true,
    },
    {
      id: 'public-safety',
      icon: 'security',
      iconBg: 'rgba(239, 68, 68, 0.1)',
      iconColor: '#EF4444',
      title: 'Public Safety',
      subtitle: 'Safety notices & advisories',
      enabled: true,
    },
  ]);

  const handleToggle = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, enabled: !cat.enabled } : cat))
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <MaterialIcons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Preferences</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoBlob} />
          <View style={styles.infoContent}>
            <View style={styles.infoIcon}>
              <MaterialIcons name="notifications-active" size={24} color="#5B7CFA" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Stay in the Loop</Text>
              <Text style={styles.infoSubtitle}>
                Customize the alerts you receive from your local council.
              </Text>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Categories</Text>

        <View style={styles.categoriesList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => handleToggle(category.id)}
            >
              <View style={styles.categoryContent}>
                <View
                  style={[styles.categoryIcon, { backgroundColor: category.iconBg }]}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={24}
                    color={category.iconColor}
                  />
                </View>
                <View style={styles.categoryText}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                </View>
              </View>

              <Switch
                value={category.enabled}
                onValueChange={() => handleToggle(category.id)}
                trackColor={{ false: '#D1D5DB', true: '#5B7CFA' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D1D5DB"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Alerts Section */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <Text style={styles.emergencyTitle}>Emergency Alerts</Text>
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredBadgeText}>Required</Text>
            </View>
          </View>

          <View style={styles.emergencyCard}>
            <View style={styles.categoryContent}>
              <View style={styles.emergencyIcon}>
                <MaterialIcons name="warning" size={24} color="#EF4444" />
              </View>
              <View style={styles.categoryText}>
                <Text style={styles.categoryTitle}>Severe Weather</Text>
                <Text style={styles.categorySubtitle}>Floods & extreme conditions</Text>
              </View>
            </View>

            <Switch
              value={true}
              disabled={true}
              trackColor={{ false: '#D1D5DB', true: '#9CA3AF' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Bottom spacing for nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navContainer}>
        <View style={styles.navGradient} />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onBack}>
            <MaterialIcons name="home" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onCouncilUpdate}>
            <MaterialIcons name="chat-bubble-outline" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>Updates</Text>
          </TouchableOpacity>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <TouchableOpacity style={styles.navFab} activeOpacity={0.9} onPress={onStartReport}>
              <MaterialIcons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onSeeAll}>
            <MaterialIcons name="history" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onProfile}>
            <MaterialIcons name="person-outline" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 24,
    fontWeight: '700',
    color: '#333344',
  },

  // Info Card
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoBlob: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    borderRadius: 48,
  },
  infoContent: {
    flexDirection: 'row',
    gap: 16,
    position: 'relative',
    zIndex: 10,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(91, 124, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Categories Section
  sectionTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 16,
    paddingLeft: 4,
  },
  categoriesList: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Emergency Section
  emergencySection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  emergencyTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
  },
  requiredBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom Navigation
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    pointerEvents: 'box-none',
  },
  navGradient: {
    height: 128,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  navBar: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#5B7CFA',
  },
  navFabContainer: {
    position: 'relative',
    top: -32,
  },
  navFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B7CFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
});

export default NotificationSettingsScreen;
