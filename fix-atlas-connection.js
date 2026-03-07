// MongoDB Atlas Connection Diagnostic & Fix Tool
const mongoose = require('mongoose');
const dns = require('dns').promises;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkDNS() {
  log('\n🔍 Step 1: Checking DNS Resolution...', 'blue');
  
  try {
    const records = await dns.resolveSrv('_mongodb._tcp.bnbwebs.7lltnpr.mongodb.net');
    log('✅ DNS SRV records found:', 'green');
    records.forEach(r => log(`   - ${r.name}:${r.port} (priority: ${r.priority})`));
    return true;
  } catch (err) {
    log('❌ DNS SRV Resolution Failed:', 'red');
    log(`   Error: ${err.code} - ${err.message}`, 'red');
    log('\n💡 Solution:', 'yellow');
    log('   1. Change DNS to Google DNS (8.8.8.8 and 8.8.4.4)', 'yellow');
    log('   2. OR use standard connection string format', 'yellow');
    log('   3. Run: ipconfig /flushdns', 'yellow');
    return false;
  }
}

async function testAtlasConnection() {
  log('\n🔍 Step 2: Testing MongoDB Atlas Connection...', 'blue');
  
  const ATLAS_URI = process.env.MONGODB_URI || 
    "mongodb+srv://mohammadhashir450_db_user:hashir189@bnbwebs.7lltnpr.mongodb.net/bnb_shoes?retryWrites=true&w=majority&appName=bnbshoes";
  
  log(`📍 URI: ${ATLAS_URI.substring(0, 50)}...`, 'blue');
  
  const opts = {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  };
  
  try {
    await mongoose.connect(ATLAS_URI, opts);
    log('✅ MongoDB Atlas Connected Successfully!', 'green');
    log(`📊 Database: ${mongoose.connection.name}`, 'green');
    log(`🔗 Host: ${mongoose.connection.host}`, 'green');
    await mongoose.disconnect();
    return true;
  } catch (err) {
    log('❌ Connection Failed:', 'red');
    log(`   ${err.message}`, 'red');
    
    if (err.message.includes('querySrv')) {
      log('\n💡 DNS SRV Issue Detected:', 'yellow');
      log('   Your DNS server cannot resolve MongoDB SRV records.', 'yellow');
      log('\n   Quick Fix Options:', 'yellow');
      log('   1. Change Windows DNS to 8.8.8.8 (Google DNS)', 'yellow');
      log('   2. Get standard connection string from Atlas', 'yellow');
      log('   3. Use local MongoDB for development', 'yellow');
    } else if (err.message.includes('Authentication failed')) {
      log('\n💡 Authentication Issue:', 'yellow');
      log('   Check your MongoDB Atlas username and password', 'yellow');
    } else if (err.message.includes('IP') || err.message.includes('not authorized')) {
      log('\n💡 Network Access Issue:', 'yellow');
      log('   Your IP might not be whitelisted on MongoDB Atlas', 'yellow');
      log('   Go to Atlas → Network Access → Add IP Address', 'yellow');
    }
    
    return false;
  }
}

async function checkCurrentDNS() {
  log('\n🔍 Step 3: Checking Current DNS Configuration...', 'blue');
  
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execPromise = promisify(exec);
    
    const { stdout } = await execPromise('ipconfig /all | findstr /C:"DNS Servers"');
    log('📡 Current DNS Servers:', 'blue');
    log(stdout.trim());
    
    if (stdout.includes('192.168.') || stdout.includes('10.0.') || stdout.includes('172.')) {
      log('\n⚠️  You are using a local DNS server', 'yellow');
      log('   This may block MongoDB SRV queries', 'yellow');
      log('\n   Recommended: Change to Google DNS (8.8.8.8)', 'yellow');
    }
  } catch (err) {
    log('Could not check DNS configuration', 'yellow');
  }
}

async function getStandardConnectionString() {
  log('\n📝 How to Get Standard Connection String:', 'blue');
  log('\n1. Go to: https://cloud.mongodb.com/', 'blue');
  log('2. Login to your account', 'blue');
  log('3. Click "Connect" on your cluster', 'blue');
  log('4. Select "Connect your application"', 'blue');
  log('5. Choose "Driver: Node.js"', 'blue');
  log('6. Look for connection string starting with:', 'blue');
  log('   mongodb:// (not mongodb+srv://)', 'green');
  log('\n7. Copy and update .env.local:', 'blue');
  log('   MONGODB_URI="mongodb://..."', 'green');
}

async function provideSolutions() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('🛠️  SOLUTIONS TO FIX ATLAS CONNECTION', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
  
  log('Option 1: Change DNS to Google DNS (Fastest)', 'green');
  log('─────────────────────────────────────────────', 'green');
  log('1. Open Control Panel → Network and Internet → Network Connections');
  log('2. Right-click your connection → Properties');
  log('3. Select IPv4 → Properties');
  log('4. Use these DNS servers:');
  log('   • Preferred: 8.8.8.8');
  log('   • Alternate: 8.8.4.4');
  log('5. Save and restart network connection');
  log('6. Run: ipconfig /flushdns');
  log('7. Test again: node fix-atlas-connection.js\n');
  
  log('Option 2: Whitelist Your IP on Atlas', 'green');
  log('─────────────────────────────────────────────', 'green');
  log('1. Go to: https://cloud.mongodb.com/');
  log('2. Click "Network Access" in left sidebar');
  log('3. Click "Add IP Address"');
  log('4. Select "Add Current IP Address"');
  log('   OR "Allow Access from Anywhere" (0.0.0.0/0)');
  log('5. Click "Confirm"');
  log('6. Wait 2-3 minutes for changes to apply');
  log('7. Test again: node fix-atlas-connection.js\n');
  
  log('Option 3: Use Standard Connection String', 'green');
  log('─────────────────────────────────────────────', 'green');
  log('1. Get standard format from Atlas (see above)');
  log('2. Should start with: mongodb:// (not mongodb+srv://)');
  log('3. Update .env.local with new connection string');
  log('4. Restart dev server: npm run dev\n');
  
  log('Option 4: Continue with Local MongoDB', 'green');
  log('─────────────────────────────────────────────', 'green');
  log('Your app already works with local MongoDB!');
  log('Fix Atlas later when you have time.');
  log('Local MongoDB is perfect for development.\n');
}

async function main() {
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║   MongoDB Atlas Connection Diagnostic      ║', 'blue');
  log('╚════════════════════════════════════════════╝\n', 'blue');
  
  const dnsOk = await checkDNS();
  await checkCurrentDNS();
  
  if (dnsOk) {
    await testAtlasConnection();
  } else {
    log('\n⚠️  DNS Resolution Failed - Cannot test Atlas connection', 'yellow');
    log('   Need to fix DNS first before testing connection', 'yellow');
  }
  
  await getStandardConnectionString();
  await provideSolutions();
  
  log('\n✅ Diagnostic Complete!', 'green');
  log('   Choose one of the solutions above and apply it.\n', 'green');
  
  process.exit(0);
}

// Run diagnostic
main().catch(err => {
  log(`\n❌ Diagnostic Error: ${err.message}`, 'red');
  process.exit(1);
});
