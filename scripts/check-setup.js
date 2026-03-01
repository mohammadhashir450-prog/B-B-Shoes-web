#!/usr/bin/env node

/**
 * B&B Shoes - Environment Setup Checker
 * Run this to verify your setup is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 B&B Shoes - Checking Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('   → Create .env.local file in project root');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');

// Required variables
const requiredVars = {
  'MONGODB_URI': {
    pattern: /^mongodb(\+srv)?:\/\//,
    description: 'MongoDB connection string'
  },
  'GOOGLE_CLIENT_ID': {
    pattern: /^(?!your-).+\.apps\.googleusercontent\.com$/,
    description: 'Google OAuth Client ID'
  },
  'GOOGLE_CLIENT_SECRET': {
    pattern: /^(?!your-).+$/,
    description: 'Google OAuth Client Secret'
  },
  'NEXTAUTH_SECRET': {
    pattern: /.{32,}/,
    description: 'NextAuth secret (min 32 chars)'
  },
  'NEXTAUTH_URL': {
    pattern: /^https?:\/\/.+$/,
    description: 'NextAuth URL'
  },
  'EMAIL_USER': {
    pattern: /^(?!your-)[\w.+-]+@gmail\.com$/,
    description: 'Gmail address for OTP'
  },
  'EMAIL_APP_PASSWORD': {
    pattern: /^(?!your-)[a-zA-Z]{16}$/,
    description: 'Gmail App Password (16 chars)'
  },
  'JWT_SECRET': {
    pattern: /.{16,}/,
    description: 'JWT Secret (min 16 chars)'
  }
};

let allValid = true;
let setupIssues = [];

console.log('📋 Checking Environment Variables:\n');

Object.keys(requiredVars).forEach(varName => {
  const config = requiredVars[varName];
  const regex = new RegExp(`${varName}=["']?([^"'\n]+)["']?`);
  const match = envContent.match(regex);
  
  if (!match) {
    console.log(`❌ ${varName}`);
    console.log(`   → Missing or not set`);
    setupIssues.push(`Add ${varName} to .env.local`);
    allValid = false;
  } else {
    const value = match[1].trim();
    if (config.pattern.test(value)) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`⚠️  ${varName}`);
      console.log(`   → Value doesn't match expected format`);
      console.log(`   → Expected: ${config.description}`);
      setupIssues.push(`Fix ${varName} format in .env.local`);
      allValid = false;
    }
  }
});

console.log('\n📁 Checking Required Files:\n');

const requiredFiles = [
  'src/lib/auth-options.ts',
  'src/lib/mongodb-client.ts',
  'src/lib/email-service.ts',
  'src/models/User.ts',
  'src/models/OTP.ts',
  'src/app/api/auth/[...nextauth]/route.ts',
  'src/app/api/auth/send-otp/route.ts',
  'src/app/api/auth/verify-otp/route.ts'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
    setupIssues.push(`Missing file: ${file}`);
    allValid = false;
  }
});

console.log('\n' + '='.repeat(60));

if (allValid) {
  console.log('\n🎉 Setup is COMPLETE! You can now:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open: http://localhost:3000/login');
  console.log('   3. Test Google Sign-In');
  console.log('   4. Test OTP Login\n');
} else {
  console.log('\n⚠️  Setup INCOMPLETE. Please fix:');
  setupIssues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  console.log('\n📖 Read COMPLETE_SETUP_GUIDE.md for step-by-step instructions\n');
  process.exit(1);
}
