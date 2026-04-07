# Cloudinary Image Upload Setup Guide

## ✅ Current Status
Your Cloudinary credentials are already configured in `.env` file:
- Cloud Name: `dt2ikjlfc`
- API Key: `326911931627673`
- Upload Preset: `bb_web` (needs configuration)

## 🔧 Required: Create Upload Preset in Cloudinary

### Step 1: Login to Cloudinary
1. Go to: https://cloudinary.com/users/login
2. Login with your credentials

### Step 2: Create Upload Preset
1. Click on **Settings** (gear icon) in top right
2. Click on **Upload** tab in left sidebar
3. Scroll down to **Upload presets** section
4. Click **Add upload preset** button

### Step 3: Configure Upload Preset
Set these values:
- **Preset name**: `bb_web` (exactly this name)
- **Signing mode**: **Unsigned** ✓ (IMPORTANT!)
- **Folder**: `bb_shoes` (optional but recommended)
- **Allowed formats**: `png, jpg, jpeg, webp`
- **Max file size**: `5 MB` (5000000 bytes)
- **Unique filename**: ✓ Enabled
- **Overwrite**: Disabled

### Step 4: Save
Click **Save** button at the bottom

## 🎯 How to Use in Admin Panel

### Upload Image:
1. Go to: `http://localhost:3000/admin`
2. Password: `hashir189`
3. Click **Add Product** button
4. Click **Upload to Cloudinary** button (gold button)
5. Select image from your computer
6. Wait for upload to complete
7. Image preview will appear
8. Fill other product details
9. Click **Save Product**

### Image will display on:
- Admin panel product cards
- User panel product pages
- Home page
- New arrivals page
- Sales page

## 🐛 Troubleshooting

### If upload fails:
1. Check browser console (F12 → Console tab)
2. Look for error message
3. Common issues:
   - Upload preset doesn't exist → Create it
   - Upload preset is "signed" → Change to "unsigned"
   - Wrong preset name → Use exactly "bb_web"
   - File too large → Max 5MB allowed
   - Wrong format → Use png/jpg/jpeg/webp only

### If image doesn't display:
1. Check if URL starts with `https://res.cloudinary.com/`
2. Check next.config.js has `res.cloudinary.com` in allowed domains ✓ (already added)
3. Refresh the page
4. Check browser console for errors

## ✨ Features Added
- ✓ Error handling with alerts
- ✓ Success confirmation message
- ✓ Console logging for debugging
- ✓ Image preview after upload
- ✓ Proper Cloudinary options configuration
- ✓ Multiple upload sources (local, URL, camera)
- ✓ File format and size restrictions

## 📝 Environment Variables (Already Configured)
```env
CLOUDINARY_CLOUD_NAME="dt2ikjlfc"
CLOUDINARY_API_KEY="326911931627673"
CLOUDINARY_API_SECRET="7SK2u850vScY3YXB31ZYunB5EK8"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dt2ikjlfc"
```

## 🔗 Quick Links
- Cloudinary Dashboard: https://console.cloudinary.com/console/
- Upload Settings: https://console.cloudinary.com/settings/upload
- Admin Panel: http://localhost:3000/admin
