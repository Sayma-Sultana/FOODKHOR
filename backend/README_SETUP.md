# Backend Setup Guide

## Step 1: Install Dependencies

Make sure you're in the backend directory, then run:

```bash
npm install
```

This will install:
- express
- mongoose
- cors
- dotenv
- cookie-parser
- jsonwebtoken
- bcryptjs
- validator

## Step 2: Check Environment Variables

Make sure `backend/config/config.env` has:

```
PORT = 4000
FRONTEND_URL = http://localhost:5173
MONGO_URI = mongodb+srv://saymasultanar3_db_user:TocUgXTDjyjpLBIN@cluster0.ces4zos.mongodb.net/?retryWrites=true
JWT_SECRET_KEY = your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES = 15m
NODE_ENV = Development
```

## Step 3: Start the Server

Run the development server:

```bash
npm run dev
```

You should see:
- "Server Running On PORT 4000"
- "Connected to database successfully!"

## Step 4: Verify Server is Running

Open your browser and go to: http://localhost:4000/api/v1/auth/me

You should get an error (which is expected if not logged in), but it means the server is running!

## Troubleshooting

### If MongoDB connection fails:
1. Check your MongoDB Atlas connection string
2. Make sure your IP is whitelisted in MongoDB Atlas
3. Check if the database name "RESTAURANT" exists or needs to be created

### If port 4000 is already in use:
Change PORT in config.env to another port (e.g., 4001) and update frontend API calls accordingly.

### If dependencies fail to install:
Make sure you have Node.js installed (version 14 or higher recommended).
