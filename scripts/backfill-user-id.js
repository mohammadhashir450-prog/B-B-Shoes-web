const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/bnb_shoes';

function generateUserId() {
  return `USR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    const db = mongoose.connection.db;
    const users = db.collection('users');

    const cursor = users.find({
      $or: [
        { user_id: { $exists: false } },
        { user_id: null },
        { user_id: '' },
      ],
    });

    let updated = 0;
    while (await cursor.hasNext()) {
      const user = await cursor.next();
      if (!user) continue;

      let nextId = generateUserId();
      // Ensure uniqueness at write time.
      while (await users.findOne({ user_id: nextId })) {
        nextId = generateUserId();
      }

      await users.updateOne({ _id: user._id }, { $set: { user_id: nextId } });
      updated += 1;
    }

    await users.createIndex({ user_id: 1 }, { unique: true, sparse: true });

    console.log(`Backfill complete. Updated users: ${updated}`);
    process.exit(0);
  } catch (error) {
    console.error('Backfill failed:', error.message || error);
    process.exit(1);
  }
}

run();
