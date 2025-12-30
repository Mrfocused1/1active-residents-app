# Active Residents Backend API

Express.js backend for the Active Residents mobile app.

## Features

- User authentication (register, login, logout)
- Password management (change, reset)
- Account deletion (App Store requirement)
- Report management
- Push notification tokens
- In-memory storage (works without MongoDB)
- MongoDB support (optional, for persistence)

## Quick Start

### Local Development

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

Server runs at http://localhost:3000

### Deploy to Railway

1. Go to [railway.app](https://railway.app)

2. Click "New Project" > "Deploy from GitHub repo"

3. Select your repository and the `backend` folder

4. Add environment variables:
   - `JWT_SECRET`: A secure random string
   - `MONGODB_URI`: (Optional) Your MongoDB connection string

5. Railway will auto-deploy on push

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/delete-account` - Delete account
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/verify-email` - Verify email

#### Reports
- `GET /api/reports` - Get user's reports
- `POST /api/reports` - Create report
- `GET /api/reports/:id` - Get single report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/update` - Add update
- `POST /api/reports/:id/vote` - Vote on report
- `POST /api/reports/:id/comments` - Add comment
- `GET /api/reports/:id/emails` - Get email thread
- `POST /api/reports/:id/emails` - Send email

#### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Delete all

#### Push Tokens
- `POST /api/push-tokens` - Register token
- `DELETE /api/push-tokens` - Remove token
- `GET /api/push-tokens` - Get tokens

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Server port (default: 3000) |
| JWT_SECRET | Yes | Secret for JWT tokens |
| MONGODB_URI | No | MongoDB connection string |
| SMTP_HOST | No | Email server host |
| SMTP_PORT | No | Email server port |
| SMTP_USER | No | Email username |
| SMTP_PASS | No | Email password |

## Storage

The backend works in two modes:

1. **In-memory** (default): Data stored in memory, lost on restart
2. **MongoDB**: Persistent storage when `MONGODB_URI` is set

For production, MongoDB is recommended for data persistence.
