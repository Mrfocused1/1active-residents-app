const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');

// In-memory storage for notifications
const notifications = new Map();

// GET /api/notifications - Get all notifications for user
router.get('/', auth, async (req, res) => {
  try {
    let userNotifications = [];
    
    for (const notification of notifications.values()) {
      if (notification.userId === req.userId) {
        userNotifications.push(notification);
      }
    }

    // Sort by date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: userNotifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to get notifications' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = notifications.get(req.params.id);
    
    if (!notification || notification.userId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();
    notifications.set(req.params.id, notification);

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
  try {
    for (const [id, notification] of notifications.entries()) {
      if (notification.userId === req.userId) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        notifications.set(id, notification);
      }
    }

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
});

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = notifications.get(req.params.id);
    
    if (!notification || notification.userId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notifications.delete(req.params.id);

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});

// DELETE /api/notifications - Delete all notifications
router.delete('/', auth, async (req, res) => {
  try {
    for (const [id, notification] of notifications.entries()) {
      if (notification.userId === req.userId) {
        notifications.delete(id);
      }
    }

    res.json({ success: true, message: 'All notifications deleted' });
  } catch (error) {
    console.error('Delete all error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notifications' });
  }
});

// Helper function to create notification (used internally)
const createNotification = (userId, title, message, type, data = {}) => {
  const notification = {
    _id: uuidv4(),
    userId,
    title,
    message,
    type,
    data,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifications.set(notification._id, notification);
  return notification;
};

module.exports = router;
module.exports.createNotification = createNotification;
