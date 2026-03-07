# MongoDB Connection Fix - DNS Issue

## Problem
MongoDB Atlas connection failing with: `querySrv ECONNREFUSED`

This happens because your local DNS server (192.168.67.97) cannot resolve MongoDB Atlas SRV records.

## Solutions

### Solution 1: Use Google DNS (Fastest Fix)

1. Open **Control Panel** → **Network and Internet** → **Network Connections**
2. Right-click your active network connection → **Properties**
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**
4. Select **Use the following DNS server addresses:**
   - Preferred DNS: `8.8.8.8`
   - Alternate DNS: `8.8.4.4`
5. Click **OK** and restart your network connection

### Solution 2: Flush DNS Cache (Try First)

Open PowerShell as Administrator and run:
```powershell
ipconfig /flushdns
Clear-DnsClientCache
```

Then restart your dev server.

### Solution 3: Use Standard MongoDB Connection String

Instead of:
```
mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

Use:
```
mongodb://user:pass@host1:27017,host2:27017,host3:27017/dbname?replicaSet=xxx
```

**To get your standard connection string:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select **Driver: Node.js 5.5 or later**
5. Toggle **"Include full driver code example"** OFF
6. Copy the **Standard Connection String** (not the SRV format)

### Solution 4: Check MongoDB Atlas Settings

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **Network Access** in left sidebar
3. Check **IP Whitelist**:
   - If empty, click **Add IP Address**
   - Select **Allow Access from Anywhere** (0.0.0.0/0) for development
   - Click **Confirm**
4. Wait 2-3 minutes for changes to apply

### Solution 5: Verify Cluster Exists

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Check **Database** section
3. Verify cluster **bnbwebs** exists and is running (green status)
4. If not, create a new cluster or start the existing one

## Testing the Fix

After applying any solution, test with:
```bash
node test-mongodb-connection.js
```

You should see:
```
✅ MongoDB Connected Successfully!
```

## Update .env.local

If you get a standard connection string from MongoDB Atlas, update `.env.local`:

```env
# Replace your current MONGODB_URI with the standard format
MONGODB_URI="mongodb://mohammadhashir450_db_user:hashir189@host1:27017,host2:27017,host3:27017/bnb_shoes?replicaSet=yourReplicaSet&retryWrites=true&w=majority"
```

## Why This Happened

The `mongodb+srv://` format uses DNS SRV records to automatically discover MongoDB replica set members. Your local DNS server (192.168.67.97) is blocking or cannot process these SRV record queries.

Common causes:
- Corporate firewall/proxy
- Router DNS filtering
- Windows DNS cache issues
- ISP DNS restrictions

Using Google DNS (8.8.8.8) or a standard connection string bypasses this limitation.
