# Google OAuth Setup Guide

This guide will help you set up Google OAuth for the authentication system.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"

## Step 2: Configure OAuth Consent Screen

1. Click on "OAuth consent screen" in the sidebar
2. Select "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name
   - User support email
   - Developer contact information
4. Add the following scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
5. Save and continue

## Step 3: Create OAuth Client ID

1. Click on "Credentials" in the sidebar
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Add a name for your OAuth client
5. Add the following authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production URL (if applicable)
6. Add the following authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - Your production callback URL (if applicable)
7. Click "Create"

## Step 4: Set Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_key
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Replace `your_google_client_id` and `your_google_client_secret` with the values from the Google Cloud Console.

## Step 5: Restart the Server

After setting up the environment variables, restart the server to apply the changes. 