const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dt2ikjlfc',
  api_key: '326911931627673',
  api_secret: '7SK2u850vScY3YXB31ZYunB5EK8'
});

// Image files to upload
const imagesToUpload = [
  { 
    path: 'C:\\Users\\Mohammad Hashir\\Desktop\\hero image1.jpeg',
    name: 'hero-purple-sandals'
  },
  { 
    path: 'C:\\Users\\Mohammad Hashir\\Desktop\\hero image2.jpeg',
    name: 'hero-beige-slides'
  }
];

async function uploadImages() {
  try {
    console.log('🚀 Starting Cloudinary uploads...\n');
    
    const results = [];
    
    for (const image of imagesToUpload) {
      if (!fs.existsSync(image.path)) {
        console.log(`❌ File not found: ${image.path}`);
        continue;
      }
      
      try {
        console.log(`📤 Uploading ${image.name}...`);
        const result = await cloudinary.uploader.upload(image.path, {
          public_id: image.name,
          folder: 'bb-shoes/hero',
          overwrite: true,
          resource_type: 'auto'
        });
        
        results.push({
          name: image.name,
          url: result.secure_url,
          width: result.width,
          height: result.height
        });
        
        console.log(`✅ Uploaded: ${image.name}`);
        console.log(`   URL: ${result.secure_url}\n`);
      } catch (err) {
        console.error(`❌ Failed to upload ${image.name}:`, err.message);
      }
    }
    
    console.log('\n📋 CLOUDINARY URLS:\n');
    results.forEach(r => {
      console.log(`${r.name}:`);
      console.log(`${r.url}\n`);
    });
    
    return results;
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

uploadImages();
