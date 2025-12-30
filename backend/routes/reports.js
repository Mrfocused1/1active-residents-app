const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');

// In-memory storage for reports
const reports = new Map();

// GET /api/reports - Get all reports (with optional filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, category, council, limit = 50, offset = 0 } = req.query;
    
    let userReports = [];
    for (const report of reports.values()) {
      if (report.userId === req.userId) {
        userReports.push(report);
      }
    }

    // Apply filters
    if (status) {
      userReports = userReports.filter(r => r.status === status);
    }
    if (category) {
      userReports = userReports.filter(r => r.category === category);
    }
    if (council) {
      userReports = userReports.filter(r => r.council === council);
    }

    // Sort by date (newest first)
    userReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const total = userReports.length;
    userReports = userReports.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: userReports,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to get reports' });
  }
});

// GET /api/reports/:id - Get single report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report || report.userId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ success: false, message: 'Failed to get report' });
  }
});

// POST /api/reports - Create new report
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, location, images, council, contactEmail } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    const report = {
      _id: uuidv4(),
      userId: req.userId,
      title,
      description,
      category,
      location: location || null,
      images: images || [],
      council: council || 'Unknown',
      contactEmail: contactEmail || null,
      status: 'submitted',
      updates: [],
      votes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reports.set(report._id, report);

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ success: false, message: 'Failed to create report' });
  }
});

// PUT /api/reports/:id - Update report
router.put('/:id', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report || report.userId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const { title, description, status, images } = req.body;
    
    if (title) report.title = title;
    if (description) report.description = description;
    if (status) report.status = status;
    if (images) report.images = images;
    report.updatedAt = new Date().toISOString();

    reports.set(req.params.id, report);

    res.json({ success: true, message: 'Report updated', data: report });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ success: false, message: 'Failed to update report' });
  }
});

// DELETE /api/reports/:id - Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report || report.userId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    reports.delete(req.params.id);

    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete report' });
  }
});

// POST /api/reports/:id/update - Add update to report
router.post('/:id/update', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const { message, status } = req.body;

    const update = {
      _id: uuidv4(),
      message,
      status: status || report.status,
      createdAt: new Date().toISOString()
    };

    report.updates.push(update);
    if (status) report.status = status;
    report.updatedAt = new Date().toISOString();

    reports.set(req.params.id, report);

    res.json({ success: true, message: 'Update added', data: report });
  } catch (error) {
    console.error('Add update error:', error);
    res.status(500).json({ success: false, message: 'Failed to add update' });
  }
});

// POST /api/reports/:id/vote - Vote on report
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.votes = (report.votes || 0) + 1;
    reports.set(req.params.id, report);

    res.json({ success: true, votes: report.votes });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ success: false, message: 'Failed to vote' });
  }
});

// POST /api/reports/:id/comments - Add comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const { text } = req.body;

    const comment = {
      _id: uuidv4(),
      userId: req.userId,
      text,
      createdAt: new Date().toISOString()
    };

    report.comments.push(comment);
    reports.set(req.params.id, report);

    res.json({ success: true, message: 'Comment added', data: comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
});

// GET /api/reports/:id/emails - Get email thread for report
router.get('/:id/emails', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report || report.userId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Return empty thread or mock data
    res.json({
      success: true,
      data: {
        messages: report.emailThread || [],
        lastActivity: report.updatedAt,
        status: report.emailThread?.length > 0 ? 'Active' : 'No emails'
      }
    });
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ success: false, message: 'Failed to get emails' });
  }
});

// POST /api/reports/:id/emails - Send email for report
router.post('/:id/emails', auth, async (req, res) => {
  try {
    const report = reports.get(req.params.id);
    
    if (!report || report.userId !== req.userId) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const { to, subject, body } = req.body;

    // In production, actually send email here
    const email = {
      _id: uuidv4(),
      to,
      subject,
      body,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    if (!report.emailThread) report.emailThread = [];
    report.emailThread.push(email);
    reports.set(req.params.id, report);

    res.json({ success: true, message: 'Email sent', data: email });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;
