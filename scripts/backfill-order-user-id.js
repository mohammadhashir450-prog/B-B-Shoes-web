const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/bnb_shoes';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    const db = mongoose.connection.db;
    const users = db.collection('users');
    const orders = db.collection('orders');

    const cursor = orders.find({
      $or: [
        { user_id: { $exists: false } },
        { user_id: null },
        { user_id: '' },
      ],
    });

    let updated = 0;
    let skipped = 0;

    while (await cursor.hasNext()) {
      const order = await cursor.next();
      if (!order) continue;

      let resolvedUserId = '';

      // 1) Try linking by legacy ObjectId field if present.
      if (order.user && mongoose.Types.ObjectId.isValid(String(order.user))) {
        const userById = await users.findOne(
          { _id: new mongoose.Types.ObjectId(String(order.user)) },
          { projection: { user_id: 1 } }
        );
        resolvedUserId = String(userById?.user_id || '').trim();
      }

      // 2) Fallback by customerEmail.
      if (!resolvedUserId) {
        const email = String(order.customerEmail || '').toLowerCase().trim();
        if (email) {
          const userByEmail = await users.findOne(
            { email },
            { projection: { user_id: 1 } }
          );
          resolvedUserId = String(userByEmail?.user_id || '').trim();
        }
      }

      if (!resolvedUserId) {
        skipped += 1;
        continue;
      }

      await orders.updateOne(
        { _id: order._id },
        { $set: { user_id: resolvedUserId } }
      );
      updated += 1;
    }

    await orders.createIndex({ user_id: 1 });

    console.log(`Order user_id backfill complete. Updated: ${updated}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Order user_id backfill failed:', error.message || error);
    process.exit(1);
  }
}

run();
