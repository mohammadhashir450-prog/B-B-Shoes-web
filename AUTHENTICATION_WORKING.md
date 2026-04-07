# 🎯 Authentication Working Guide

## ✅ System Status (Verified)

- ✅ **MongoDB**: Running on port 27017
- ✅ **Dev Server**: Running on port 3000  
- ✅ **NextAuth**: Configured and working
- ✅ **Registration API**: Tested and working (Status 201)
- ✅ **Session Endpoint**: Working (Status 200)
- ✅ **CSRF Protection**: Working (Status 200)

---

## 🚀 How to Test (Step by Step)

### 📝 **Step 1: Register a New User**

1. **Open**: http://localhost:3000/register

2. **Open Browser Console** (Press `F12` → Console tab)
   - You'll see detailed logs of what's happening

3. **Fill the form**:
   ```
   Full Name: Test User
   Email: newuser@example.com
   Password: Test123456
   Confirm Password: Test123456
   ✅ Check "I agree to Terms of Service"
   ```

4. **Click "CREATE ACCOUNT"**

5. **What You'll See**:
   - Browser console: `📝 Registration attempt: { name: 'Test User', email: '...' }`
   - Browser console: `✅ Registration successful`
   - Green success message: "Registration successful! Redirecting to login..."
   - Automatic redirect to login page after 2 seconds

6. **Terminal logs** (in PowerShell where `npm run dev` is running):
   ```
   📝 Registration attempt: { name: 'Test User', email: '...' }
   ✅ Connected to MongoDB
   ✅ Password hashed
   ✅ User created successfully: newuser@example.com
   ```

---

### 🔐 **Step 2: Login with Email/Password**

1. **Open**: http://localhost:3000/login

2. **Keep Browser Console open** (F12)

3. **Enter credentials**:
   ```
   Email: newuser@example.com
   Password: Test123456
   ```

4. **Click "SIGN IN"**

5. **What You'll See**:
   - Browser console: `🔐 Login attempt: { email: 'newuser@example.com' }`
   - Browser console: `📊 Login result: { ok: true, ... }`
   - Browser console: `✅ Login successful, redirecting...`
   - Automatic redirect to `/home`

6. **Terminal logs**:
   ```
   🔑 Credentials login attempt: newuser@example.com
   ✅ MongoDB connected for login
   📧 User lookup result: Found
   🔐 Password validation: Valid
   ✅ Login successful for: newuser@example.com
   🎫 JWT token created instantly for: newuser@example.com
   ✅ Session created for: newuser@example.com Role: user
   ```

---

### 🌐 **Step 3: Google OAuth (Optional)**

**⚠️ Requires Google OAuth credentials in `.env.local`**

1. **Setup** (if not done):
   - Go to: https://console.cloud.google.com/
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID and Secret to `.env.local`:
     ```env
     GOOGLE_CLIENT_ID=your-actual-client-id
     GOOGLE_CLIENT_SECRET=your-actual-client-secret
     ```

2. **Test**:
   - Go to login or register page
   - Click "Continue with Google" or "Sign Up with Google"
   - Browser console: `🌐 Google sign-in initiated`
   - Select Google account
   - Should redirect to `/home` after approval

---

## 🐛 Troubleshooting

### Issue: "Nothing happens when I click Submit"

**Solutions**:
1. Open browser console (F12) - check for JavaScript errors
2. Check if form fields are filled correctly
3. Make sure checkbox is checked (for register)
4. Hard refresh: `Ctrl + Shift + R`

---

### Issue: "Invalid email or password" (when registering)

**Check**:
1. Email already exists - try different email
2. Password too short - must be at least 6 characters
3. Check terminal logs for specific error

---

### Issue: "Invalid email or password" (when logging in)

**Solutions**:
1. **Make sure user is registered first**
2. Check password spelling/case
3. Check browser console for error details
4. Check terminal logs:
   ```
   📧 User lookup result: Not found  ← User doesn't exist
   🔐 Password validation: Invalid  ← Wrong password
   ```

---

### Issue: "Please sign in with the provider you used to register"

**Meaning**: This user was created with Google OAuth, not email/password

**Solution**: Use "Continue with Google" instead

---

## 📊 Debug Checklist

When testing, monitor these 3 places:

### 1. **Browser Console** (F12 → Console)
```
✅ Good logs:
   🔐 Login attempt: { email: '...' }
   📊 Login result: { ok: true }
   ✅ Login successful, redirecting...

❌ Error logs:
   ❌ Login error: Invalid email or password
   ❌ Login exception: ...
```

### 2. **Browser Network Tab** (F12 → Network)
```
✅ Check these requests:
   POST /api/auth/register → Status 201 (success)
   POST /api/auth/callback/credentials → Status 200 or 302
   GET /api/auth/session → Status 200

❌ If you see:
   Status 400 → Bad request (check form data)
   Status 500 → Server error (check terminal)
```

### 3. **Terminal/PowerShell** (where npm run dev is running)
```
✅ Registration success:
   📝 Registration attempt: ...
   ✅ Connected to MongoDB
   ✅ User created successfully

✅ Login success:
   🔑 Credentials login attempt: ...
   ✅ MongoDB connected for login
   📧 User lookup result: Found
   🔐 Password validation: Valid
   ✅ Login successful

❌ Errors:
   ❌ No user found with email: ...
   ❌ Invalid password for: ...
   ❌ User has no password (OAuth user?)
```

---

## 🧪 Quick Test Commands

### Test Registration API:
```powershell
$body = @{name='Test User';email='quicktest@example.com';password='Test123456'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/register' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

**Expected**: Status 201, response with user data

### Test Session:
```powershell
Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/session' -Method GET -UseBasicParsing
```

**Expected**: Status 200

---

## 📝 Test User Accounts (Already in Database)

Based on terminal logs, these users already exist:
```
mohammadhashir450@gmail.com
rabbit@gmail.com
mohammadhashir45@gmail.com
fa23-bcs-026@cuisahiwal.edu.pk
quicktest@example.com
ali@gmail.com
abdulhaseebnasir344@gmail.com
unclemajboor22@gmail.com
keybord278@gmail.com
akram1@gmail.com
testuser@example.com (just created)
```

**⚠️ Don't register with these emails** - they already exist!

---

## ✅ What Works Now

### ✅ Registration:
- Form validation ✓
- Password hashing (bcrypt) ✓
- MongoDB storage ✓
- Duplicate email check ✓
- Success/error messages ✓
- Auto-redirect to login ✓
- Console logging ✓

### ✅ Login:
- Email/password authentication ✓
- Password verification ✓
- JWT session creation ✓
- Redirect to /home ✓
- Error handling ✓
- Console logging ✓

### ✅ Google OAuth:
- Button configured ✓
- NextAuth integration ✓
- Auto user creation ✓
- Needs credentials ⏳

---

## 🎯 Expected User Flow

### Registration → Login:
```
1. User goes to /register
2. Fills form → clicks CREATE ACCOUNT
3. Server creates user in MongoDB
4. Shows success message
5. Redirects to /login (2 seconds)
6. User enters same credentials
7. Clicks SIGN IN
8. NextAuth validates credentials
9. Creates JWT session
10. Redirects to /home
11. ✅ User is now logged in!
```

---

## 📞 Still Having Issues?

### Step-by-step reset:

1. **Clear browser data**:
   - Press `Ctrl + Shift + Delete`
   - Clear cookies and cache
   - Close browser

2. **Restart dev server**:
   ```powershell
   # In terminal where npm run dev is running:
   Ctrl + C  # Stop server
   npm run dev  # Start again
   ```

3. **Try with fresh email**:
   - Use email you haven't tried before
   - Example: `yourname-$(Get-Date -Format 'HHmmss')@test.com`

4. **Check MongoDB**:
   ```powershell
   Get-Process -Name mongod  # Should show running
   ```

---

## 🎉 Success Confirmation

You'll know authentication is working when:

✅ Registration:
- Green success message appears
- Console shows `✅ Registration successful`
- Terminal shows `✅ User created successfully`
- Redirects to login page

✅ Login:
- No error messages
- Console shows `✅ Login successful, redirecting...`
- Terminal shows `✅ Login successful for: your@email.com`
- Redirects to `/home` page
- Session persists (refresh page, still logged in)

---

## 💡 Pro Tips

1. **Always keep browser console open** (F12) when testing
2. **Watch terminal logs** - they show exactly what's happening
3. **Use unique emails** for each test to avoid conflicts
4. **Password must be 6+ characters**
5. **Check "I agree" checkbox** on registration
6. **Passwords must match** on registration
7. **If stuck, try different email** - user might already exist

---

## 🆘 Common Mistakes

❌ Email already registered → Try different email
❌ Password too short → Use 6+ characters
❌ Forgot checkbox → Check "I agree to Terms"
❌ Passwords don't match → Retype carefully
❌ MongoDB not running → Start MongoDB
❌ Server not running → Run `npm run dev`
❌ Port blocked → Restart everything

---

## 📚 Updated Features

### ✅ New UI Changes:
- ✅ "B&B Luxury" → "B&B Shoes"
- ✅ Added "Brands You Like" slogan
- ✅ Removed Collections, Craftsmanship, Concierge buttons
- ✅ "Elite Access Portal" → "B&B Shoes"
- ✅ Footer updated: "© 2023 B&B Shoes • Brands You Like"

### ✅ New Debug Features:
- ✅ Console logging in browser
- ✅ Detailed error messages
- ✅ Server-side logging
- ✅ Better error handling
- ✅ Result validation

---

🎯 **Ready to test!** Open http://localhost:3000/register and start with registration! 🚀
