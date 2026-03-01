# 🚀 B&B Shoes - Google Sign-In & OTP Setup (PRODUCTION READY)

## ⚡ QUICK START - Follow These Steps EXACTLY

### ✅ STEP 1: Google OAuth Setup (5 minutes)

#### 1.1 Create Google Cloud Project

1. **Open Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project:**
   - Click "Select a project" (top left)
   - Click "NEW PROJECT"
   - Project name: `B&B Shoes`
   - Click "CREATE"

#### 1.2 Enable Google+ API

1. **Go to API Library:**
   - Visit: https://console.cloud.google.com/apis/library
   - Search for "Google+ API"
   - Click on it
   - Click "ENABLE"

#### 1.3 Create OAuth Credentials

1. **Go to Credentials:**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Click "CREATE CREDENTIALS"
   - Select "OAuth 2.0 Client ID"

2. **Configure Consent Screen (if asked):**
   - Click "CONFIGURE CONSENT SCREEN"
   - Select "External"
   - Click "CREATE"
   - Fill in:
     - App name: `B&B Shoes`
     - User support email: `your-email@gmail.com`
     - Developer contact: `your-email@gmail.com`
   - Click "SAVE AND CONTINUE"
   - Skip Scopes → "SAVE AND CONTINUE"
   - Add Test Users → Add your email → "ADD" → "SAVE AND CONTINUE"
   - Click "BACK TO DASHBOARD"

3. **Create OAuth Client ID:**
   - Go back to: https://console.cloud.google.com/apis/credentials
   - Click "CREATE CREDENTIALS" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: `B&B Shoes Web App`
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   
   - Click "CREATE"

4. **Copy Credentials:**
   - You'll see a popup with:
     - **Client ID** (like: `123456789-abc.apps.googleusercontent.com`)
     - **Client Secret** (like: `GOCSPX-abc123xyz`)
   - **KEEP THIS WINDOW OPEN** or download JSON

---

### ✅ STEP 2: Gmail App Password for OTP (3 minutes)

#### 2.1 Enable 2-Factor Authentication

1. **Go to Google Account Security:**
   - Visit: https://myaccount.google.com/security
   - Find "2-Step Verification"
   - Click "Get Started"
   - Follow prompts to enable 2FA

#### 2.2 Generate App Password

1. **Create App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - You may need to sign in again
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: `B&B Shoes OTP`
   - Click "GENERATE"

2. **Copy the 16-character password:**
   - Example: `abcd efgh ijkl mnop`
   - **REMOVE ALL SPACES** → `abcdefghijklmnop`
   - **KEEP THIS SAFE**

---

### ✅ STEP 3: Update .env.local File

1. **Open file:** `.env.local` in your project
2. **Find these lines and update:**

```env
# Google OAuth Credentials (REQUIRED for Google Sign-In)
GOOGLE_CLIENT_ID="YOUR_ACTUAL_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="YOUR_ACTUAL_CLIENT_SECRET_HERE"

# Gmail SMTP for sending OTPs
EMAIL_USER="your-actual-gmail@gmail.com"
EMAIL_APP_PASSWORD="your16digitapppassword"
```

**Example (with real values):**
```env
GOOGLE_CLIENT_ID="123456789-abc123def.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123xyz789"
EMAIL_USER="hashir@gmail.com"
EMAIL_APP_PASSWORD="abcdefghijklmnop"
```

3. **Save the file**

---

### ✅ STEP 4: Start Server

```bash
npm run dev
```

**Server will start on:** http://localhost:3000

---

### ✅ STEP 5: Test Everything

#### Test 1: Google Sign-In ✅

1. Open: http://localhost:3000/login
2. Click **"Continue with Google"** button
3. Select your Google account
4. ✅ **SUCCESS:** You should be redirected to `/home`
5. Check MongoDB → `users` collection → Your user should be created

#### Test 2: OTP Login ✅

1. Open: http://localhost:3000/login
2. Click **"Use OTP Instead"**
3. Enter your email (must be a registered user)
4. Click **"Send OTP to Email"**
5. Check your Gmail inbox
6. Copy the 6-digit OTP
7. Enter OTP
8. Click **"Verify OTP"**
9. ✅ **SUCCESS:** You should be logged in

---

## 🔧 Troubleshooting

### Issue 1: "Invalid Client ID"
**Solution:**
- Check `GOOGLE_CLIENT_ID` in `.env.local`
- Make sure you copied the full ID (ends with `.apps.googleusercontent.com`)
- Restart server: `npm run dev`

### Issue 2: "Redirect URI Mismatch"
**Solution:**
- Go to Google Cloud Console → Credentials
- Edit your OAuth 2.0 Client
- Make sure redirect URI is EXACTLY:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- No trailing slash, no extra spaces

### Issue 3: "Failed to Send OTP"
**Solution:**
- Check `EMAIL_USER` and `EMAIL_APP_PASSWORD` in `.env.local`
- Make sure 2FA is enabled on Gmail
- Make sure App Password has NO SPACES
- Example correct format: `abcdefghijklmnop` (16 chars)

### Issue 4: "Configuration Error"
**Solution:**
- All these variables must be set in `.env.local`:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `EMAIL_USER`
  - `EMAIL_APP_PASSWORD`
- Restart server after updating `.env.local`

### Issue 5: "OTP Not Received"
**Solution:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check server console for errors
4. Try Gmail App Password again

---

## 📱 How to Use in Production

### For Production Deployment (Vercel/Netlify):

1. **Update Google OAuth:**
   - Add production URL to authorized origins:
     ```
     https://yourdomain.com
     ```
   - Add production callback:
     ```
     https://yourdomain.com/api/auth/callback/google
     ```

2. **Update .env variables on hosting:**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Email Service:**
   - For production, use:
     - **SendGrid** (recommended)
     - **AWS SES**
     - **Mailgun**
   - Gmail has daily limits

---

## ✅ Final Checklist

Before testing, make sure:

- [ ] Google Cloud Project created
- [ ] OAuth 2.0 Credentials created
- [ ] Redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] Client ID and Client Secret copied
- [ ] Gmail 2FA enabled
- [ ] Gmail App Password generated (16 chars, no spaces)
- [ ] `.env.local` updated with all credentials
- [ ] Server restarted (`npm run dev`)
- [ ] Open: http://localhost:3000/login
- [ ] Test Google Sign-In button
- [ ] Test OTP system

---

## 🎯 Expected Behavior

### Google Sign-In Flow:
1. User clicks "Continue with Google"
2. Google popup opens
3. User selects account
4. User redirected to `/home`
5. User created in MongoDB with:
   - `provider: "google"`
   - `role: "user"`
   - Google profile data

### OTP Login Flow:
1. User enters email
2. Clicks "Use OTP Instead"
3. Clicks "Send OTP to Email"
4. Beautiful email received with 6-digit OTP
5. User enters OTP
6. Clicks "Verify OTP"
7. User logged in
8. Redirected to `/home`

---

## 🔒 Security Notes

- ✅ All passwords encrypted with bcrypt
- ✅ JWT tokens with 7-day expiry
- ✅ OTP expires in 10 minutes
- ✅ Maximum 5 OTP attempts
- ✅ Google OAuth 2.0 secure flow
- ✅ MongoDB session storage
- ✅ CSRF protection enabled

---

## 📞 Need Help?

Check these files for details:
- `GOOGLE_AUTH_SETUP.md` - Google OAuth details
- `OTP_AND_GOOGLE_SETUP.md` - OTP system details

---

**🎉 You're ready to go! Follow steps 1-5 exactly and everything will work perfectly!**
