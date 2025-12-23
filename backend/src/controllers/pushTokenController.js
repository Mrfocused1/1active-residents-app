const User = require('../models/User');

/**
 * @route   POST /api/push-tokens
 * @desc    Register push notification token
 * @access  Private
 */
exports.registerPushToken = async (req, res, next) => {
  try {
    const { token, device } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Push token is required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add push token to user
    user.addPushToken(token, device || 'unknown');
    await user.save();

    res.json({
      success: true,
      message: 'Push token registered successfully',
      data: {
        tokens: user.pushTokens
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/push-tokens
 * @desc    Remove push notification token
 * @access  Private
 */
exports.removePushToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Push token is required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove push token from user
    user.removePushToken(token);
    await user.save();

    res.json({
      success: true,
      message: 'Push token removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/push-tokens
 * @desc    Get user's registered push tokens
 * @access  Private
 */
exports.getPushTokens = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        tokens: user.pushTokens
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
