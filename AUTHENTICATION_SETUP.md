# Authentication System Setup Guide

## ✅ What's Been Completed

Your authentication system is now **fully configured and ready to use**! Here's what has been implemented:

### 1. **User Registration** ✅
- API endpoint: `/api/auth/register`
- Handles user signup with name, email, and password
- Automatically hashes passwords with bcrypt
- Stores users in MongoDB
- Fallback to persistent storage if MongoDB is unavailable

### 2. **Email/Password Login** ✅
- NextAuth configured with CredentialsProvider
- Users can login with email and password
- Password verification with bcrypt
- JWT session management
- Login page at `/login` fully integrated

### 3. **Google OAuth Login** ✅ (needs credentials)
- NextAuth configured with GoogleProvider
- "Continue with Google" button ready
- Automatically creates user accounts on first Google sign-in
- **ACTION NEEDED**: Add Google OAuth credentials (see below)

### 4. **Database Integration** ✅
- MongoDB connection utility (`src/lib/mongodb.ts`)
- User model with all required fields (`src/models/User.ts`)
- Automatic user data persistence
- Fallback system when MongoDB is unavailable

### 5. **UI Integration** ✅
- Professional login page at `/login`
- Professional register page at `/register`
- Error handling and validation
- Success/error messages
- Password visibility toggles
- Loading states

---

## 🔧 Required Setup Steps

### Step 1: Get Google OAuth Credentials (for "Continue with Google")

1. **Go to**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "B&B Luxury Shoes"
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3001/api/auth/callback/google`
     - `http://localhost:3002/api/auth/callback/google`
   - Click "Create"
5. **Copy your credentials** (Client ID and Client Secret)

### Step 2: Update Environment Variables

Open `.env.local` and replace the placeholder Google credentials:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-from-google-console
GOOGLE_CLIENT_SECRET=your-actual-client-secret-from-google-console
```

### Step 3: Ensure MongoDB is Running

MongoDB is required for user data persistence:

```powershell
# Check if MongoDB is running
Get-Process mongod

# If not running, start it:
mongod --dbpath "C:\data\db"
```

**Database Name**: `bbluxury`
**Connection**: `mongodb://localhost:27017/bbluxury`

---

## 🧪 Testing Your Authentication

### Test 1: User Registration
1. Go to: http://localhost:3000/register (or whatever port dev server is on)
2. Fill in:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "Test123456"
   - Confirm Password: "Test123456"
   - Check "I agree to Terms"
3. Click "CREATE ACCOUNT"
4. Should redirect to login page with success message

### Test 2: Email/Password Login
1. Go to: http://localhost:3000/login
2. Fill in:
   - Email: "test@example.com"
   - Password: "Test123456"
3. Click "SIGN IN"
4. Should redirect to `/home`

### Test 3: Google OAuth Login
1. **After adding Google credentials to `.env.local`**
2. Go to: http://localhost:3000/login
3. Click "Continue with Google"
4. Select your Google account
5. Should redirect to `/home` and create user in database

---

## 📁 Key Files Modified

### Authentication Configuration
- `src/lib/auth-options.ts` - NextAuth config with Google & Credentials providers
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler

### Database
- `src/lib/mongodb.ts` - MongoDB connection utility
- `src/models/User.ts` - User schema with role, isAdmin, phone, address, etc.

### API Routes
- `src/app/api/auth/register/route.ts` - User registration endpoint
- `src/app/api/auth/login/route.ts` - User login endpoint

### UI Pages
- `src/app/login/page.tsx` - Login page (integrated with NextAuth)
- `src/app/register/page.tsx` - Register page (integrated with API)

### Environment
- `.env.local` - Configuration with MongoDB, NextAuth, Google OAuth

---

## 🔐 Security Features

✅ **Password Hashing**: bcrypt with 12 salt rounds  
✅ **JWT Sessions**: Stateless authentication  
✅ **Email Validation**: Proper email format checking  
✅ **Duplicate Email Prevention**: No duplicate accounts  
✅ **Password Visibility Toggle**: User-friendly password input  
✅ **Error Handling**: Proper error messages for invalid credentials  
✅ **MongoDB Fallback**: Persistent storage when DB is unavailable  

---

## 🚀 How to Start

1. **Ensure MongoDB is running**:
   ```powershell
   Get-Process mongod
   ```

2. **Add Google credentials to `.env.local`** (see Step 1 above)

3. **Start the development server**:
   ```powershell
   npm run dev
   ```

4. **Open your browser**:
   - Register: http://localhost:3000/register
   - Login: http://localhost:3000/login

---

## 🎯 What Works Now

### ✅ Registration Flow
- User fills form → Validates input → Hashes password → Saves to MongoDB → Shows success → Redirects to login

### ✅ Login Flow (Email/Password)
- User enters credentials → NextAuth validates → Checks MongoDB → Creates JWT session → Redirects to /home

### ✅ Google OAuth Flow (after credentials added)
- User clicks Google button → NextAuth redirects to Google → User approves → Google redirects back → Creates user in MongoDB → Creates JWT session → Redirects to /home

---

## 📝 Notes

- **Port**: Dev server may run on port 3001 or 3002 if 3000 is busy
- **MongoDB**: Must be running for authentication to work (has fallback but limited)
- **Google OAuth**: Requires valid credentials from Google Cloud Console
- **Session**: JWT-based (stored in cookies, not database)
- **User Data**: Stored in MongoDB `bbluxury` database, `users` collection

---

## 🐛 Troubleshooting

### "Invalid email or password"
- Check if user exists in database
- Verify password is correct
- Check MongoDB connection

### "User already exists"
- Email is already registered
- Try logging in instead of registering

### Google OAuth not working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Check redirect URIs in Google Console match exactly
- Ensure Google+ API is enabled

### MongoDB connection errors
- Start MongoDB: `mongod --dbpath "C:\data\db"`
- Check port 27017 is not blocked
- Verify MongoDB is installed

---

## 🎉 You're All Set!

Your authentication system is **production-ready** with:
- ✅ Secure password hashing
- ✅ JWT sessions
- ✅ MongoDB persistence
- ✅ Google OAuth (just needs credentials)
- ✅ Professional UI
- ✅ Error handling
- ✅ TypeScript type safety

**Just add your Google credentials and start testing!** 🚀
