import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { FadeIn, SlideIn, ScalePress } from '../components/animations';

interface IssueCategoryScreenProps {
  onBack?: () => void;
  onCategorySelected?: (category: string) => void;
}

// Define gradients for each category
const categoryGradients: Record<string, { colors: readonly [string, string], icon: string, iconColor: string, bgColor: string }> = {
  roads: {
    colors: ['#3B82F6', '#4F46E5'],
    icon: 'edit-road',
    iconColor: '#3B82F6',
    bgColor: '#DBEAFE',
  },
  rubbish: {
    colors: ['#10B981', '#059669'],
    icon: 'recycling',
    iconColor: '#059669',
    bgColor: '#ECFDF5',
  },
  lighting: {
    colors: ['#F59E0B', '#D97706'],
    icon: 'lightbulb',
    iconColor: '#D97706',
    bgColor: '#FEF3C7',
  },
  parks: {
    colors: ['#34D399', '#10B981'],
    icon: 'park',
    iconColor: '#059669',
    bgColor: '#D1FAE5',
  },
  noise: {
    colors: ['#A855F7', '#9333EA'],
    icon: 'volume-up',
    iconColor: '#9333EA',
    bgColor: '#F3E8FF',
  },
  graffiti: {
    colors: ['#EC4899', '#DB2777'],
    icon: 'brush',
    iconColor: '#DB2777',
    bgColor: '#FCE7F3',
  },
  parking: {
    colors: ['#F97316', '#EA580C'],
    icon: 'local-parking',
    iconColor: '#EA580C',
    bgColor: '#FFEDD5',
  },
  other: {
    colors: ['#6B7280', '#4B5563'],
    icon: 'more-horiz',
    iconColor: '#6B7280',
    bgColor: '#E5E7EB',
  },
};

const IssueCategoryScreen: React.FC<IssueCategoryScreenProps> = ({
  onBack,
  onCategorySelected,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    if (onCategorySelected) {
      onCategorySelected(category);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <FadeIn delay={100}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <ScalePress onPress={onBack}>
              <View style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#1E293B" />
              </View>
            </ScalePress>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>STEP 1 OF 3</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.title}>
            What needs{'\n'}fixing?
          </Text>
          <Text style={styles.subtitle}>
            Select the category that best matches the issue you want to report.
          </Text>
        </View>
      </FadeIn>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Common Issues Section */}
        <SlideIn delay={200}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Common Issues</Text>
            <MaterialIcons name="auto-awesome" size={20} color="#3B82F6" />
          </View>
        </SlideIn>

        <View style={styles.commonIssuesList}>
          {/* Roads & Pavements */}
          <FadeIn delay={300}>
            <ScalePress onPress={() => handleCategoryPress('roads')}>
              {selectedCategory === 'roads' ? (
                <View style={styles.featuredCard}>
                  <LinearGradient
                    colors={categoryGradients.roads.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featuredGradient}
                  >
                    <View style={styles.featuredBlob1} />
                    <View style={styles.featuredBlob2} />
                    <View style={styles.featuredContent}>
                      <View style={styles.featuredLeft}>
                        <View style={styles.featuredIcon}>
                          <MaterialIcons name={categoryGradients.roads.icon as any} size={28} color="#FFFFFF" />
                        </View>
                        <View>
                          <Text style={styles.featuredTitle}>Roads & Pavements</Text>
                          <Text style={styles.featuredSubtitle}>Potholes, cracks, markings</Text>
                        </View>
                      </View>
                      <MaterialIcons name="arrow-forward-ios" size={20} color="rgba(255, 255, 255, 0.7)" />
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View style={styles.categoryCard}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryGradients.roads.bgColor }]}>
                      <MaterialIcons name={categoryGradients.roads.icon as any} size={24} color={categoryGradients.roads.iconColor} />
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryTitle}>Roads & Pavements</Text>
                      <Text style={styles.categorySubtitle}>Potholes, cracks, markings</Text>
                    </View>
                  </View>
                  <View style={styles.categoryChevronBg}>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </View>
              )}
            </ScalePress>
          </FadeIn>

          {/* Rubbish & Recycling */}
          <FadeIn delay={350}>
            <ScalePress onPress={() => handleCategoryPress('rubbish')}>
              {selectedCategory === 'rubbish' ? (
                <View style={styles.featuredCard}>
                  <LinearGradient
                    colors={categoryGradients.rubbish.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featuredGradient}
                  >
                    <View style={styles.featuredBlob1} />
                    <View style={styles.featuredBlob2} />
                    <View style={styles.featuredContent}>
                      <View style={styles.featuredLeft}>
                        <View style={styles.featuredIcon}>
                          <MaterialIcons name={categoryGradients.rubbish.icon as any} size={28} color="#FFFFFF" />
                        </View>
                        <View>
                          <Text style={styles.featuredTitle}>Rubbish & Recycling</Text>
                          <Text style={styles.featuredSubtitle}>Missed bins, fly-tipping</Text>
                        </View>
                      </View>
                      <MaterialIcons name="arrow-forward-ios" size={20} color="rgba(255, 255, 255, 0.7)" />
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View style={styles.categoryCard}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryGradients.rubbish.bgColor }]}>
                      <MaterialIcons name={categoryGradients.rubbish.icon as any} size={24} color={categoryGradients.rubbish.iconColor} />
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryTitle}>Rubbish & Recycling</Text>
                      <Text style={styles.categorySubtitle}>Missed bins, fly-tipping</Text>
                    </View>
                  </View>
                  <View style={styles.categoryChevronBg}>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </View>
              )}
            </ScalePress>
          </FadeIn>

          {/* Street Lighting */}
          <FadeIn delay={400}>
            <ScalePress onPress={() => handleCategoryPress('lighting')}>
              {selectedCategory === 'lighting' ? (
                <View style={styles.featuredCard}>
                  <LinearGradient
                    colors={categoryGradients.lighting.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featuredGradient}
                  >
                    <View style={styles.featuredBlob1} />
                    <View style={styles.featuredBlob2} />
                    <View style={styles.featuredContent}>
                      <View style={styles.featuredLeft}>
                        <View style={styles.featuredIcon}>
                          <MaterialIcons name={categoryGradients.lighting.icon as any} size={28} color="#FFFFFF" />
                        </View>
                        <View>
                          <Text style={styles.featuredTitle}>Street Lighting</Text>
                          <Text style={styles.featuredSubtitle}>Broken lamps, dark areas</Text>
                        </View>
                      </View>
                      <MaterialIcons name="arrow-forward-ios" size={20} color="rgba(255, 255, 255, 0.7)" />
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View style={styles.categoryCard}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryGradients.lighting.bgColor }]}>
                      <MaterialIcons name={categoryGradients.lighting.icon as any} size={24} color={categoryGradients.lighting.iconColor} />
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryTitle}>Street Lighting</Text>
                      <Text style={styles.categorySubtitle}>Broken lamps, dark areas</Text>
                    </View>
                  </View>
                  <View style={styles.categoryChevronBg}>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </View>
              )}
            </ScalePress>
          </FadeIn>

          {/* Parks & Green Spaces */}
          <FadeIn delay={450}>
            <ScalePress onPress={() => handleCategoryPress('parks')}>
              {selectedCategory === 'parks' ? (
                <View style={styles.featuredCard}>
                  <LinearGradient
                    colors={categoryGradients.parks.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featuredGradient}
                  >
                    <View style={styles.featuredBlob1} />
                    <View style={styles.featuredBlob2} />
                    <View style={styles.featuredContent}>
                      <View style={styles.featuredLeft}>
                        <View style={styles.featuredIcon}>
                          <MaterialIcons name={categoryGradients.parks.icon as any} size={28} color="#FFFFFF" />
                        </View>
                        <View>
                          <Text style={styles.featuredTitle}>Parks & Green Spaces</Text>
                          <Text style={styles.featuredSubtitle}>Overgrown grass, damaged benches</Text>
                        </View>
                      </View>
                      <MaterialIcons name="arrow-forward-ios" size={20} color="rgba(255, 255, 255, 0.7)" />
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <View style={styles.categoryCard}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryIcon, { backgroundColor: categoryGradients.parks.bgColor }]}>
                      <MaterialIcons name={categoryGradients.parks.icon as any} size={24} color={categoryGradients.parks.iconColor} />
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryTitle}>Parks & Green Spaces</Text>
                      <Text style={styles.categorySubtitle}>Overgrown grass, damaged benches</Text>
                    </View>
                  </View>
                  <View style={styles.categoryChevronBg}>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </View>
              )}
            </ScalePress>
          </FadeIn>
        </View>

        {/* Other Reports Section */}
        <SlideIn delay={500}>
          <Text style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>
            Other Reports
          </Text>
        </SlideIn>

        <View style={styles.otherReportsGrid}>
          {/* Noise Nuisance */}
          <View style={styles.gridItemWrapper}>
            <SlideIn delay={600} from="bottom" distance={20}>
              <ScalePress onPress={() => handleCategoryPress('noise')}>
                {selectedCategory === 'noise' ? (
                  <View style={styles.gridCard}>
                    <LinearGradient
                      colors={categoryGradients.noise.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gridGradient}
                    >
                      <View style={[styles.gridIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                        <MaterialIcons name={categoryGradients.noise.icon as any} size={24} color="#FFFFFF" />
                      </View>
                      <Text style={styles.gridCardTextSelected}>Noise Nuisance</Text>
                    </LinearGradient>
                  </View>
                ) : (
                  <View style={styles.gridCard}>
                    <View style={[styles.gridIcon, { backgroundColor: categoryGradients.noise.bgColor }]}>
                      <MaterialIcons name={categoryGradients.noise.icon as any} size={24} color={categoryGradients.noise.iconColor} />
                    </View>
                    <Text style={styles.gridCardText}>Noise Nuisance</Text>
                  </View>
                )}
              </ScalePress>
            </SlideIn>
          </View>

          {/* Graffiti */}
          <View style={styles.gridItemWrapper}>
            <SlideIn delay={650} from="bottom" distance={20}>
              <ScalePress onPress={() => handleCategoryPress('graffiti')}>
                {selectedCategory === 'graffiti' ? (
                  <View style={styles.gridCard}>
                    <LinearGradient
                      colors={categoryGradients.graffiti.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gridGradient}
                    >
                      <View style={[styles.gridIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                        <MaterialIcons name={categoryGradients.graffiti.icon as any} size={24} color="#FFFFFF" />
                      </View>
                      <Text style={styles.gridCardTextSelected}>Graffiti</Text>
                    </LinearGradient>
                  </View>
                ) : (
                  <View style={styles.gridCard}>
                    <View style={[styles.gridIcon, { backgroundColor: categoryGradients.graffiti.bgColor }]}>
                      <MaterialIcons name={categoryGradients.graffiti.icon as any} size={24} color={categoryGradients.graffiti.iconColor} />
                    </View>
                    <Text style={styles.gridCardText}>Graffiti</Text>
                  </View>
                )}
              </ScalePress>
            </SlideIn>
          </View>

          {/* Illegal Parking */}
          <View style={styles.gridItemWrapper}>
            <SlideIn delay={700} from="bottom" distance={20}>
              <ScalePress onPress={() => handleCategoryPress('parking')}>
                {selectedCategory === 'parking' ? (
                  <View style={styles.gridCard}>
                    <LinearGradient
                      colors={categoryGradients.parking.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gridGradient}
                    >
                      <View style={[styles.gridIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                        <MaterialIcons name={categoryGradients.parking.icon as any} size={24} color="#FFFFFF" />
                      </View>
                      <Text style={styles.gridCardTextSelected}>Illegal Parking</Text>
                    </LinearGradient>
                  </View>
                ) : (
                  <View style={styles.gridCard}>
                    <View style={[styles.gridIcon, { backgroundColor: categoryGradients.parking.bgColor }]}>
                      <MaterialIcons name={categoryGradients.parking.icon as any} size={24} color={categoryGradients.parking.iconColor} />
                    </View>
                    <Text style={styles.gridCardText}>Illegal Parking</Text>
                  </View>
                )}
              </ScalePress>
            </SlideIn>
          </View>

          {/* Something Else */}
          <View style={styles.gridItemWrapper}>
            <SlideIn delay={750} from="bottom" distance={20}>
              <ScalePress onPress={() => handleCategoryPress('other')}>
                {selectedCategory === 'other' ? (
                  <View style={styles.gridCardOther}>
                    <LinearGradient
                      colors={categoryGradients.other.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gridGradient}
                    >
                      <View style={[styles.gridIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                        <MaterialIcons name={categoryGradients.other.icon as any} size={24} color="#FFFFFF" />
                      </View>
                      <Text style={styles.gridCardTextSelected}>Something Else</Text>
                    </LinearGradient>
                  </View>
                ) : (
                  <View style={styles.gridCardOther}>
                    <View style={[styles.gridIcon, { backgroundColor: categoryGradients.other.bgColor }]}>
                      <MaterialIcons name={categoryGradients.other.icon as any} size={24} color={categoryGradients.other.iconColor} />
                    </View>
                    <Text style={styles.gridCardTextOther}>Something Else</Text>
                  </View>
                )}
              </ScalePress>
            </SlideIn>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 1,
  },
  title: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Common Issues List
  commonIssuesList: {
    gap: 16,
  },

  // Featured Card
  featuredCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  featuredGradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredBlob1: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 48,
  },
  featuredBlob2: {
    position: 'absolute',
    bottom: -16,
    left: -16,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 40,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 10,
  },
  featuredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
    fontWeight: '500',
  },

  // Category Card
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryLeft: {
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
    color: '#1E293B',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  categoryChevronBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Other Reports Grid
  otherReportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  gridCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCardOther: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 20,
    flexShrink: 1,
    width: '100%',
  },
  gridCardTextOther: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    flexShrink: 1,
    width: '100%',
  },
  gridGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    padding: 16,
    minHeight: 140,
  },
  gridCardTextSelected: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    flexShrink: 1,
    width: '100%',
  },
});

export default IssueCategoryScreen;
