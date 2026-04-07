# 🎯 PRODUCTION DEPLOYMENT - FINAL CHECKLIST

## ✅ This Guide Ensures Google Auth Works on Vercel

---

## 🚀 STEP-BY-STEP DEPLOYMENT (Follow Exactly!)

### STEP 1: Verify Local Everything Works (2 minutes)

```bash
# Terminal 1: Start MongoDB (if using local for testing)
mongod --dbpath "C:\data\db"

# Terminal 2: Start development server
npm run dev
```

Visit `http://localhost:3000/login`:
- ✅ Click "Continue with Google" - works?
- ✅ Click "Send OTP" - works?
- ✅ Browse homepage - products load?

If anything red, **FIX LOCALLY FIRST** before deploying!

---

### STEP 2: Find Your Vercel Domain (1 minute)

1. Go to: https://vercel.com/dashboard
2. Click your **B&B Shoes** project
3. Look at top of page - you'll see your domain:
   - Example: `bb-shoes-web.vercel.app`
   - Or auto-generated: `b-b-web-xyz123.vercel.app`
4. **COPY THIS DOMAIN** - you'll need it everywhere

**Important:** This domain MUST be used in:
- Google Cloud Console (redirect URI)
- Vercel Environment Variables (NEXTAUTH_URL)
- NEXT_PUBLIC_APP_URL

---

### STEP 3: Update Google Cloud Console (3 minutes)

**THIS IS THE MOST COMMON FIX FOR BROKEN GOOGLE AUTH!**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (labeled "B&B Shoes")
3. Click the pencil ✏️ to edit
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
   ```
   
   **Replace `YOUR-VERCEL-DOMAIN` with your actual domain from Step 2**
   
   Example (if domain is `bb-shoes-web.vercel.app`):
   ```
   https://bb-shoes-web.vercel.app/api/auth/callback/google
   ```

5. Click **SAVE**

✅ Google Console is now ready for production!

---

### STEP 4: Add Environment Variables to Vercel (5 minutes)

**This is where production secrets are stored - NOT in .env file!**

1. Go to: https://vercel.com/dashboard
2. Click **B&B Shoes** project
3. Go to: **Settings** → **Environment Variables**
4. Delete any old test variables
5. Add each variable below EXACTLY (copy-paste):

#### Copy This Block (Replace MY-DOMAIN):

```
🔴 CRITICAL VARIABLES:

Name: NEXTAUTH_URL
Value: https://MY-DOMAIN.vercel.app

Name: NEXTAUTH_SECRET
Value: super-secret-key-bbshoes-hashir-2026

Name: GOOGLE_CLIENT_ID
Value: [Your Google Client ID from Google Cloud Console]

Name: GOOGLE_CLIENT_SECRET
Value: [Your Google Client Secret from Google Cloud Console]

Name: MONGODB_URI
Value: mongodb+srv://mohammadhashir450_db_user:hashir189@bnbwebs.7lltnpr.mongodb.net/BnbDB?appName=BnBWebs

🟡 APPLICATION VARIABLES:

Name: NEXT_PUBLIC_APP_URL
Value: https://MY-DOMAIN.vercel.app

Name: NEXT_PUBLIC_APP_NAME
Value: B&B Shoes

Name: NEXT_PUBLIC_API_URL
Value: https://MY-DOMAIN.vercel.app/api

Name: NODE_ENV
Value: production

Name: DEBUG
Value: false

🟠 AUTHENTICATION:

Name: JWT_SECRET
Value: super-secret-key-bbshoes-hashir-2026

Name: SESSION_SECRET
Value: bbshoes-session-secret-key

Name: ADMIN_PASSWORD
Value: hashir189

🟢 EMAIL (Optional but recommended):

Name: EMAIL_USER
Value: mohammadhashir450@gmail.com

Name: EMAIL_APP_PASSWORD
Value: xtugtjnsvqjhxnjw

Name: EMAIL_FROM
Value: B&B Shoes <B&Bshoessupport@gmail.com>

🔵 BUSINESS:

Name: STORE_NAME
Value: B&B Shoes

Name: STORE_TAGLINE
Value: BRANDS YOU LIKE!

Name: SHIPPING_FEE
Value: 200

Name: CURRENCY
Value: PKR

Name: CONTACT_PHONE
Value: 03361673742

Name: CONTACT_EMAIL
Value: B&Bshoessupport@gmail.com

🟣 IMAGES:

Name: CLOUDINARY_CLOUD_NAME
Value: dt2ikjlfc

Name: CLOUDINARY_API_KEY
Value: 326911931627673

Name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Value: dt2ikjlfc
```

✅ All variables are now in Vercel!

---

### STEP 5: Deploy to Vercel (2 minutes)

**Option A: Auto-Deploy (Easiest)**
```bash
git add .
git commit -m "Production ready - Google auth configured"
git push origin main
```
Vercel automatically deploys when you push!

**Option B: Manual Redeploy**
1. Vercel Dashboard → Deployments
2. Find latest deployment
3. Click "..." → "Redeploy"

**Option C: CLI Redeploy**
```bash
vercel --prod
```

---

### STEP 6: Wait for Green Checkmark (1-2 minutes)

1. Vercel Dashboard → Deployments
2. Watch the latest deployment
3. When you see ✅ (green checkmark) = Success!
4. If ❌ (red) = Click to see error log

---

### STEP 7: Test Production (2 minutes)

1. Go to: `https://YOUR-VERCEL-DOMAIN.vercel.app/login`
2. Click **"Continue with Google"**
3. Select your Google account
4. **EXPECTED:**
   - ✅ Google popup appears
   - ✅ After login, redirects to homepage
   - ✅ Profile shows your Google name/email
   - ✅ No red errors in browser console

---

## 🎉 PRODUCTION IS READY WHEN:

- ✅ Vercel deployment shows green checkmark
- ✅ Google Sign-In works on production domain
- ✅ Products load with images
- ✅ Shopping cart functions
- ✅ No errors in browser console (press F12)
- ✅ No errors in Vercel logs

---

## 🐛 TROUBLESHOOTING

### Problem: "Invalid redirect_uri parameter"

**This means Google auth redirect URI is wrong**

Solution:
1. Go to Google Cloud Console
2. Edit OAuth 2.0 Client
3. Make sure redirect URI is **EXACTLY**:
   ```
   https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/google
   ```
4. No typos, no extra spaces, no trailing slash
5. Use HTTPS not HTTP

### Problem: "NEXTAUTH_SECRET is not provided"

**This means environment variable not set in Vercel**

Solution:
1. Vercel Dashboard → Settings → Environment Variables
2. Search for: NEXTAUTH_SECRET
3. Should be set to: `super-secret-key-bbshoes-hashir-2026`
4. If missing, add it
5. Redeploy

### Problem: "MongoDB connection failed"

**This means either URI wrong or IP not whitelisted**

Solution:
1. Check `MONGODB_URI` in Vercel is correct
2. Go to MongoDB Atlas: https://cloud.mongodb.com
3. Click your cluster → Network Access
4. Make sure 0.0.0.0/0 is added (allow all IPs)
5. Redeploy

### Problem: "Google button doesn't work locally"

**Local testing separate from production testing**

Checklist:
- [ ] `.env` file has GOOGLE_CLIENT_ID
- [ ] `.env` file has GOOGLE_CLIENT_SECRET
- [ ] NEXTAUTH_URL in `.env` is `http://localhost:3000`
- [ ] Google Console has `http://localhost:3000/api/auth/callback/google` in redirect URIs
- [ ] Server restarted after .env changes
- [ ] MongoDB is running

---

## ✅ VERIFICATION CHECKLIST

Before saying "production ready", verify ALL:

### Google Auth
- [ ] Google button appears on login page
- [ ] Google button is clickable
- [ ] Clicking button opens Google login
- [ ] After approval, redirects to homepage
- [ ] Name/email shown in profile

### Products & Shopping
- [ ] All products display on homepage
- [ ] Product images load
- [ ] Can add items to cart
- [ ] Cart shows items
- [ ] Can view product details
- [ ] Search works

### Admin & Media
- [ ] Admin dashboard accessible
- [ ] Can add/edit products
- [ ] Images upload to Cloudinary
- [ ] Product pages have correct images

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] No network errors (F12 → Network tab)
- [ ] Responsive on mobile

### Security
- [ ] HTTPS lock icon visible
- [ ] No secrets in source code
- [ ] No secrets exposed in console
- [ ] Vercel logs show no errors

---

## 📞 STILL NOT WORKING?

Check in this order:

1. **Vercel Deployment Status** (red = error)
   - Click deployment to see error log
   - Look for "Google", "NEXTAUTH", "MongoDB"

2. **Browser Console** (F12 key)
   - Any red error messages?
   - Copy error and search for solution

3. **Vercel Function Logs**
   - Deployment → Logs tab
   - Search for error messages

4. **Google Cloud Console**
   - Is redirect URI correct?
   - Are all credentials in Vercel?

5. **MongoDB Atlas**
   - Connection URI correct?
   - IPs whitelisted?

---

## 🎯 SUMMARY

This checklist ensures:
- ✅ Google Auth works in production
- ✅ All environment variables correct
- ✅ MongoDB connected
- ✅ Deployment successful
- ✅ Website fully functional

**Once this checklist is complete, your store is PRODUCTION READY!** 🚀

---

For detailed setup, see: **VERCEL_PRODUCTION_SETUP.md**
For quick reference, see: **VERCEL_QUICK_CHECKLIST.md**
