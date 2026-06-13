import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';

// 1. Configure DNS to bypass local SRV issues
console.log('📡 Overriding DNS servers to Google DNS (8.8.8.8, 8.8.4.4)...');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// 2. Load environment variables manually
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join('=').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bnb_shoes';
console.log('📍 MONGODB_URI:', MONGODB_URI.replace(/:([^@]+)@/, ':***@'));

// Import all models
import Cart from '../src/models/Cart';
import Wishlist from '../src/models/Wishlist';
import Category from '../src/models/Category';
import Brand from '../src/models/Brand';
import Coupon from '../src/models/Coupon';
import Address from '../src/models/Address';
import InventoryLog from '../src/models/InventoryLog';
import Notification from '../src/models/Notification';
import SupportTicket from '../src/models/SupportTicket';
import SearchQuery from '../src/models/SearchQuery';
import Payment from '../src/models/Payment';
import Refund from '../src/models/Refund';
import AuditLog from '../src/models/AuditLog';
import NewsletterSubscriber from '../src/models/NewsletterSubscriber';
import Faq from '../src/models/Faq';
import ActivityLog from '../src/models/ActivityLog';
import ShippingMethod from '../src/models/ShippingMethod';
import User from '../src/models/User';
import Product from '../src/models/Product';
import Order from '../src/models/Order';

async function main() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully to database:', mongoose.connection.name);

    // Get a reference dummy user and product to use for references
    let dummyUser = await User.findOne();
    if (!dummyUser) {
      console.log('⚠️ No existing user found. Creating a temporary dummy user for reference keys...');
      dummyUser = await User.create({
        name: 'Dummy Reference User',
        email: 'dummy_ref@bnbshoes.com',
        password: 'dummy-password-hash',
        role: 'user',
        provider: 'email',
      });
      console.log('✅ Temporary user created.');
    }

    let dummyProduct = await Product.findOne();
    if (!dummyProduct) {
      console.log('⚠️ No existing product found. Creating a temporary dummy product for reference keys...');
      dummyProduct = await Product.create({
        name: 'Dummy Reference Product',
        price: 9999,
        image: '/images/dummy.jpg',
        category: 'Sneakers',
        brand: 'Nike',
        sizes: [8, 9, 10],
        colors: ['Black'],
        description: 'Dummy description',
      });
      console.log('✅ Temporary product created.');
    }

    let dummyOrder = await Order.findOne();
    if (!dummyOrder) {
      console.log('⚠️ No existing order found. Creating a temporary dummy order for reference keys...');
      dummyOrder = await Order.create({
        orderId: 'ORD-DUMMY-' + Date.now(),
        user_id: dummyUser._id.toString(),
        customerName: 'Dummy Name',
        customerEmail: 'dummy_ref@bnbshoes.com',
        customerPhone: '03331234567',
        customerAddress: 'Khanewal Rd, Multan',
        items: [{
          productId: dummyProduct._id.toString(),
          productName: dummyProduct.name,
          productImage: dummyProduct.image,
          quantity: 1,
          size: '9',
          color: 'Black',
          price: dummyProduct.price
        }],
        subtotal: 9999,
        shippingFee: 200,
        total: 10199,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        status: 'pending'
      });
      console.log('✅ Temporary order created.');
    }

    // List of new collections to initialize
    const modelsToInit = [
      {
        name: 'Cart',
        model: Cart,
        dummyData: {
          user: dummyUser._id,
          items: [{ product: dummyProduct._id, quantity: 1, size: '9', color: 'Black' }],
        },
      },
      {
        name: 'Wishlist',
        model: Wishlist,
        dummyData: {
          user: dummyUser._id,
          products: [dummyProduct._id],
        },
      },
      {
        name: 'Category',
        model: Category,
        dummyData: {
          name: 'Dummy Category',
          slug: 'dummy-category',
          description: 'Used as a reference placeholder',
        },
      },
      {
        name: 'Brand',
        model: Brand,
        dummyData: {
          name: 'Dummy Brand',
          slug: 'dummy-brand',
          description: 'Used as a reference placeholder',
        },
      },
      {
        name: 'Coupon',
        model: Coupon,
        dummyData: {
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      },
      {
        name: 'Address',
        model: Address,
        dummyData: {
          user: dummyUser._id,
          fullName: 'Hashir Test Address',
          phone: '03361234567',
          addressLine1: 'Test House 123, Sector A',
          city: 'Islamabad',
          state: 'Federal',
          zipCode: '44000',
          country: 'Pakistan',
        },
      },
      {
        name: 'InventoryLog',
        model: InventoryLog,
        dummyData: {
          product: dummyProduct._id,
          size: '9',
          color: 'Black',
          quantityChange: 10,
          actionType: 'restock',
          reason: 'Initial reference seed',
        },
      },
      {
        name: 'Notification',
        model: Notification,
        dummyData: {
          user: dummyUser._id,
          title: 'Welcome to B&B Shoes',
          message: 'Thank you for signing up! Keep shopping.',
          type: 'system',
        },
      },
      {
        name: 'SupportTicket',
        model: SupportTicket,
        dummyData: {
          user: dummyUser._id,
          subject: 'Order Delay Inquiry',
          description: 'My order has not arrived yet.',
          category: 'order',
          priority: 'medium',
          messages: [{ sender: dummyUser._id, senderType: 'user', message: 'Hello support, please check.' }],
        },
      },
      {
        name: 'SearchQuery',
        model: SearchQuery,
        dummyData: {
          query: 'running shoes',
          count: 15,
          resultsCount: 5,
        },
      },
      {
        name: 'Payment',
        model: Payment,
        dummyData: {
          order: dummyOrder._id,
          user: dummyUser._id,
          paymentMethod: 'cod',
          amount: 9999,
          status: 'pending',
        },
      },
      {
        name: 'Refund',
        model: Refund,
        dummyData: {
          order: dummyOrder._id,
          payment: new mongoose.Types.ObjectId(), // Placeholders can be updated later
          user: dummyUser._id,
          amount: 9999,
          reason: 'Size exchange not available',
        },
      },
      {
        name: 'AuditLog',
        model: AuditLog,
        dummyData: {
          user: dummyUser._id,
          action: 'create_dummy_data',
          targetType: 'System',
          details: { info: 'System database initialization' },
        },
      },
      {
        name: 'NewsletterSubscriber',
        model: NewsletterSubscriber,
        dummyData: {
          email: 'subscriber_test@bnbshoes.com',
        },
      },
      {
        name: 'Faq',
        model: Faq,
        dummyData: {
          question: 'What is the return policy?',
          answer: 'We offer an exchange policy within 7 days. Returns are not allowed.',
          category: 'refunds',
        },
      },
      {
        name: 'ActivityLog',
        model: ActivityLog,
        dummyData: {
          user: dummyUser._id,
          action: 'login',
          details: 'User logged in successfully during diagnostic check',
        },
      },
      {
        name: 'ShippingMethod',
        model: ShippingMethod,
        dummyData: {
          name: 'Standard Home Delivery',
          carrier: 'TCS Pakistan',
          cost: 200,
          estimatedDays: '3-5 Business Days',
        },
      },
    ];

    console.log('\n📂 Initializing collections...\n');

    for (const m of modelsToInit) {
      const count = await m.model.countDocuments();
      if (count === 0) {
        console.log(`🆕 Creating collection: ${m.name} (inserting 1 placeholder document)...`);
        await m.model.create(m.dummyData);
        console.log(`   ✅ ${m.name} collection created and seeded successfully.`);
      } else {
        console.log(`ℹ️  Collection: ${m.name} already exists with ${count} documents. Untouched.`);
      }
    }

    console.log('\n🌟 All new collections are verified and working!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error executing database setup:', error);
    process.exit(1);
  }
}

main();
