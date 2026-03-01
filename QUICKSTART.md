# 🚀 Quick Start - Google Sign-In Setup

## ⚡ 3-Minute Setup

### Step 1: Get Google Credentials (2 mins)

1. **Visit:** https://console.cloud.google.com/apis/credentials
2. **Click:** "CREATE CREDENTIALS" → "OAuth 2.0 Client ID"
3. **Application type:** Web application
4. **Name:** B&B Shoes
5. **Authorized redirect URIs:** Add this EXACTLY:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. **Click CREATE** → Copy Client ID and Client Secret

### Step 2: Get Gmail App Password (1 min)

1. **Visit:** https://myaccount.google.com/apppasswords
2. **Create app password:** Name it "B&B Shoes"
3. **Copy the 16-digit code** (remove spaces)

### Step 3: Update .env.local

Open `.env.local` and add:

```env
GOOGLE_CLIENT_ID="paste-your-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-secret-here"
EMAIL_USER="your-gmail@gmail.com"
EMAIL_APP_PASSWORD="your16digitcode"
```

### Step 4: Start Server

```bash
npm run dev
```

### Step 5: Test

1. Open: http://localhost:3000/login
2. Click "Continue with Google"
3. ✅ Done!

---

## 🔍 Check Setup Status

Run this to verify everything is configured:

```bash
npm run check-setup
```

---

## 🐛 Problems?

### "Invalid Client Error"
- Check GOOGLE_CLIENT_ID in .env.local
- Must end with `.apps.googleusercontent.com`

### "Redirect URI Mismatch"
- Go to Google Console → Edit OAuth client
- Make sure redirect URI is EXACTLY:
  ```
  http://localhost:3000/api/auth/callback/google
  ```

### "OTP Not Sending"
- Check EMAIL_USER and EMAIL_APP_PASSWORD
- App password must be 16 characters, no spaces
- Enable 2FA on Gmail first

---

**Need detailed guide?** → See `COMPLETE_SETUP_GUIDE.md`
