const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const { auth, generateToken } = require('../middleware/auth');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../services/email');

// In-memory storage (fallback when MongoDB not available)
const inMemoryUsers = new Map();

// Helper to get User model or use in-memory
const getUser = async (query) => {
  try {
    const User = require('../models/User');
    return await User.findOne(query);
  } catch {
    // MongoDB not available, use in-memory
    if (query.email) {
      return inMemoryUsers.get(query.email);
    }
    if (query._id) {
      for (const user of inMemoryUsers.values()) {
        if (user._id === query._id) return user;
      }
    }
    return null;
  }
};

const createUser = async (userData) => {
  try {
    const User = require('../models/User');
    const user = new User(userData);
    await user.save();
    return user;
  } catch {
    // MongoDB not available, use in-memory
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const user = {
      _id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      }
    };
    inMemoryUsers.set(userData.email, user);
    return user;
  }
};

const updateUser = async (userId, updates) => {
  try {
    const User = require('../models/User');
    return await User.findByIdAndUpdate(userId, updates, { new: true });
  } catch {
    // In-memory update
    for (const [email, user] of inMemoryUsers.entries()) {
      if (user._id === userId) {
        Object.assign(user, updates, { updatedAt: new Date() });
        return user;
      }
    }
    return null;
  }
};

const deleteUser = async (userId) => {
  try {
    const User = require('../models/User');
    return await User.findByIdAndDelete(userId);
  } catch {
    // In-memory delete
    for (const [email, user] of inMemoryUsers.entries()) {
      if (user._id === userId) {
        inMemoryUsers.delete(email);
        return user;
      }
    }
    return null;
  }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters' 
      });
    }

    // Check if user exists
    const existingUser = await getUser({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Create user
    const user = await createUser({
      name,
      email: email.toLowerCase(),
      password,
      phone
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await getUser({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          location: user.location,
          profilePhoto: user.profilePhoto,
          preferences: user.preferences,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await getUser({ _id: req.userId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        location: user.location,
        profilePhoto: user.profilePhoto,
        preferences: user.preferences,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
});

// PUT /api/auth/update-profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { name, phone, address, location, profilePhoto, preferences } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (location) updates.location = location;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;
    if (preferences) updates.preferences = preferences;

    const user = await updateUser(req.userId, updates);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        location: user.location,
        profilePhoto: user.profilePhoto,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current and new password are required' 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 8 characters' 
      });
    }

    const user = await getUser({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await updateUser(req.userId, { password: hashedPassword });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// DELETE /api/auth/delete-account
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const { password } = req.body;

    const user = await getUser({ _id: req.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Password is incorrect' 
      });
    }

    // Delete user
    await deleteUser(req.userId);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await getUser({ email: email.toLowerCase() });

    // Always return success for security (don't reveal if email exists)
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      await updateUser(user._id, {
        passwordResetToken: resetToken,
        passwordResetExpires: new Date(Date.now() + 3600000) // 1 hour
      });

      // Send password reset email
      try {
        await sendPasswordResetEmail(email, resetToken, user.name);
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
        // Continue anyway - don't expose email failure to user
      }
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters' 
      });
    }

    // Find user with valid reset token
    let user = null;
    try {
      const User = require('../models/User');
      user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      });
    } catch {
      // In-memory search
      for (const u of inMemoryUsers.values()) {
        if (u.passwordResetToken === token && u.passwordResetExpires > Date.now()) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await updateUser(user._id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

// POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    const { code, email } = req.body;

    // For now, accept any 6-digit code (in production, verify against stored code)
    if (!code || code.length !== 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code' 
      });
    }

    const user = await getUser({ email: email?.toLowerCase() });
    if (user) {
      await updateUser(user._id, { emailVerified: true });
    }

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify email' });
  }
});

module.exports = router;
