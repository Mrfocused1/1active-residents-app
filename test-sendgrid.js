/**
 * SendGrid API Key Test Script
 * Tests if the SendGrid API key is valid and can send emails
 * Run with: node test-sendgrid.js
 * Make sure .env file exists with SENDGRID_API_KEY
 */

const https = require('https');
require('dotenv').config();

// SendGrid Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = 'noreply@activeresidents.co.uk';
const TO_EMAIL = 'workoutplanmaker@gmail.com'; // Your personal email for testing

if (!SENDGRID_API_KEY) {
  console.error('Error: SENDGRID_API_KEY not found in .env file');
  process.exit(1);
}

// Email content
const emailData = {
  personalizations: [
    {
      to: [{ email: TO_EMAIL }],
      subject: 'SendGrid API Test - Active Residents'
    }
  ],
  from: {
    email: FROM_EMAIL,
    name: 'Active Residents'
  },
  content: [
    {
      type: 'text/plain',
      value: `Hello!

This is a test email from Active Residents to verify that SendGrid integration is working correctly.

✅ API Key: Valid and working
✅ Sender Email: ${FROM_EMAIL}
✅ Domain: www.activeresidents.co.uk

If you receive this email, your SendGrid setup is successful!

---
Active Residents
www.activeresidents.co.uk`
    },
    {
      type: 'text/html',
      value: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #5B7CFA; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .success { color: #4DB6AC; font-weight: bold; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ SendGrid Test - Success!</h1>
    </div>
    <div class="content">
      <p>Hello!</p>

      <p>This is a test email from <strong>Active Residents</strong> to verify that SendGrid integration is working correctly.</p>

      <ul>
        <li class="success">✅ API Key: Valid and working</li>
        <li class="success">✅ Sender Email: ${FROM_EMAIL}</li>
        <li class="success">✅ Domain: www.activeresidents.co.uk</li>
      </ul>

      <p>If you receive this email, your SendGrid setup is <strong>successful</strong>!</p>

      <div class="footer">
        <p>Active Residents<br>
        <a href="http://www.activeresidents.co.uk">www.activeresidents.co.uk</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
    }
  ]
};

console.log('🔐 Testing SendGrid API Key...\n');
console.log('Configuration:');
console.log(`  API Key: ${SENDGRID_API_KEY.substring(0, 20)}...`);
console.log(`  From: ${FROM_EMAIL}`);
console.log(`  To: ${TO_EMAIL}\n`);

// Prepare the request
const postData = JSON.stringify(emailData);

const options = {
  hostname: 'api.sendgrid.com',
  port: 443,
  path: '/v3/mail/send',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('📧 Sending test email via SendGrid API...\n');

// Make the request
const req = https.request(options, (res) => {
  console.log(`Response Status: ${res.statusCode}`);
  console.log(`Response Headers:`, JSON.stringify(res.headers, null, 2));

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('\n' + '='.repeat(60));

    if (res.statusCode === 202) {
      console.log('✅ SUCCESS! Email sent successfully!\n');
      console.log('SendGrid Response: Email accepted for delivery');
      console.log(`Message ID: ${res.headers['x-message-id'] || 'N/A'}`);
      console.log('\nNext Steps:');
      console.log('1. Check your inbox at:', TO_EMAIL);
      console.log('2. Check spam folder if not in inbox');
      console.log('3. DNS verification in SendGrid may take 24-48 hours');
      console.log('\n✨ Your SendGrid API key is working correctly!');
    } else if (res.statusCode === 401) {
      console.log('❌ AUTHENTICATION FAILED');
      console.log('The API key is invalid or has been revoked.');
      console.log('\nPlease verify:');
      console.log('- API key is copied correctly');
      console.log('- API key has not been regenerated');
    } else if (res.statusCode === 403) {
      console.log('❌ FORBIDDEN');
      console.log('The API key does not have permission to send emails.');
      console.log('\nPlease verify:');
      console.log('- API key has "Mail Send" permission enabled');
      console.log('- Sender email is verified in SendGrid');
    } else {
      console.log('⚠️  UNEXPECTED RESPONSE');
      console.log('Status Code:', res.statusCode);
      console.log('Response Body:', responseData || '(empty)');
    }

    console.log('='.repeat(60));
  });
});

req.on('error', (error) => {
  console.log('\n' + '='.repeat(60));
  console.log('❌ ERROR: Request failed');
  console.log('Error Message:', error.message);
  console.log('\nPossible causes:');
  console.log('- No internet connection');
  console.log('- Firewall blocking HTTPS requests');
  console.log('- SendGrid API is down (rare)');
  console.log('='.repeat(60));
});

// Send the request
req.write(postData);
req.end();
