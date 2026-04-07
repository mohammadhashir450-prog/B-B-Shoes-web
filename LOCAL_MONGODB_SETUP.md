# Quick Local MongoDB Setup

## Install MongoDB Community Server

1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run on `localhost:27017`

## Update .env.local

Replace your current MONGODB_URI with:

```env
MONGODB_URI="mongodb://localhost:27017/bnb_shoes"
```

## Test Connection

```bash
node test-mongodb-connection.js
```

Should show:
```
✅ MongoDB Connected Successfully!
```

## When to Use

- ✅ Development on local machine
- ✅ Quick testing without internet
- ✅ Bypass DNS/firewall issues

## When to Use Atlas

- ✅ Production deployment
- ✅ Team collaboration
- ✅ Automatic backups
- ✅ Scalability

## Switching Back to Atlas

Once DNS issue is resolved, change back to Atlas connection string in `.env.local`
