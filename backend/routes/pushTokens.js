const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');

// In-memory storage for push tokens
const pushTokens = new Map();

// POST /api/push-tokens - Register push token
router.post('/', auth, async (req, res) => {
  try {
    const { token, device } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const pushToken = {
      _id: uuidv4(),
      userId: req.userId,
      token,
      device: device || 'unknown',
      createdAt: new Date().toISOString()
    };

    // Remove any existing token for this user/token combo
    for (const [id, existing] of pushTokens.entries()) {
      if (existing.userId === req.userId && existing.token === token) {
        pushTokens.delete(id);
      }
    }

    pushTokens.set(pushToken._id, pushToken);

    res.status(201).json({
      success: true,
      message: 'Push token registered',
      data: pushToken
    });
  } catch (error) {
    console.error('Register push token error:', error);
    res.status(500).json({ success: false, message: 'Failed to register push token' });
  }
});

// DELETE /api/push-tokens - Remove push token
router.delete('/', auth, async (req, res) => {
  try {
    const { token } = req.body;

    for (const [id, pushToken] of pushTokens.entries()) {
      if (pushToken.userId === req.userId && pushToken.token === token) {
        pushTokens.delete(id);
      }
    }

    res.json({ success: true, message: 'Push token removed' });
  } catch (error) {
    console.error('Remove push token error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove push token' });
  }
});

// GET /api/push-tokens - Get user's push tokens
router.get('/', auth, async (req, res) => {
  try {
    const userTokens = [];
    
    for (const pushToken of pushTokens.values()) {
      if (pushToken.userId === req.userId) {
        userTokens.push(pushToken);
      }
    }

    res.json({ success: true, data: userTokens });
  } catch (error) {
    console.error('Get push tokens error:', error);
    res.status(500).json({ success: false, message: 'Failed to get push tokens' });
  }
});

module.exports = router;
