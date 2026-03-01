# Google Sign-In & OTP Email System - Setup Complete ✅

## 🎉 Features Implemented

### 1. **Google Sign-In** (NextAuth)
- ✅ Sign in with Google button on Login page
- ✅ Sign up with Google button on Register page
- ✅ Automatic user creation in MongoDB
- ✅ Role-based access control
- ✅ JWT session management

### 2. **Email OTP Authentication**
- ✅ OTP login option (alternative to password)
- ✅ 6-digit OTP generation
- ✅ Beautiful email templates
- ✅ 10-minute OTP expiration
- ✅ Rate limiting (5 attempts)
- ✅ Resend OTP functionality
- ✅ Welcome emails on registration

### 3. **Enhanced Login Page**
- ✅ Toggle between Password and OTP login
- ✅ Google Sign-In integration
- ✅ OTP verification flow
- ✅ Real-time countdown timer
- ✅ Animated UI with Framer Motion

---

## 🔧 Required Setup

### Step 1: Google OAuth Credentials (ALREADY DONE BEFORE)

You should already have:
- ✅ GOOGLE_CLIENT_ID
- ✅ GOOGLE_CLIENT_SECRET
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL

If not, refer to `GOOGLE_AUTH_SETUP.md`

---

### Step 2: Gmail App Password (NEW - REQUIRED FOR OTP)

#### Option A: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select App: "Mail"
   - Select Device: "Other (Custom name)" → Enter "B&B Shoes"
   - Click **Generate**
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Add to .env.local:**
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
   > **Note:** Remove spaces from the app password

#### Option B: SendGrid (Production Alternative)

If you prefer SendGrid:
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key
3. Update `src/lib/email-service.ts` to use SendGrid instead of nodemailer

---

### Step 3: Update .env.local File

Your `.env.local` should have:

```env
# MongoDB
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/bb-shoes?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001

# Email for OTP
EMAIL_USER=your-gmail@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

---

### Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 Testing Guide

### Test 1: Password Login (Existing)
1. Go to `http://localhost:3001/login`
2. Enter email and password
3. Click "Sign In"
4. ✅ Should redirect to /home

### Test 2: Google Sign-In
1. Go to `http://localhost:3001/login`
2. Click "Continue with Google"
3. Select your Google account
4. ✅ Should redirect to /home
5. Check MongoDB - user should be created with `provider: "google"`

### Test 3: OTP Login
1. Go to `http://localhost:3001/login`
2. Click "Use OTP Instead"
3. Enter your email
4. Click "Send OTP to Email"
5. Check your email inbox
6. Enter the 6-digit OTP
7. Click "Verify OTP"
8. ✅ Should redirect to /home

### Test 4: OTP Registration (Future Enhancement)
> Currently, OTP is for login only. Register still uses password.
> To add OTP registration, update the Sign Up form similarly.

---

## 📧 Email Templates

### OTP Email Features:
- 🎨 Beautiful gradient design
- 🔐 6-digit OTP in large font
- ⏰ 10-minute expiration notice
- ⚠️ Security warning
- 📱 Mobile-responsive

### Welcome Email Features:
- 🎉 Welcome message
- ✨ Feature highlights
- 🔗 "Start Shopping" button
- 📞 Support information

---

## 🔒 Security Features

### OTP System:
- ✅ 10-minute expiration
- ✅ Maximum 5 attempts
- ✅ Automatic cleanup of old OTPs
- ✅ Email-only delivery
- ✅ One-time use
- ✅ Hashed storage in database

### Google OAuth:
- ✅ Secure OAuth 2.0 flow
- ✅ JWT session tokens
- ✅ MongoDB session storage
- ✅ Role-based access control
- ✅ CSRF protection

---

## 📁 Files Created/Modified

### New Files:
1. `src/lib/email-service.ts` - Email sending utilities
2. `src/models/OTP.ts` - OTP database model
3. `src/app/api/auth/send-otp/route.ts` - Send OTP API
4. `src/app/api/auth/verify-otp/route.ts` - Verify OTP API

### Modified Files:
1. `src/app/login/page.tsx` - Added Google & OTP login
2. `.env.example` - Added email configuration

### Existing Files (Already Created):
- `src/lib/auth-options.ts` - NextAuth config
- `src/lib/mongodb-client.ts` - MongoDB client
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler

---

## 🐛 Troubleshooting

### Issue: "Failed to send OTP"

**Solution:**
- Check EMAIL_USER and EMAIL_APP_PASSWORD in .env.local
- Verify Gmail App Password is correct (16 characters)
- Make sure 2FA is enabled on Gmail account

### Issue: "Invalid credentials" (Gmail)

**Solution:**
- Regenerate Gmail App Password
- Remove all spaces from the password
- Use the password directly in .env.local

### Issue: "User not found" when using OTP

**Solution:**
- OTP login only works for existing users
- Create account first using password or Google Sign-In
- Then use OTP for login

### Issue: Google Sign-In not working

**Solution:**
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Verify redirect URI in Google Console
- Restart development server

### Issue: OTP not received

**Solutions:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check server logs for email sending errors
4. Ensure Gmail App Password is valid

---

## 🎯 User Flow Examples

### Flow 1: New User with Google
```
1. Click "Continue with Google"
2. Select Google account
3. Auto-created in MongoDB
4. Redirects to /home
5. Can use Google or OTP for future logins
```

### Flow 2: New User with Password
```
1. Click "Sign Up" tab
2. Enter name, email, password
3. Click "Sign Up"
4. Account created
5. Switch to "Sign In" tab
6. Login with password OR OTP
```

### Flow 3: Existing User with OTP
```
1. Enter email
2. Click "Use OTP Instead"
3. Click "Send OTP to Email"
4. Check email (B&B Shoes)
5. Enter 6-digit code
6. Click "Verify OTP"
7. Logged in!
```

---

## 🚀 Production Deployment

### Environment Variables:

1. **Vercel/Netlify:**
   - Add all env variables in dashboard
   - Update NEXTAUTH_URL to production domain
   - Update Google OAuth redirect URIs

2. **Email Service:**
   - For production, consider:
     - SendGrid (recommended)
     - AWS SES
     - Mailgun
   - Gmail has daily sending limits

3. **MongoDB:**
   - Use MongoDB Atlas
   - Whitelist deployment IP addresses

---

## 📞 Support

If you encounter issues:
1. Check server console logs
2. Verify all .env.local variables
3. Test email credentials separately
4. Check MongoDB connection

---

## ✅ Checklist

Before testing:
- [ ] Gmail 2FA enabled
- [ ] Gmail App Password generated
- [ ] EMAIL_USER added to .env.local
- [ ] EMAIL_APP_PASSWORD added to .env.local
- [ ] GOOGLE_CLIENT_ID added
- [ ] GOOGLE_CLIENT_SECRET added
- [ ] NEXTAUTH_SECRET added
- [ ] NEXTAUTH_URL set to http://localhost:3001
- [ ] Development server restarted
- [ ] MongoDB connection working

---

**🎉 Everything is ready! Test the login page now!**

Visit: `http://localhost:3001/login`
