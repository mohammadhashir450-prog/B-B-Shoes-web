# 🚀 VERCEL DEPLOYMENT QUICK CHECKLIST

## ✅ Before You Deploy

### 1. Local Testing Complete?
- [ ] Google Sign-In works on `http://localhost:3000/login`
- [ ] OTP email sending works
- [ ] All products display
- [ ] Shopping cart functions
- [ ] Admin panel accessible

### 2. Google Cloud Console Updated?
1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit your OAuth 2.0 Client
3. Add production redirect URI:
   ```
   https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
   ```
   Replace `YOUR-VERCEL-DOMAIN` with your actual domain (find in Vercel Dashboard)

---

## 🎯 Environment Variables to Set in Vercel

### Step 1: Find Your Vercel Domain
1. Go to: https://vercel.com/dashboard
2. Click your B&B Shoes project
3. Look at the top to find your domain (e.g., `bb-shoes-web.vercel.app`)
4. Copy this domain

### Step 2: Add Environment Variables
1. Vercel Dashboard → Your Project → **Settings**
2. Go to **Environment Variables**
3. Add each variable below with **CORRECT domain**:

#### Critical Variables (Google Auth Will Fail Without These):
```
🔴 NEXTAUTH_URL = https://YOUR-VERCEL-DOMAIN.vercel.app
🔴 NEXTAUTH_SECRET = [Your NEXTAUTH_SECRET from .env]
🔴 GOOGLE_CLIENT_ID = [Your Google Client ID from Google Cloud Console]
🔴 GOOGLE_CLIENT_SECRET = [Your Google Client Secret from Google Cloud Console]
🔴 MONGODB_URI = [Your MongoDB Atlas Connection String]
```

#### Application Settings:
```
NEXT_PUBLIC_APP_URL = https://YOUR-VERCEL-DOMAIN.vercel.app
NEXT_PUBLIC_APP_NAME = B&B Shoes
NEXT_PUBLIC_API_URL = https://YOUR-VERCEL-DOMAIN.vercel.app/api
NODE_ENV = production
DEBUG = false
```

#### Optional (But Recommended):
```
EMAIL_USER = mohammadhashir450@gmail.com
EMAIL_APP_PASSWORD = xtugtjnsvqjhxnjw
STORE_NAME = B&B Shoes
CURRENCY = PKR
```

---

## 🚀 Deploy Steps

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready - fix Google auth"
   git push origin main
   ```

2. **Vercel auto-deploys** OR manually redeploy:
   - Vercel Dashboard → Deployments → Latest → Redeploy

3. **Wait for deployment** (green checkmark = success)

---

## 🧪 Test Production

1. Go to: `https://YOUR-VERCEL-DOMAIN.vercel.app/login`
2. Click "Continue with Google"
3. Select account → Should work!
4. Check: Profile page shows Google info

---

## 🐛 If Google Auth Still Fails

### Check 1: Vercel Environment Variables
- Go to Vercel Settings → Environment Variables
- Verify `NEXTAUTH_URL` is HTTPS (not HTTP)
- Verify `NEXTAUTH_SECRET` is set

### Check 2: Google Cloud Console
- Go to: https://console.cloud.google.com/apis/credentials
- Edit OAuth client
- Check redirect URI is EXACTLY:
  ```
  https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
  ```

### Check 3: Vercel Logs
- Vercel Dashboard → Deployments → Latest → Logs
- Look for error messages
- Search for "Google" or "NEXTAUTH"

### Check 4: MongoDB Atlas
- Go to: https://cloud.mongodb.com
- Select your cluster
- Go to Network Access
- Make sure Vercel IPs are whitelisted (0.0.0.0/0)

---

## ✅ Everything Working?

You're production-ready when:
- ✅ Green deployment checkmark in Vercel
- ✅ Google Sign-In works on production domain
- ✅ Products load with images
- ✅ Shopping cart works
- ✅ No errors in browser console
- ✅ No errors in Vercel logs

---

## 📱 Share Your Domain

Once working, share with anyone:
```
https://YOUR-VERCEL-DOMAIN.vercel.app
```

They can:
- Browse products
- Sign in with Google
- Place orders
- View their profile

---

## 💡 Quick Tips

- **Keep `.env` file** for local development
- **Use Vercel Dashboard** for production variables
- **Don't share secrets** (GOOGLE_CLIENT_SECRET, etc.)
- **Verify domain** before each deployment
- **Check Vercel logs** if anything breaks

---

This checklist ensures Google Auth works on Vercel! 🎉
