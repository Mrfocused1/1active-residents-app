import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';

interface UpdateDetailScreenProps {
  updateData?: {
    id: string;
    category?: string;
    categoryColor?: string;
    title: string;
    description?: string;
    summary?: string;
    content?: string;
    time?: string;
    date?: string;
    icon?: string;
    hasImage?: boolean;
    image?: string;
    source?: string;
    url?: string;
  };
  onBack?: () => void;
  onShare?: () => void;
}

const UpdateDetailScreen: React.FC<UpdateDetailScreenProps> = ({
  updateData,
  onBack,
  onShare,
}) => {
  const categoryColor = updateData?.categoryColor || '#5B7CFA';
  const icon = updateData?.icon || 'info';

  const handleOpenSource = () => {
    if (updateData?.url) {
      Linking.openURL(updateData.url);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[categoryColor + '15', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <MaterialIcons name="arrow-back" size={24} color="#333344" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {onShare && (
              <TouchableOpacity style={styles.iconButton} onPress={onShare} activeOpacity={0.8}>
                <MaterialIcons name="share" size={22} color="#333344" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Badge */}
        {updateData?.category && (
          <FadeIn delay={100}>
            <View style={styles.categoryBadgeContainer}>
              <LinearGradient
                colors={[categoryColor, categoryColor + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryBadge}
              >
                {updateData.icon && (
                  <MaterialIcons name={icon as any} size={14} color="#FFFFFF" />
                )}
                <Text style={styles.categoryText}>{updateData.category}</Text>
              </LinearGradient>
            </View>
          </FadeIn>
        )}

        {/* Title */}
        <FadeIn delay={200}>
          <Text style={styles.title}>{updateData?.title || 'Update'}</Text>
        </FadeIn>

        {/* Time & Source */}
        <SlideIn delay={300} from="bottom" distance={20}>
          <View style={styles.metaContainer}>
            {updateData?.time && (
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={16} color="#6B7280" />
                <Text style={styles.metaText}>{updateData.time || updateData.date}</Text>
              </View>
            )}
            {updateData?.source && (
              <View style={styles.metaItem}>
                <MaterialIcons name="source" size={16} color="#6B7280" />
                <Text style={styles.metaText}>{updateData.source}</Text>
              </View>
            )}
          </View>
        </SlideIn>

        {/* Image */}
        {updateData?.hasImage && updateData.image && (
          <SlideIn delay={400} from="bottom" distance={20}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: updateData.image }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </SlideIn>
        )}

        {/* Content */}
        <SlideIn delay={500} from="bottom" distance={20}>
          <View style={styles.contentCard}>
            {updateData?.summary && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryLabel}>Summary</Text>
                <Text style={styles.summaryText}>{updateData.summary}</Text>
              </View>
            )}

            {updateData?.description && (
              <Text style={styles.description}>
                {updateData.description}
              </Text>
            )}

            {updateData?.content && updateData.content !== updateData.description && (
              <Text style={styles.content}>{updateData.content}</Text>
            )}
          </View>
        </SlideIn>

        {/* Open Source Button */}
        {updateData?.url && (
          <SlideIn delay={600} from="bottom" distance={20}>
            <TouchableOpacity
              style={styles.sourceButton}
              onPress={handleOpenSource}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[categoryColor, categoryColor + 'DD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sourceButtonGradient}
              >
                <MaterialIcons name="open-in-new" size={20} color="#FFFFFF" />
                <Text style={styles.sourceButtonText}>View Full Article</Text>
              </LinearGradient>
            </TouchableOpacity>
          </SlideIn>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryBadgeContainer: {
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 28,
    fontWeight: '700',
    color: '#333344',
    lineHeight: 36,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333344',
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
  },
  sourceButton: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  sourceButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  sourceButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default UpdateDetailScreen;
