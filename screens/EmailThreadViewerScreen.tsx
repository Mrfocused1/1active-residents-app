import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ApiService from '../services/api.service';

interface EmailThreadViewerScreenProps {
  onBack: () => void;
  reportId?: string;
}

interface EmailMessage {
  id: string;
  sender: 'user' | 'department' | 'system';
  senderName: string;
  senderEmail: string;
  timestamp: string;
  subject: string;
  body: string;
  isRead: boolean;
}

const EmailThreadViewerScreen: React.FC<EmailThreadViewerScreenProps> = ({
  onBack,
  reportId = '#4782'
}) => {
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [threadData, setThreadData] = useState({
    reportId: reportId,
    totalMessages: 0,
    lastActivity: '',
    status: 'Active',
  });

  useEffect(() => {
    fetchEmailThread();
  }, [reportId]);

  const fetchEmailThread = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getEmailThread(reportId);

      if (response.data) {
        const emailData = response.data;

        // Format messages
        const formattedMessages = emailData.messages?.map((msg: any) =>
          formatEmailMessage(msg)
        ) || [];

        setMessages(formattedMessages);

        // Update thread data
        setThreadData({
          reportId: reportId,
          totalMessages: formattedMessages.length,
          lastActivity: emailData.lastActivity || formatTimestamp(emailData.updatedAt),
          status: emailData.status || 'Active',
        });
      }
    } catch (error) {
      console.error('Error fetching email thread:', error);
      // Keep empty array if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const formatEmailMessage = (msg: any): EmailMessage => {
    return {
      id: msg._id || msg.id,
      sender: msg.sender || 'user',
      senderName: msg.senderName || msg.from?.name || 'Unknown',
      senderEmail: msg.senderEmail || msg.from?.email || '',
      timestamp: formatTimestamp(msg.timestamp || msg.createdAt),
      subject: msg.subject,
      body: msg.body || msg.content,
      isRead: msg.isRead !== false,
    };
  };

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      await ApiService.sendEmailReply(reportId, {
        subject: `RE: Report ${reportId}`,
        body: replyText,
      });

      // Refresh thread
      await fetchEmailThread();
      setReplyText('');
      setShowReplyModal(false);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const templates = [
    {
      id: '1',
      name: 'Request Update',
      body: 'Could you please provide an update on the status of this issue? Thank you.',
    },
    {
      id: '2',
      name: 'Thank You',
      body: 'Thank you for the update. I appreciate your prompt response and assistance.',
    },
    {
      id: '3',
      name: 'Request Timeline',
      body: 'Could you provide an estimated timeline for when this issue will be resolved? Thank you.',
    },
    {
      id: '4',
      name: 'Additional Information',
      body: 'I would like to provide some additional information regarding this report...',
    },
  ];

  const handleSelectTemplate = (template: typeof templates[0]) => {
    setReplyText(template.body);
    setSelectedTemplate(template.id);
    setShowTemplateModal(false);
  };

  const getSenderIcon = (sender: EmailMessage['sender']) => {
    switch (sender) {
      case 'user':
        return 'person';
      case 'department':
        return 'business';
      case 'system':
        return 'info';
    }
  };

  const getSenderColor = (sender: EmailMessage['sender']) => {
    switch (sender) {
      case 'user':
        return '#5B7CFA';
      case 'department':
        return '#4DB6AC';
      case 'system':
        return '#FFD572';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Email Thread</Text>
          <Text style={styles.headerSubtitle}>Report {threadData.reportId}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <MaterialIcons name="more-vert" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Thread Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialIcons name="mail" size={18} color="#6B7280" />
          <Text style={styles.statText}>{threadData.totalMessages} messages</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialIcons name="access-time" size={18} color="#6B7280" />
          <Text style={styles.statText}>{threadData.lastActivity}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statusDot, { backgroundColor: '#4DB6AC' }]} />
          <Text style={styles.statText}>{threadData.status}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Messages */}
        <View style={styles.messagesContainer}>
          {isLoading ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#5B7CFA" />
              <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 14 }}>
                Loading email thread...
              </Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <MaterialIcons name="mail-outline" size={64} color="#D1D5DB" />
              <Text style={{ marginTop: 16, color: '#6B7280', fontSize: 16, fontWeight: '600' }}>
                No messages yet
              </Text>
              <Text style={{ marginTop: 8, color: '#9CA3AF', fontSize: 14, textAlign: 'center' }}>
                Email correspondence for this report will appear here
              </Text>
            </View>
          ) : (
            messages.map((message, index) => (
            <View key={message.id} style={styles.messageCard}>
              {/* Message Header */}
              <View style={styles.messageHeader}>
                <View style={[
                  styles.senderIconContainer,
                  { backgroundColor: `${getSenderColor(message.sender)}20` }
                ]}>
                  <MaterialIcons
                    name={getSenderIcon(message.sender) as any}
                    size={20}
                    color={getSenderColor(message.sender)}
                  />
                </View>
                <View style={styles.messageHeaderText}>
                  <Text style={styles.senderName}>{message.senderName}</Text>
                  <Text style={styles.senderEmail}>{message.senderEmail}</Text>
                </View>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              </View>

              {/* Message Subject */}
              <Text style={styles.messageSubject}>{message.subject}</Text>

              {/* Message Body */}
              <Text style={styles.messageBody}>{message.body}</Text>

              {/* Message Footer */}
              {message.sender === 'department' && (
                <View style={styles.messageFooter}>
                  <TouchableOpacity
                    style={styles.replyButton}
                    activeOpacity={0.7}
                    onPress={() => setShowReplyModal(true)}
                  >
                    <MaterialIcons name="reply" size={16} color="#5B7CFA" />
                    <Text style={styles.replyButtonText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Timeline Connector */}
              {index < messages.length - 1 && (
                <View style={styles.timelineConnector} />
              )}
            </View>
          ))
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Reply Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          activeOpacity={0.8}
          onPress={() => setShowReplyModal(true)}
        >
          <MaterialIcons name="reply" size={24} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>Reply</Text>
        </TouchableOpacity>
      </View>

      {/* Reply Modal */}
      <Modal
        visible={showReplyModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowReplyModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowReplyModal(false)}
              style={styles.modalCloseButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Reply to Thread</Text>
            <TouchableOpacity
              style={styles.templateButton}
              activeOpacity={0.7}
              onPress={() => setShowTemplateModal(true)}
            >
              <MaterialIcons name="description" size={24} color="#5B7CFA" />
            </TouchableOpacity>
          </View>

          {/* Reply Form */}
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.replyFormContainer}>
              <Text style={styles.replyLabel}>Your Reply</Text>
              <TextInput
                style={styles.replyInput}
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Type your message here..."
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.sendButton}
                activeOpacity={0.8}
                onPress={handleSendReply}
              >
                <MaterialIcons name="send" size={20} color="#FFFFFF" />
                <Text style={styles.sendButtonText}>Send Reply</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Template Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View style={styles.templateModalOverlay}>
          <View style={styles.templateModalContent}>
            <View style={styles.templateModalHeader}>
              <Text style={styles.templateModalTitle}>Select Template</Text>
              <TouchableOpacity
                onPress={() => setShowTemplateModal(false)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.templateList}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateItem}
                  activeOpacity={0.7}
                  onPress={() => handleSelectTemplate(template)}
                >
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templatePreview}>{template.body}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  senderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageHeaderText: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  senderEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  messageSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  messageBody: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  messageFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B7CFA',
  },
  timelineConnector: {
    position: 'absolute',
    left: 35,
    bottom: -16,
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    flexDirection: 'row',
    backgroundColor: '#5B7CFA',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  templateButton: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },
  replyFormContainer: {
    padding: 20,
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  replyInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#374151',
    minHeight: 200,
    marginBottom: 16,
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: '#5B7CFA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  templateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  templateModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '70%',
  },
  templateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  templateModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  templateList: {
    padding: 20,
  },
  templateItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  templatePreview: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

export default EmailThreadViewerScreen;
