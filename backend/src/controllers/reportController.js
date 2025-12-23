const Report = require('../models/Report');
const { sendReportConfirmationEmail } = require('../config/sendgrid');

/**
 * @route   POST /api/reports
 * @desc    Create new report
 * @access  Private
 */
exports.createReport = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      location,
      images,
      isPublic
    } = req.body;

    const report = await Report.create({
      userId: req.user._id,
      title,
      description,
      category,
      location,
      images: images || [],
      isPublic: isPublic !== undefined ? isPublic : true
    });

    // Populate user details
    await report.populate('userId', 'name email');

    // Send confirmation email
    try {
      await sendReportConfirmationEmail(req.user.email, req.user.name, {
        id: report._id,
        title: report.title,
        category: report.category,
        status: report.status
      });
    } catch (emailError) {
      console.error('Failed to send report confirmation email:', emailError);
      // Don't fail report creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports
 * @desc    Get all reports (with filters)
 * @access  Private
 */
exports.getReports = async (req, res, next) => {
  try {
    const {
      status,
      category,
      priority,
      myReports,
      lat,
      lng,
      radius = 5000, // 5km default
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Filter by user's reports
    if (myReports === 'true') {
      query.userId = req.user._id;
    } else {
      // Only show public reports if not filtering by user
      query.isPublic = true;
    }

    // Geospatial query (nearby reports)
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    // Execute query with pagination
    const reports = await Report.find(query)
      .populate('userId', 'name email avatar')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports/:id
 * @desc    Get single report
 * @access  Private
 */
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'name email avatar phone')
      .populate('assignedTo', 'name email')
      .populate('updates.createdBy', 'name')
      .populate('comments.userId', 'name avatar');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user can view this report
    if (!report.isPublic && !report.userId._id.equals(req.user._id) && req.user.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this report'
      });
    }

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/reports/:id
 * @desc    Update report
 * @access  Private
 */
exports.updateReport = async (req, res, next) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is authorized to update
    if (!report.userId.equals(req.user._id) && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this report'
      });
    }

    const { title, description, location, isPublic } = req.body;

    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (location) fieldsToUpdate.location = location;
    if (isPublic !== undefined) fieldsToUpdate.isPublic = isPublic;

    report = await Report.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete report
 * @access  Private
 */
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is authorized to delete
    if (!report.userId.equals(req.user._id) && !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report'
      });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/reports/:id/update
 * @desc    Add update to report
 * @access  Private (Admin/Moderator)
 */
exports.addReportUpdate = async (req, res, next) => {
  try {
    const { message, status } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.addUpdate(message, status, req.user._id);
    await report.save();

    await report.populate('updates.createdBy', 'name');

    res.json({
      success: true,
      message: 'Update added successfully',
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/reports/:id/vote
 * @desc    Vote on report
 * @access  Private
 */
exports.voteReport = async (req, res, next) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.addVote(req.user._id, voteType);
    await report.save();

    res.json({
      success: true,
      message: 'Vote recorded',
      data: {
        votes: report.getVoteCount()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/reports/:id/comments
 * @desc    Add comment to report
 * @access  Private
 */
exports.addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.comments.push({
      userId: req.user._id,
      comment
    });

    await report.save();
    await report.populate('comments.userId', 'name avatar');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { comments: report.comments }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reports/stats/overview
 * @desc    Get report statistics
 * @access  Private (Admin/Moderator)
 */
exports.getReportStats = async (req, res, next) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const inProgressReports = await Report.countDocuments({ status: 'in-progress' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    const reportsByCategory = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalReports,
        pending: pendingReports,
        inProgress: inProgressReports,
        resolved: resolvedReports,
        byCategory: reportsByCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
