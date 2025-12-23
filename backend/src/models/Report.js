const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'pothole',
      'street-lighting',
      'graffiti',
      'litter',
      'abandoned-vehicle',
      'fly-tipping',
      'vandalism',
      'noise',
      'parking',
      'other'
    ]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Location coordinates are required']
    },
    address: {
      type: String,
      trim: true
    }
  },
  images: [{
    url: String,
    publicId: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updates: [{
    message: String,
    status: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  votes: {
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create geospatial index for location queries
reportSchema.index({ location: '2dsphere' });

// Index for user's reports
reportSchema.index({ userId: 1, createdAt: -1 });

// Index for status queries
reportSchema.index({ status: 1, createdAt: -1 });

// Add update to report
reportSchema.methods.addUpdate = function(message, status, userId) {
  this.updates.push({
    message,
    status: status || this.status,
    createdBy: userId
  });

  if (status) {
    this.status = status;

    if (status === 'resolved') {
      this.resolvedAt = new Date();
    }
  }
};

// Add vote
reportSchema.methods.addVote = function(userId, voteType) {
  // Remove any existing votes from this user
  this.votes.upvotes = this.votes.upvotes.filter(id => !id.equals(userId));
  this.votes.downvotes = this.votes.downvotes.filter(id => !id.equals(userId));

  // Add new vote
  if (voteType === 'upvote') {
    this.votes.upvotes.push(userId);
  } else if (voteType === 'downvote') {
    this.votes.downvotes.push(userId);
  }
};

// Get vote count
reportSchema.methods.getVoteCount = function() {
  return {
    upvotes: this.votes.upvotes.length,
    downvotes: this.votes.downvotes.length,
    total: this.votes.upvotes.length - this.votes.downvotes.length
  };
};

module.exports = mongoose.model('Report', reportSchema);
