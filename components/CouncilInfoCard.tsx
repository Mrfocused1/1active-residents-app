import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CouncilDepartmentInfo } from '../services/gemini.service';

interface CouncilInfoCardProps {
  departmentInfo: CouncilDepartmentInfo;
  onDepartmentPress?: (department: any) => void;
  compact?: boolean;
}

export const CouncilInfoCard: React.FC<CouncilInfoCardProps> = ({
  departmentInfo,
  onDepartmentPress,
  compact = false,
}) => {
  if (compact) {
    // Compact view showing just chief executive and council leader
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <MaterialIcons name="account-balance" size={20} color="#5B7CFA" />
          <Text style={styles.compactTitle}>Council Leadership</Text>
        </View>

        {departmentInfo.councilLeader && (
          <View style={styles.compactItem}>
            <Text style={styles.compactLabel}>Council Leader</Text>
            <Text style={styles.compactName}>
              {departmentInfo.councilLeader.name}
              {departmentInfo.councilLeader.party && ` (${departmentInfo.councilLeader.party})`}
            </Text>
          </View>
        )}

        {departmentInfo.chiefExecutive && (
          <View style={styles.compactItem}>
            <Text style={styles.compactLabel}>Chief Executive</Text>
            <Text style={styles.compactName}>{departmentInfo.chiefExecutive.name}</Text>
          </View>
        )}
      </View>
    );
  }

  // Full view with all departments
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-balance" size={24} color="#5B7CFA" />
        <View style={styles.headerText}>
          <Text style={styles.title}>Council Information</Text>
          <Text style={styles.subtitle}>{departmentInfo.councilName}</Text>
        </View>
      </View>

      {/* Leadership */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leadership</Text>

        {departmentInfo.councilLeader && (
          <View style={styles.leaderCard}>
            <View style={styles.leaderIcon}>
              <MaterialIcons name="stars" size={20} color="#FFD572" />
            </View>
            <View style={styles.leaderInfo}>
              <Text style={styles.leaderRole}>Council Leader</Text>
              <Text style={styles.leaderName}>{departmentInfo.councilLeader.name}</Text>
              {departmentInfo.councilLeader.party && (
                <Text style={styles.leaderParty}>{departmentInfo.councilLeader.party}</Text>
              )}
            </View>
          </View>
        )}

        {departmentInfo.chiefExecutive && (
          <View style={styles.leaderCard}>
            <View style={styles.leaderIcon}>
              <MaterialIcons name="business-center" size={20} color="#5B7CFA" />
            </View>
            <View style={styles.leaderInfo}>
              <Text style={styles.leaderRole}>Chief Executive</Text>
              <Text style={styles.leaderName}>{departmentInfo.chiefExecutive.name}</Text>
              {departmentInfo.chiefExecutive.email && (
                <Text style={styles.leaderContact}>{departmentInfo.chiefExecutive.email}</Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Departments */}
      {departmentInfo.departments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Departments</Text>

          {departmentInfo.departments.map((dept, index) => (
            <TouchableOpacity
              key={index}
              style={styles.departmentCard}
              activeOpacity={0.7}
              onPress={() => onDepartmentPress?.(dept)}
            >
              <View style={styles.departmentHeader}>
                <Text style={styles.departmentName}>{dept.name}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
              </View>

              <Text style={styles.departmentHead}>
                {dept.head} - {dept.role}
              </Text>

              {dept.responsibilities.length > 0 && (
                <View style={styles.responsibilities}>
                  {dept.responsibilities.slice(0, 2).map((resp, idx) => (
                    <View key={idx} style={styles.responsibilityItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.responsibilityText}>{resp}</Text>
                    </View>
                  ))}
                </View>
              )}

              {(dept.contactEmail || dept.contactPhone) && (
                <View style={styles.contactInfo}>
                  {dept.contactEmail && (
                    <View style={styles.contactItem}>
                      <MaterialIcons name="email" size={14} color="#5B7CFA" />
                      <Text style={styles.contactText}>{dept.contactEmail}</Text>
                    </View>
                  )}
                  {dept.contactPhone && (
                    <View style={styles.contactItem}>
                      <MaterialIcons name="phone" size={14} color="#5B7CFA" />
                      <Text style={styles.contactText}>{dept.contactPhone}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  leaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderInfo: {
    flex: 1,
  },
  leaderRole: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 2,
  },
  leaderParty: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  leaderContact: {
    fontSize: 12,
    color: '#5B7CFA',
    marginTop: 2,
  },
  departmentCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  departmentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333344',
  },
  departmentHead: {
    fontSize: 13,
    color: '#5B7CFA',
    fontWeight: '600',
    marginBottom: 8,
  },
  responsibilities: {
    marginTop: 8,
  },
  responsibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
    marginTop: 6,
  },
  responsibilityText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  contactInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: '#5B7CFA',
  },

  // Compact styles
  compactContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
  },
  compactItem: {
    marginBottom: 8,
  },
  compactLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333344',
  },
});
