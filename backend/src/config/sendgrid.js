const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @param {string} options.templateId - SendGrid template ID (optional)
 * @param {Object} options.dynamicTemplateData - Template data (optional)
 */
const sendEmail = async (options) => {
  try {
    const msg = {
      to: options.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME || 'Active Residents',
      },
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // If using dynamic template
    if (options.templateId) {
      msg.templateId = options.templateId;
      msg.dynamicTemplateData = options.dynamicTemplateData || {};
      delete msg.text;
      delete msg.html;
      delete msg.subject;
    }

    const response = await sgMail.send(msg);
    console.log('✅ Email sent successfully to:', options.to);
    return response;
  } catch (error) {
    console.error('❌ SendGrid Error:', error.response?.body || error.message);
    throw new Error('Failed to send email');
  }
};

/**
 * Send welcome email to new user
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #5B7CFA; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #5B7CFA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Active Residents!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Thank you for joining Active Residents! We're excited to have you as part of our community.</p>
          <p>With Active Residents, you can:</p>
          <ul>
            <li>Report local issues in your community</li>
            <li>Track the status of your reports</li>
            <li>Stay informed about community updates</li>
            <li>Connect with your neighbors</li>
          </ul>
          <p>Get started by exploring the app and making your first report!</p>
          <div class="footer">
            <p>Active Residents<br>
            <a href="http://www.activeresidents.co.uk">www.activeresidents.co.uk</a></p>
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: 'Welcome to Active Residents!',
    text: `Hi ${userName},\n\nWelcome to Active Residents! We're excited to have you as part of our community.`,
    html,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #5B7CFA; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #5B7CFA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
        .warning { color: #e74c3c; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>We received a request to reset your password for your Active Residents account.</p>
          <p>Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #5B7CFA;">${resetUrl}</p>
          <p class="warning">⚠️ This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <div class="footer">
            <p>Active Residents<br>
            <a href="http://www.activeresidents.co.uk">www.activeresidents.co.uk</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: 'Password Reset Request - Active Residents',
    text: `Hi ${userName},\n\nWe received a request to reset your password. Use this link to reset it: ${resetUrl}\n\nThis link expires in 1 hour.`,
    html,
  });
};

/**
 * Send report confirmation email
 */
const sendReportConfirmationEmail = async (userEmail, userName, reportData) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #5B7CFA; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .report-details { background: white; padding: 15px; border-left: 4px solid #5B7CFA; margin: 20px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Report Submitted Successfully</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Thank you for submitting a report to Active Residents. We've received your report and our team will review it shortly.</p>
          <div class="report-details">
            <h3>Report Details:</h3>
            <p><strong>Reference ID:</strong> ${reportData.id}</p>
            <p><strong>Category:</strong> ${reportData.category}</p>
            <p><strong>Title:</strong> ${reportData.title}</p>
            <p><strong>Status:</strong> ${reportData.status}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You can track the status of your report in the Active Residents app.</p>
          <div class="footer">
            <p>Active Residents<br>
            <a href="http://www.activeresidents.co.uk">www.activeresidents.co.uk</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Report Submitted - ${reportData.title}`,
    text: `Hi ${userName},\n\nYour report has been submitted successfully.\n\nReference ID: ${reportData.id}\nCategory: ${reportData.category}\nStatus: ${reportData.status}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendReportConfirmationEmail,
};
