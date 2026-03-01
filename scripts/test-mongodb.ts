/**
 * MongoDB Connection Test Script
 * Run this to diagnose connection issues
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mohammadhashir450_db_user:hashir189@bnbwebs.7lltnpr.mongodb.net/BnBWebs?retryWrites=true&w=majority';

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  console.log('📋 Connection String:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  console.log('');

  try {
    console.log('⏳ Attempting to connect...');
    
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📦 Database:', conn.connection.db?.databaseName);
    console.log('🔗 Host:', conn.connection.host);
    console.log('📍 Port:', conn.connection.port);
    console.log('📊 Ready State:', conn.connection.readyState);
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Connection Failed!');
    console.error('Error:', error.message);
    
    console.log('\n💡 Troubleshooting:');
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.log('   • DNS Resolution Issue Detected');
      console.log('   • Check your internet connection');
      console.log('   • Verify MongoDB Atlas cluster is active (not paused)');
      console.log('   • Add your IP to Network Access in MongoDB Atlas');
      console.log('   • Try using Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('   • Check username and password in connection string');
      console.log('   • Verify database user has correct permissions');
    }
    
    process.exit(1);
  }
}

testConnection();
