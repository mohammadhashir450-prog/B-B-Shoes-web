// Simple test to check MongoDB connection logs
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mohammadhashir450_db_user:hashir189@bnbwebs.7lltnpr.mongodb.net/bnb_shoes?retryWrites=true&w=majority&appName=bnbshoes";

console.log("🔍 Starting MongoDB connection test...");
console.log("📍 MongoDB URI:", MONGODB_URI.substring(0, 50) + "...");

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  family: 4,
})
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    console.log("📊 Connection State:", mongoose.connection.readyState);
    console.log("🔗 Connected to:", mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:");
    console.error("Error message:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  });

// Timeout fallback
setTimeout(() => {
  console.log("⏱️ Connection timeout after 20 seconds");
  process.exit(1);
}, 20000);
