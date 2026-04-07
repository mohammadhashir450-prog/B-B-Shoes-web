# 🧪 Authentication Testing Guide

## ✅ What Was Fixed

1. **Registration API** - Simplified `/api/auth/register` with better error handling and logging
2. **NextAuth Configuration** - Fixed pages config to point to `/login` instead of `/`
3. **CredentialsProvider** - Added detailed console logging for debugging
4. **Error Handling** - Clearer error messages for users

## 🚀 Testing Steps

### 📝 Test 1: User Registration

1. **Open browser** and go to: http://localhost:3000/register
   - (If port 3000 is busy, try 3001 or 3002)

2. **Fill in the form**:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123456`
   - Confirm Password: `Test123456`
   - ✅ Check "I agree to Terms of Service"

3. **Click "CREATE ACCOUNT"**

4. **Expected Results**:
   - ✅ Success message: "Registration successful! Redirecting to login..."
   - ✅ Redirects to login page after 2 seconds
   - ✅ Console logs show: "✅ User created successfully"

5. **If it fails**, check:
   - MongoDB is running: `Get-Process -Name mongod`
   - Browser console (F12) for errors
   - Terminal/PowerShell for server logs

---

### 🔐 Test 2: User Login (Email/Password)

1. **Go to**: http://localhost:3000/login

2. **Enter credentials**:
   - Email: `test@example.com`
   - Password: `Test123456`

3. **Click "SIGN IN"**

4. **Expected Results**:
   - ✅ Redirects to `/home`
   - ✅ Console logs show: "✅ Login successful for: test@example.com"
   - ✅ User is authenticated

5. **Console Logs to Look For**:
   ```
   🔑 Credentials login attempt: test@example.com
   ✅ MongoDB connected for login
   📧 User lookup result: Found
   🔐 Password validation: Valid
   ✅ Login successful for: test@example.com
   ```

---

### 🌐 Test 3: Google OAuth Login

**⚠️ IMPORTANT**: This requires Google OAuth credentials in `.env.local`

1. **Setup Google OAuth** (if not done):
   - Go to: https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret to `.env.local`

2. **Go to**: http://localhost:3000/login

3. **Click "Continue with Google"**

4. **Select your Google account**

5. **Expected Results**:
   - ✅ Redirects to Google login
   - ✅ After approval, redirects to `/home`
   - ✅ User account created automatically in MongoDB
   - ✅ Console shows: "✅ Google Sign-In successful"

---

## 🐛 Troubleshooting

### Issue: "Invalid email or password" (Registration)

**Possible Causes:**
- MongoDB not running
- Missing required fields
- Password too short (< 6 characters)

**Solutions:**
```powershell
# Check MongoDB
Get-Process -Name mongod

# If not running, start it
mongod --dbpath "C:\data\db"

# Check server logs in terminal
```

---

### Issue: "Invalid email or password" (Login)

**Possible Causes:**
- User doesn't exist (register first)
- Wrong password
- MongoDB connection issue

**Solutions:**
1. Make sure you registered the account first
2. Check password is correct
3. Look at console logs:
   ```
   🔑 Credentials login attempt: your@email.com
   ✅ MongoDB connected for login
   📧 User lookup result: Found or Not found
   ```

---

### Issue: Google OAuth Not Working

**Possible Causes:**
- Missing Google credentials in `.env.local`
- Wrong redirect URI in Google Console
- Google+ API not enabled

**Solutions:**
1. Check `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   ```

2. Verify Google Console settings:
   - Redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Google+ API: Enabled

---

### Issue: Registration Form Not Submitting

**Check:**
1. Browser console (F12) for JavaScript errors
2. Network tab - is the POST request being sent?
3. Server terminal - any error logs?

**Debug:**
```javascript
// Open browser console and check:
console.log('Form data:', { name, email, password });
```

---

### Issue: Nothing Happens After Clicking Submit

**Check:**
1. Is the dev server running?
   ```powershell
   Get-NetTCPConnection -LocalPort 3000
   ```

2. Check terminal for server errors

3. Hard reload browser: `Ctrl + Shift + R`

---

## 📊 Verification Commands

### Check MongoDB Users
```javascript
// In MongoDB shell or Compass
use bbluxury
db.users.find().pretty()
```

### Check Server Logs
Look for these in your terminal:
- `📝 Registration attempt: { name: '...', email: '...' }`
- `✅ User created successfully: ...`
- `🔑 Credentials login attempt: ...`
- `✅ Login successful for: ...`

### Check Browser Console
Open browser console (F12) and look for:
- Network requests to `/api/auth/register`
- Response status codes (200 = success, 400 = error)
- Error messages

---

## 🎯 Expected Flow

### Registration Flow:
```
User fills form → Client validates → POST /api/auth/register
→ Server validates → Connects to MongoDB → Checks existing user
→ Hashes password → Creates user → Returns success
→ Shows success message → Redirects to /login
```

### Login Flow:
```
User enters credentials → Click Sign In → signIn('credentials')
→ NextAuth calls CredentialsProvider → Connects to MongoDB
→ Finds user → Compares password → Returns user object
→ Creates JWT session → Redirects to /home
```

### Google OAuth Flow:
```
User clicks Google button → signIn('google') → Redirects to Google
→ User approves → Google redirects back → NextAuth handles callback
→ Creates/finds user in MongoDB → Creates JWT session
→ Redirects to /home
```

---

## 📝 Quick Test Checklist

- [ ] MongoDB is running
- [ ] Dev server started successfully (port 3000/3001/3002)
- [ ] Can access registration page
- [ ] Can submit registration form
- [ ] Success message appears
- [ ] Redirects to login page
- [ ] Can submit login form
- [ ] Login redirects to /home
- [ ] User data saved in MongoDB
- [ ] Console logs show success messages

---

## 🆘 Still Not Working?

### Step-by-Step Debug:

1. **Restart everything**:
   ```powershell
   # Stop dev server
   Get-Process -Name node | Stop-Process -Force
   
   # Clear cache
   Remove-Item ".next" -Recurse -Force
   
   # Start fresh
   npm run dev
   ```

2. **Test MongoDB connection**:
   ```powershell
   npm run test-mongodb
   ```

3. **Check environment variables**:
   ```powershell
   Get-Content .env.local
   ```

4. **Verify all files exist**:
   - `src/lib/auth-options.ts` ✅
   - `src/app/api/auth/register/route.ts` ✅
   - `src/app/api/auth/[...nextauth]/route.ts` ✅
   - `src/models/User.ts` ✅
   - `src/lib/mongodb.ts` ✅

---

## 📞 Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Please provide all required fields" | Missing name, email, or password | Fill all form fields |
| "Password must be at least 6 characters" | Password too short | Use longer password |
| "User already exists" | Email already registered | Use different email or login |
| "Invalid email or password" | Wrong credentials | Check spelling, register first |
| "MongoDB connection failed" | Database issue | Start MongoDB |

---

## ✅ Success Indicators

You'll know it's working when you see:

### In Terminal:
```
📝 Registration attempt: { name: 'Test User', email: 'test@example.com' }
✅ Connected to MongoDB
✅ Password hashed
✅ User created successfully: test@example.com

🔑 Credentials login attempt: test@example.com
✅ MongoDB connected for login
📧 User lookup result: Found
🔐 Password validation: Valid
✅ Login successful for: test@example.com
```

### In Browser:
- Green success messages
- Smooth redirects
- No error messages in console (F12)
- `/home` page loads after login

---

Good luck with testing! 🚀
