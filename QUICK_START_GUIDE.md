# Quick Start Guide - Active Residents

## 🚀 Get Your App Running in 5 Minutes

### Step 1: Start MongoDB

You need MongoDB running for the backend. Choose one option:

**Option A: Using Homebrew (macOS)**
```bash
brew services start mongodb-community
```

**Option B: Using Docker**
```bash
docker run -d -p 27017:27017 --name active-residents-db mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `backend/.env`

---

### Step 2: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Active Residents API Server
   Port: 3000
   URL: http://localhost:3000
```

Test it:
```bash
curl http://localhost:3000/health
```

---

### Step 3: Start the Mobile App

In a new terminal:

```bash
cd "/Users/paulbridges/mobile app1"
npx expo start
```

---

## 📱 Testing the App

### 1. Test User Registration

In your mobile app:
1. Click "Sign Up"
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Register"

You should receive a welcome email at the address you provided!

### 2. Test Login

1. Click "Login"
2. Enter your email and password
3. You should be logged in

### 3. Test Forgot Password

1. Click "Forgot Password"
2. Enter your email
3. Check your inbox for reset instructions
4. Follow the link to reset your password

### 4. Test Report Creation

1. Create a new report
2. Check your email for confirmation
3. View the report in the app

---

## 🧪 Test Endpoints Manually

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+44 7700 900000"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

### Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create a Report
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Pothole on Main Street",
    "description": "Large pothole needs repair",
    "category": "pothole",
    "location": {
      "coordinates": [-0.1278, 51.5074],
      "address": "Main Street, London"
    }
  }'
```

### Get All Reports
```bash
curl http://localhost:3000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Nearby Reports (within 5km of London)
```bash
curl "http://localhost:3000/api/reports?lat=51.5074&lng=-0.1278&radius=5000" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔍 Check Services Are Working

### SendGrid Email
```bash
cd "/Users/paulbridges/mobile app1"
node test-sendgrid.js
```

Should send a test email to workoutplanmaker@gmail.com

### MongoDB
```bash
# Check if MongoDB is running
mongosh
# Then type:
show dbs
use active-residents
show collections
```

### Backend API
```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "success": true,
  "message": "Active Residents API is running",
  "timestamp": "...",
  "environment": "development"
}
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running: `brew services start mongodb-community`
- Or check Docker: `docker ps` to see if container is running
- Try: `mongosh` to connect manually

### "EADDRINUSE: address already in use"
```bash
# Find process using port 3000
lsof -ti:3000
# Kill it
lsof -ti:3000 | xargs kill
# Or kill all expo processes
pkill -f expo
```

### "Failed to send email"
- Wait 24-48 hours for DNS records to propagate
- Check SendGrid dashboard: https://app.sendgrid.com
- Verify API key is correct in `backend/.env`

### "Token expired" errors
- Re-login to get a fresh token
- Tokens expire after 7 days (configurable in `.env`)

---

## 📊 Monitor Your App

### Backend Logs
Watch the terminal where you ran `npm run dev` to see:
- All API requests
- Database operations
- Email sending
- Errors

### MongoDB Data
```bash
mongosh
use active-residents
db.users.find().pretty()
db.reports.find().pretty()
```

### SendGrid Dashboard
- https://app.sendgrid.com
- View email statistics
- Check delivery rates

---

## 🎯 What to Test Next

1. ✅ User registration → Check welcome email
2. ✅ Login → Get JWT token
3. ✅ Forgot password → Check reset email
4. ✅ Create report → Check confirmation email
5. ✅ View reports → See your reports list
6. ✅ Vote on reports → Test voting system
7. ✅ Add comments → Test comment functionality
8. ✅ Search nearby → Test geospatial queries

---

## 🔐 API Authentication

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get your token by:
1. Registering or logging in
2. Copy the `token` from the response
3. Add to headers of subsequent requests

---

## 📱 Mobile App Features

- User registration & login
- Password reset flow
- Report creation with location
- View nearby reports
- Vote on reports
- Add comments
- Push notifications
- Analytics tracking
- Crash reporting

---

## 🎉 You're All Set!

Your Active Residents app is now fully functional with:
- ✅ Backend API running
- ✅ MongoDB connected
- ✅ SendGrid emails working
- ✅ Mobile app connected
- ✅ All services initialized

Happy coding! 🚀
