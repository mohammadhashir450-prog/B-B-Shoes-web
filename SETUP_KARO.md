# ⚡ SETUP KARO - STEP BY STEP (Urdu/English)

## 🎯 Ye karo abhi (Do this now):

### STEP 1: Google Cloud Console

1. **Is link par jao:** https://console.cloud.google.com/apis/credentials
2. **Sign in karo** apne Google account se
3. **"CREATE CREDENTIALS"** click karo
4. **"OAuth 2.0 Client ID"** select karo
5. **Pehli bar hai? To consent screen configure karo:**
   - App name: `B&B Shoes`
   - Support email: Apna email
   - Developer email: Apna email
   - SAVE
6. **OAuth Client banao:**
   - Application type: **Web application**
   - Name: `B&B Shoes`
   - **Authorized redirect URIs** mein ye add karo:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - CREATE click karo
7. **2 cheezen milegi - copy kar lo:**
   - Client ID (jaise: `123456-abc.apps.googleusercontent.com`)
   - Client Secret (jaise: `GOCSPX-xyz123`)

---

### STEP 2: Gmail App Password

1. **2FA enable karo pehle:**
   - https://myaccount.google.com/security par jao
   - 2-Step Verification enable karo

2. **App Password banao:**
   - https://myaccount.google.com/apppasswords par jao
   - App: **Mail** select karo
   - Device: **Other** → `B&B Shoes` type karo
   - GENERATE click karo
   - 16-character password milega: `abcd efgh ijkl mnop`
   - **Spaces hata do:** `abcdefghijklmnop`

---

### STEP 3: .env.local File Update Karo

1. **Project folder mein `.env.local` file kholo**
2. **Ye lines dhundo aur update karo:**

```env
GOOGLE_CLIENT_ID="123456-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xyz123"
EMAIL_USER="hashir@gmail.com"
EMAIL_APP_PASSWORD="abcdefghijklmnop"
```

**IMPORTANT:** 
- Apni real values paste karo
- Quotes ke andar paste karo
- Spaces mat rakho
- Save karo file ko

---

### STEP 4: Check Karo Setup

PowerShell mein ye command run karo:

```bash
npm run check-setup
```

**Agar sab ✅ green dikhe, to next step par jao.**
**Agar ❌ red dikhe, to Step 3 dobara check karo.**

---

### STEP 5: Server Start Karo

```bash
npm run dev
```

Ya simply ye file double-click karo:
```
start-with-check.bat
```

---

### STEP 6: Test Karo

1. **Browser mein kholo:** http://localhost:3000/login

2. **Google Sign-In Test:**
   - "Continue with Google" button click karo
   - Google account select karo
   - ✅ Home page par redirect hona chahiye

3. **OTP Test:**
   - "Use OTP Instead" click karo
   - Email enter karo
   - "Send OTP to Email" click karo
   - Gmail check karo
   - 6-digit OTP enter karo
   - ✅ Login ho jana chahiye

---

## 🐛 Problem Ho To:

### "Invalid Client Error"
- `.env.local` mein `GOOGLE_CLIENT_ID` check karo
- Poora copy hua hai? (`.apps.googleusercontent.com` tak)
- Server restart karo

### "Redirect URI Mismatch"
- Google Console mein OAuth client kholo
- Redirect URI exactly ye hai?
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- Koi extra space ya slash to nahi?

### "OTP Nahi Aya"
- Spam folder check karo
- `EMAIL_USER` sahi email hai?
- `EMAIL_APP_PASSWORD` exactly 16 characters hai?
- Spaces to nahi hain password mein?

---

## ✅ Checklist

Setup se pehle confirm karo:

- [ ] Google Cloud Project bana li
- [ ] OAuth 2.0 Credentials bana liye
- [ ] Redirect URI add kar diya
- [ ] Client ID aur Secret copy kar liye
- [ ] Gmail 2FA enable hai
- [ ] Gmail App Password bana li (16 characters)
- [ ] `.env.local` file update kar di
- [ ] `npm run check-setup` sab green dikha raha hai
- [ ] Server start kar di
- [ ] http://localhost:3000/login khola

---

## 📞 Files Dekhne Ke Liye:

- **Quick Guide:** `QUICKSTART.md`
- **Detailed Guide:** `COMPLETE_SETUP_GUIDE.md`
- **Google Auth Guide:** `GOOGLE_AUTH_SETUP.md`
- **OTP Guide:** `OTP_AND_GOOGLE_SETUP.md`

---

**🎉 Bas 5 steps! Phir sab kaam karega perfectly!**

**Time lagega:** 5-7 minutes total
