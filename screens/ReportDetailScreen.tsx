import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  TextInput,
  Share,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  isUser: boolean;
}

interface EmailActivity {
  id: string;
  type: 'sent' | 'delivered' | 'opened' | 'replied';
  timestamp: string;
  recipient?: string;
}

interface ReportDetailScreenProps {
  onBack?: () => void;
  onStartReport?: () => void;
  onSeeAll?: () => void;
  onCouncilUpdate?: () => void;
  onProfile?: () => void;
  onViewEmailThread?: () => void;
  onSendEmail?: () => void;
  reportId?: string;
  reportData?: any;
  council?: string;
  onMore?: () => void;
  onAddPhoto?: () => void;
  onAddCommentPhoto?: () => void;
  onAddMoreInfo?: () => void;
}

const ReportDetailScreen: React.FC<ReportDetailScreenProps> = ({
  onBack,
  onStartReport,
  onSeeAll,
  onCouncilUpdate,
  onProfile,
  onViewEmailThread,
  onSendEmail,
  reportId = '#49281',
  reportData,
  council = 'Camden',
  onMore,
  onAddPhoto,
  onAddCommentPhoto,
  onAddMoreInfo,
}) => {
  // Use live report data if available, otherwise use defaults
  const title = reportData?.title || reportData?.service_name || 'Report Details';
  const description = reportData?.detail || reportData?.description || 'No description available';
  const status = reportData?.status || 'open';
  const category = reportData?.service_name || 'General Report';
  const location = reportData?.title || 'Location not specified';
  const reportedDate = reportData?.requested_datetime
    ? new Date(reportData.requested_datetime).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown date';
  const lastUpdated = reportData?.updated_datetime
    ? new Date(reportData.updated_datetime).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown date';
  const imageUrl = reportData?.media_url;
  const assignedDepartment = reportData?.agency_responsible?.recipient?.[0] || `${council} Borough Council`;
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      text: 'More bags have been added since I reported this yesterday.',
      author: 'You',
      timestamp: 'Yesterday, 4:00 PM',
      isUser: true,
    },
  ]);

  const timeline: TimelineItem[] = [
    {
      id: '1',
      title: 'Report Received',
      date: '12 Oct, 09:15 AM',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Investigation Started',
      date: '13 Oct, 10:30 AM',
      description: 'Assigned to Waste Management Team.',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Collection Scheduled',
      date: 'Today, 08:45 AM',
      description: 'Scheduled for clearance within 24 hours.',
      status: 'current',
    },
    {
      id: '4',
      title: 'Resolved',
      date: 'Pending',
      status: 'pending',
    },
  ];

  const emailActivity: EmailActivity[] = [
    {
      id: '1',
      type: 'sent',
      timestamp: '12 Oct, 09:16 AM',
      recipient: 'roads@citycouncil.gov',
    },
    {
      id: '2',
      type: 'delivered',
      timestamp: '12 Oct, 09:16 AM',
    },
    {
      id: '3',
      type: 'opened',
      timestamp: '13 Oct, 09:45 AM',
    },
    {
      id: '4',
      type: 'replied',
      timestamp: '13 Oct, 10:30 AM',
    },
  ];

  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: commentText,
        author: 'You',
        timestamp: 'Just now',
        isUser: true,
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  const getEmailActivityIcon = (type: EmailActivity['type']) => {
    switch (type) {
      case 'sent':
        return 'send';
      case 'delivered':
        return 'done';
      case 'opened':
        return 'mail-open';
      case 'replied':
        return 'reply';
    }
  };

  const getEmailActivityLabel = (type: EmailActivity['type']) => {
    switch (type) {
      case 'sent':
        return 'Email Sent';
      case 'delivered':
        return 'Email Delivered';
      case 'opened':
        return 'Email Opened';
      case 'replied':
        return 'Department Replied';
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this report: ${title}\n\nReport ID: ${reportId}\nStatus: ${status}\nLocation: ${location}\n\nReported on ${reportedDate} to ${council} Council.\n\n${description}`;

      const result = await Share.share({
        message: shareMessage,
        title: `Report ${reportId} - ${title}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Report shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share report. Please try again.');
      console.error('Share error:', error);
    }
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
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
              <MaterialIcons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Report {reportId}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.shareButton} activeOpacity={0.8} onPress={handleShare}>
              <MaterialIcons name="share" size={22} color="#5B7CFA" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton} activeOpacity={0.8} onPress={onMore}>
              <MaterialIcons name="more-horiz" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Report Details Card */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.reportHeaderLeft}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
              <Text style={styles.reportTitle}>{title}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {status === 'open' ? 'Open' : status === 'closed' ? 'Fixed' : status === 'investigating' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>
            {description}
          </Text>

          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={18} color="#5B7CFA" />
            <Text style={styles.locationText}>{location}</Text>
          </View>

          {/* Photos Grid */}
          {imageUrl ? (
            <View style={styles.photosGrid}>
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.reportImage}
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity style={styles.addPhotoButton} activeOpacity={0.8} onPress={onAddPhoto}>
                <MaterialIcons name="add-a-photo" size={20} color="#5B7CFA" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photosGrid}>
              <View style={styles.photoContainer}>
                <View style={styles.photoPlaceholder}>
                  <MaterialIcons name="image" size={32} color="#D1D5DB" />
                </View>
              </View>
              <TouchableOpacity style={styles.addPhotoButton} activeOpacity={0.8} onPress={onAddPhoto}>
                <MaterialIcons name="add-a-photo" size={20} color="#5B7CFA" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.reportedDate}>Reported: {reportedDate}</Text>
          <Text style={styles.reportedDate}>Last Updated: {lastUpdated}</Text>
          <Text style={styles.reportedDate}>Assigned to: {assignedDepartment}</Text>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timelineCard}>
            {timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                {/* Timeline connector line */}
                {index < timeline.length - 1 && <View style={styles.timelineLine} />}

                {/* Timeline dot */}
                <View
                  style={[
                    styles.timelineDot,
                    item.status === 'completed' && styles.timelineDotCompleted,
                    item.status === 'current' && styles.timelineDotCurrent,
                    item.status === 'pending' && styles.timelineDotPending,
                  ]}
                />

                {/* Timeline content */}
                <View
                  style={[
                    styles.timelineContent,
                    item.status === 'pending' && styles.timelineContentPending,
                  ]}
                >
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                  {item.description && (
                    <Text style={styles.timelineDescription}>{item.description}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Email Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Tracking</Text>
          <View style={styles.emailCard}>
            {/* Email Status Header */}
            <View style={styles.emailHeader}>
              <View style={styles.emailStatusBadge}>
                <MaterialIcons name="check-circle" size={16} color="#4DB6AC" />
                <Text style={styles.emailStatusText}>Email Active</Text>
              </View>
              <Text style={styles.emailRecipient}>To: roads@citycouncil.gov</Text>
            </View>

            {/* Email Activity Timeline */}
            <View style={styles.emailTimeline}>
              {emailActivity.map((activity, index) => (
                <View key={activity.id} style={styles.emailActivityItem}>
                  <View style={styles.emailActivityIconContainer}>
                    <MaterialIcons
                      name={getEmailActivityIcon(activity.type) as any}
                      size={14}
                      color="#5B7CFA"
                    />
                  </View>
                  <View style={styles.emailActivityContent}>
                    <Text style={styles.emailActivityLabel}>
                      {getEmailActivityLabel(activity.type)}
                    </Text>
                    <Text style={styles.emailActivityTime}>{activity.timestamp}</Text>
                  </View>
                  {index < emailActivity.length - 1 && <View style={styles.emailActivityLine} />}
                </View>
              ))}
            </View>

            {/* Email Actions */}
            <View style={styles.emailActions}>
              <TouchableOpacity
                style={styles.emailActionButton}
                activeOpacity={0.8}
                onPress={onViewEmailThread}
              >
                <MaterialIcons name="forum" size={18} color="#5B7CFA" />
                <Text style={styles.emailActionText}>View Email Thread</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emailActionButtonPrimary}
                activeOpacity={0.8}
                onPress={onSendEmail}
              >
                <MaterialIcons name="send" size={18} color="#FFFFFF" />
                <Text style={styles.emailActionTextPrimary}>Send Follow-up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Council Response */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Council Response</Text>
          <View style={styles.councilCard}>
            <View style={styles.councilBadge}>
              <MaterialIcons name="verified" size={16} color="#5B7CFA" />
              <Text style={styles.councilBadgeText}>OFFICIAL UPDATE</Text>
            </View>
            <Text style={styles.councilText}>
              "Thank you for reporting this. We have identified the issue and a team has been
              dispatched. Due to the volume of waste, a specialized vehicle is required."
            </Text>
            <Text style={styles.councilAuthor}>- Wandsworth Council, 2 hours ago</Text>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comments / Updates</Text>
          <View style={styles.commentsContainer}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                <View style={styles.commentAvatar}>
                  <MaterialIcons name="person" size={16} color="#6B7280" />
                </View>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentMeta}>
                    {comment.author} • {comment.timestamp}
                  </Text>
                </View>
              </View>
            ))}

            {/* Comment Input */}
            <View style={styles.commentInputRow}>
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment or update..."
                  placeholderTextColor="#9CA3AF"
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendComment}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="send" size={20} color="#5B7CFA" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.photoButton} activeOpacity={0.8} onPress={onAddCommentPhoto}>
                <MaterialIcons name="add-photo-alternate" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Add More Information Button */}
        <TouchableOpacity style={styles.addInfoButton} activeOpacity={0.8} onPress={onAddMoreInfo}>
          <MaterialIcons name="edit-document" size={20} color="#5B7CFA" />
          <Text style={styles.addInfoText}>Add More Information</Text>
        </TouchableOpacity>

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

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onSeeAll}>
            <MaterialIcons name="history" size={28} color="#5B7CFA" />
            <Text style={[styles.navLabel, styles.navLabelActive]}>History</Text>
          </TouchableOpacity>

          {/* Center FAB */}
          <View style={styles.navFabContainer}>
            <TouchableOpacity style={styles.navFab} activeOpacity={0.9} onPress={onStartReport}>
              <MaterialIcons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8} onPress={onCouncilUpdate}>
            <MaterialIcons name="chat-bubble-outline" size={28} color="#9CA3AF" />
            <Text style={styles.navLabel}>Updates</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moreButton: {
    padding: 8,
  },

  // Report Card
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reportHeaderLeft: {
    flex: 1,
    marginRight: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 140, 102, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF8C66',
  },
  reportTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 20,
    fontWeight: '700',
    color: '#333344',
    lineHeight: 26,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Photos
  photosGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  photoContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  addPhotoButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(91, 124, 250, 0.3)',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5B7CFA',
    marginTop: 4,
  },
  reportedDate: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'right',
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingLeft: 4,
  },

  // Timeline
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 10,
    top: 28,
    bottom: -24,
    width: 2,
    backgroundColor: '#F3F4F6',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 16,
    marginTop: 2,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timelineDotCompleted: {
    backgroundColor: '#5B7CFA',
  },
  timelineDotCurrent: {
    backgroundColor: '#FFD572',
  },
  timelineDotPending: {
    backgroundColor: '#E5E7EB',
  },
  timelineContent: {
    flex: 1,
  },
  timelineContentPending: {
    opacity: 0.4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  timelineDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  // Council Response
  councilCard: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#5B7CFA',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  councilBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  councilBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B7CFA',
    textTransform: 'uppercase',
  },
  councilText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  councilAuthor: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 8,
  },

  // Comments
  commentsContainer: {
    gap: 12,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  commentText: {
    fontSize: 14,
    color: '#333344',
    marginBottom: 4,
  },
  commentMeta: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  commentInputContainer: {
    flex: 1,
    position: 'relative',
  },
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 48,
    fontSize: 14,
    color: '#333344',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sendButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -12 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  photoButton: {
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

  // Add Info Button
  addInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(91, 124, 250, 0.3)',
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  addInfoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B7CFA',
  },

  // Email Tracking
  emailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emailHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  emailStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  emailStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4DB6AC',
    textTransform: 'uppercase',
  },
  emailRecipient: {
    fontSize: 13,
    color: '#6B7280',
  },
  emailTimeline: {
    marginBottom: 16,
  },
  emailActivityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 16,
  },
  emailActivityIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  emailActivityContent: {
    flex: 1,
  },
  emailActivityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333344',
    marginBottom: 2,
  },
  emailActivityTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emailActivityLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    bottom: -16,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  emailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  emailActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emailActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B7CFA',
  },
  emailActionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#5B7CFA',
    borderRadius: 12,
    paddingVertical: 12,
  },
  emailActionTextPrimary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
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

export default ReportDetailScreen;
