const express = require('express');
const router = express.Router();
const {
  registerPushToken,
  removePushToken,
  getPushTokens
} = require('../controllers/pushTokenController');
const { protect } = require('../middleware/auth');

router.post('/', protect, registerPushToken);
router.delete('/', protect, removePushToken);
router.get('/', protect, getPushTokens);

module.exports = router;
