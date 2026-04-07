# 🚀 Vercel Production Deployment - Complete Setup Guide

## ⚠️ CRITICAL: Google Authentication Not Working in Production?

This guide fixes Google Auth, MongoDB, and all environment configuration for Vercel deployment.

---

## 🎯 The Main Issues

Your `.env` file is set to:
- ❌ LOCAL MongoDB (`mongodb://localhost:27017/bb-shoes`) - **Won't work on Vercel**
- ❌ LOCAL NEXTAUTH_URL (`http://localhost:3000`) - **Won't work on Vercel**
- ✅ Google OAuth credentials are present - **Just needs production configuration**

---

## ✅ Step 1: Update Google OAuth in Google Cloud Console

### Add Production Redirect URIs

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client (B&B Shoes)
3. Click "Edit"
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
   ```
5. Replace `YOUR-VERCEL-DOMAIN` with your actual Vercel domain
6. Click **SAVE**

#### Example:
If your Vercel domain is `bb-shoes-web.vercel.app`, add:
```
https://bb-shoes-web.vercel.app/api/auth/callback/google
```

---

## ✅ Step 2: Create Production .env Configuration

You need to set these environment variables **in Vercel Dashboard**, NOT in `.env` file.

### Go to Vercel Dashboard:
1. Open: https://vercel.com/dashboard
2. Select your B&B Shoes project
3. Go to: **Settings** → **Environment Variables**
4. Add each variable below (copy-paste exactly):

### A. Database Configuration
```
MONGODB_URI = mongodb+srv://mohammadhashir450_db_user:hashir189@bnbwebs.7lltnpr.mongodb.net/BnbDB?appName=BnBWebs
```

### B. Application Settings (Production)
```
NEXT_PUBLIC_APP_NAME = B&B Shoes
NEXT_PUBLIC_APP_URL = https://YOUR-VERCEL-DOMAIN.vercel.app
NEXT_PUBLIC_API_URL = https://YOUR-VERCEL-DOMAIN.vercel.app/api
NODE_ENV = production
DEBUG = false
```

### C. Authentication & Security
```
NEXTAUTH_SECRET = super-secret-key-bbshoes-hashir-2026
NEXTAUTH_URL = https://YOUR-VERCEL-DOMAIN.vercel.app
JWT_SECRET = super-secret-key-bbshoes-hashir-2026
SESSION_SECRET = bbshoes-session-secret-key
ADMIN_PASSWORD = hashir189
```

### D. Google OAuth (Same as Local)
```
GOOGLE_CLIENT_ID = [Your Google Client ID]
GOOGLE_CLIENT_SECRET = [Your Google Client Secret]
```

### E. Email Configuration
```
EMAIL_USER = mohammadhashir450@gmail.com
EMAIL_APP_PASSWORD = xtugtjnsvqjhxnjw
EMAIL_FROM = B&B Shoes <B&Bshoessupport@gmail.com>
```

### F. Business Settings
```
STORE_NAME = B&B Shoes
STORE_TAGLINE = BRANDS YOU LIKE!
SHIPPING_FEE = 200
CURRENCY = PKR
CONTACT_PHONE = 03361673742
CONTACT_EMAIL = B&Bshoessupport@gmail.com
EXCHANGE_POLICY_DAYS = 7
RETURN_ALLOWED = false
EXCHANGE_ALLOWED = true
```

### G. Brand Colors
```
NEXT_PUBLIC_PRIMARY_COLOR = #0047AB
NEXT_PUBLIC_SECONDARY_COLOR = #FFC107
```

### H. Third-Party Services
```
CLOUDINARY_CLOUD_NAME = dt2ikjlfc
CLOUDINARY_API_KEY = 326911931627673
CLOUDINARY_API_SECRET = 7SK2u850vScY3YXB31ZYunB5EK8
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dt2ikjlfc
```

---

## ✅ Step 3: Important - Check Your Vercel Domain

### Find Your Vercel Domain:
1. Go to your Vercel project dashboard
2. Look at the top - you'll see a domain like:
   - `bb-shoes-web.vercel.app` (if you set a custom name)
   - OR a auto-generated domain

### Replace in All Instructions Above:
Replace `YOUR-VERCEL-DOMAIN` with your ACTUAL domain

#### Example:
If your domain is `bb-shoes-web.vercel.app`, then:
- `NEXTAUTH_URL = https://bb-shoes-web.vercel.app`
- `NEXT_PUBLIC_APP_URL = https://bb-shoes-web.vercel.app`
- Google OAuth redirect: `https://bb-shoes-web.vercel.app/api/auth/callback/google`

---

## ✅ Step 4: Redeploy to Vercel

After adding environment variables:

1. **Option A - Auto Deploy** (Recommended):
   - Push code to GitHub: `git push origin main`
   - Vercel will automatically redeploy

2. **Option B - Manual Redeploy**:
   - Go to Vercel Dashboard
   - Click "Deployments"
   - Find the latest deployment
   - Click "..." → "Redeploy"

3. **Option C - Redeploy from CLI**:
   ```bash
   vercel --prod
   ```

---

## ✅ Step 5: Test Google Authentication

1. **Go to**: https://YOUR-VERCEL-DOMAIN.vercel.app/login
2. **Click**: "Continue with Google"
3. **Select**: Your Google account
4. **Expected**:
   - ✅ Redirects to Google login
   - ✅ After approval, redirects to homepage
   - ✅ User is created in MongoDB
   - ✅ Profile shows Your Google account

---

## ✅ Step 6: Verify Everything is Working

### Check Deployment Status:
1. Go to Vercel Dashboard
2. Look for green checkmark next to latest deployment
3. If red: Click to see error logs

### Test All Features:
1. ✅ Google Sign-In
2. ✅ Email/Password Login
3. ✅ OTP Sign-In
4. ✅ Product Pages
5. ✅ Shopping Cart
6. ✅ Checkout

### View Production Logs:
1. Vercel Dashboard → Your Project
2. Go to "Functions" or "Logs" tab
3. Look for errors in Google authentication

---

## 🐛 Troubleshooting

### Issue: "Invalid redirect_uri parameter"

**Solution:**
1. Check Google Cloud Console
2. Make sure OAuth redirect URI EXACTLY matches:
   ```
   https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
   ```
3. No typos, no trailing slash, exact HTTPS

### Issue: "NEXTAUTH_SECRET is not set"

**Solution:**
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Make sure `NEXTAUTH_SECRET` is set
4. Redeploy: Click latest deployment → Redeploy

### Issue: "MongoDB connection failed"

**Solution:**
1. Check `MONGODB_URI` in Vercel environment variables
2. Go to MongoDB Atlas: https://cloud.mongodb.com
3. Make sure Vercel IP is whitelisted:
   - **Network Access** → **Add IP Address**
   - Add: `0.0.0.0/0` (Allow all IPs)
4. Redeploy

### Issue: "Google Sign-In works locally but not on Vercel"

**Checklist:**
- [ ] NEXTAUTH_URL is set to production domain (HTTPS)
- [ ] Google OAuth redirect URI includes production domain
- [ ] NEXTAUTH_SECRET is set (same as local)
- [ ] GOOGLE_CLIENT_ID is correct
- [ ] GOOGLE_CLIENT_SECRET is correct
- [ ] MongoDB Atlas allows Vercel IPs
- [ ] Deployment shows green checkmark

---

## 📋 Environment Variables Checklist

### Required Variables (MUST be set):
- [ ] `NEXTAUTH_URL` = `https://your-domain`
- [ ] `NEXTAUTH_SECRET` = Your secret key
- [ ] `GOOGLE_CLIENT_ID` = From Google Console
- [ ] `GOOGLE_CLIENT_SECRET` = From Google Console
- [ ] `MONGODB_URI` = MongoDB Atlas connection
- [ ] `NEXT_PUBLIC_APP_URL` = `https://your-domain`
- [ ] `NEXT_PUBLIC_API_URL` = `https://your-domain/api`
- [ ] `NODE_ENV` = `production`

### Optional But Recommended:
- [ ] `EMAIL_USER` = Your Gmail
- [ ] `EMAIL_APP_PASSWORD` = Gmail App Password
- [ ] `CLOUDINARY_*` = Image hosting

---

## ✅ Production Ready Checklist

Before claiming it's ready:

- [ ] Google Auth works on production domain
- [ ] OTP Email sending works
- [ ] MongoDB Atlas connection working
- [ ] Product pages load with images
- [ ] Shopping cart saves items
- [ ] Checkout process completes
- [ ] Admin dashboard accessible
- [ ] No console errors in browser
- [ ] No errors in Vercel logs
- [ ] HTTPS working (green lock icon)

---

## 🎉 All Set!

Your production deployment is ready when:
1. ✅ All environment variables set in Vercel
2. ✅ Google OAuth URLS configured
3. ✅ Deployment is green (successful)
4. ✅ Google Sign-In works
5. ✅ All features tested

**If Google Auth still fails, check:**
- Google Cloud Console for correct redirect URIs
- Vercel logs for actual error message
- NEXTAUTH_URL matches your domain exactly

---

## 💡 Need Help?

**Check these files for more info:**
- `COMPLETE_SETUP_GUIDE.md` - Detailed Google OAuth setup
- `AUTHENTICATION_SETUP.md` - Auth system overview
- `OTP_AND_GOOGLE_SETUP.md` - OTP email configuration

**Common Issues:**
- Redirect URI mismatch → Check Google Console
- NEXTAUTH_SECRET not set → Check Vercel environment variables
- MongoDB connection → Check MongoDB Atlas whitelist
