# Active Residents Backend API

Backend server for the Active Residents mobile application.

## Features

- **User Authentication**: Registration, login, password reset
- **Report Management**: Create, read, update, delete community reports
- **Geospatial Queries**: Find nearby reports based on location
- **Email Notifications**: SendGrid integration for transactional emails
- **Push Notifications**: Token management for Expo push notifications
- **Admin Dashboard**: Statistics and report management

## Tech Stack

- **Node.js** & **Express**: Server framework
- **MongoDB** & **Mongoose**: Database
- **SendGrid**: Email service
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `SENDGRID_API_KEY`: SendGrid API key
- `SENDGRID_FROM_EMAIL`: Sender email address

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# Using Homebrew on macOS
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
PUT    /api/auth/update-profile    - Update user profile
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password/:token - Reset password
PUT    /api/auth/change-password   - Change password
```

### Reports

```
POST   /api/reports                - Create new report
GET    /api/reports                - Get all reports (with filters)
GET    /api/reports/:id            - Get single report
PUT    /api/reports/:id            - Update report
DELETE /api/reports/:id            - Delete report
POST   /api/reports/:id/update     - Add update to report (Admin)
POST   /api/reports/:id/vote       - Vote on report
POST   /api/reports/:id/comments   - Add comment to report
GET    /api/reports/stats/overview - Get report statistics (Admin)
```

### Push Tokens

```
POST   /api/push-tokens            - Register push notification token
DELETE /api/push-tokens            - Remove push notification token
GET    /api/push-tokens            - Get user's registered tokens
```

## Query Parameters for Reports

```
GET /api/reports?status=pending&category=pothole&lat=51.5074&lng=-0.1278&radius=5000
```

- `status`: Filter by status (pending, in-progress, resolved, etc.)
- `category`: Filter by category (pothole, graffiti, etc.)
- `priority`: Filter by priority (low, medium, high, urgent)
- `myReports`: Show only user's reports (true/false)
- `lat`: Latitude for geospatial search
- `lng`: Longitude for geospatial search
- `radius`: Search radius in meters (default: 5000)
- `page`: Page number for pagination (default: 1)
- `limit`: Results per page (default: 20)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## Email Templates

The server sends the following emails:

1. **Welcome Email**: Sent when a new user registers
2. **Password Reset**: Sent when user requests password reset
3. **Report Confirmation**: Sent when user creates a report

All emails are sent using SendGrid and use the configured sender email.

## Database Models

### User Model

- name, email, password
- phone, avatar, address
- role (user, admin, moderator)
- pushTokens array
- preferences (email, push notifications)

### Report Model

- title, description, category
- location (GeoJSON Point)
- images array
- status (pending, in-progress, resolved, etc.)
- priority (low, medium, high, urgent)
- votes (upvotes/downvotes)
- comments array
- updates array

## Development

### Running Tests

```bash
npm test
```

### Code Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production MongoDB instance
- [ ] Set up proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure SSL/TLS
- [ ] Set up backup strategy

### Deployment Platforms

This backend can be deployed to:
- **Heroku**
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**
- **Google Cloud Platform**
- **Railway**
- **Render**

## Support

For issues or questions, please contact support or create an issue in the repository.

## License

MIT
