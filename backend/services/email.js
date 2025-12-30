const nodemailer = require('nodemailer');

// Create transporter based on environment
const createTransporter = () => {
  // Check if SMTP is configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Log emails to console in development
  console.log('SMTP not configured - emails will be logged to console');
  return null;
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const transport = getTransporter();

  // Build reset URL - use app deep link or web URL
  const resetUrl = process.env.APP_URL
    ? `${process.env.APP_URL}/reset-password?token=${resetToken}`
    : `activeresidents://reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Active Residents" <noreply@activeresidents.app>',
    to: email,
    subject: 'Reset Your Password - Active Residents',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F7FE; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #5B7CFA 0%, #3B5998 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 700;">Active Residents</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Your Community, Your Voice</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333344; margin: 0 0 16px 0; font-size: 24px;">Password Reset Request</h2>

            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Hi${userName ? ` ${userName}` : ''},
            </p>

            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              We received a request to reset your password for your Active Residents account. Click the button below to create a new password:
            </p>

            <!-- Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #5B7CFA 0%, #3B5998 100%); color: #FFFFFF; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(91, 124, 250, 0.3);">
                Reset Password
              </a>
            </div>

            <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
              This link will expire in <strong>1 hour</strong> for security reasons.
            </p>

            <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>

            <!-- Divider -->
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;">

            <p style="color: #9CA3AF; font-size: 12px; line-height: 1.6; margin: 0;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #5B7CFA; font-size: 12px; word-break: break-all; margin: 8px 0 0 0;">
              ${resetUrl}
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 24px 30px; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0 0 8px 0;">
              This email was sent by Active Residents
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              Making communities better, one report at a time.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi${userName ? ` ${userName}` : ''},

We received a request to reset your password for your Active Residents account.

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

- The Active Residents Team
    `.trim(),
  };

  if (transport) {
    try {
      const result = await transport.sendMail(mailOptions);
      console.log('Password reset email sent to:', email);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  } else {
    // Log email details in development
    console.log('\n========== PASSWORD RESET EMAIL ==========');
    console.log('To:', email);
    console.log('Subject:', mailOptions.subject);
    console.log('Reset Token:', resetToken);
    console.log('Reset URL:', resetUrl);
    console.log('==========================================\n');
    return { success: true, logged: true };
  }
};

// Send welcome email (optional)
const sendWelcomeEmail = async (email, userName) => {
  const transport = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Active Residents" <noreply@activeresidents.app>',
    to: email,
    subject: 'Welcome to Active Residents!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F7FE; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #5B7CFA 0%, #3B5998 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Active Residents!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6;">
              Hi ${userName || 'there'},
            </p>
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6;">
              Thank you for joining Active Residents! You're now part of a community dedicated to making our neighborhoods better.
            </p>
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6;">
              With Active Residents, you can:
            </p>
            <ul style="color: #6B7280; font-size: 16px; line-height: 1.8;">
              <li>Report local issues to your council</li>
              <li>Track the status of your reports</li>
              <li>Stay updated on community improvements</li>
              <li>Connect with your local representatives</li>
            </ul>
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6;">
              Ready to make a difference? Open the app and report your first issue!
            </p>
          </div>
          <div style="background-color: #F9FAFB; padding: 24px 30px; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              Making communities better, one report at a time.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${userName || 'there'},

Thank you for joining Active Residents! You're now part of a community dedicated to making our neighborhoods better.

With Active Residents, you can:
- Report local issues to your council
- Track the status of your reports
- Stay updated on community improvements
- Connect with your local representatives

Ready to make a difference? Open the app and report your first issue!

- The Active Residents Team
    `.trim(),
  };

  if (transport) {
    try {
      await transport.sendMail(mailOptions);
      console.log('Welcome email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw - welcome email is not critical
      return { success: false, error: error.message };
    }
  } else {
    console.log('Welcome email would be sent to:', email);
    return { success: true, logged: true };
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
