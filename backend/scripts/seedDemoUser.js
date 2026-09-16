require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/dbConn');
const User = require('../model/User');
const Product = require('../model/Product');
const Order = require('../model/Order');

const DAY_MS = 24 * 60 * 60 * 1000;

async function seedDemoUser() {
  const username = process.env.DEMO_USERNAME;
  const password = process.env.DEMO_PASSWORD;

  if (!username || !password) {
    throw new Error('DEMO_USERNAME and DEMO_PASSWORD are required.');
  }

  await connectDB();

  const products = await Product.find().limit(3);

  if (products.length < 3) {
    throw new Error('Seed products before creating the demo user.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let user = await User.findOne({ username });

  if (!user) {
    user = new User({ username });
  }

  user.password = hashedPassword;
  user.isDemo = true;
  user.cart = [
    {
      productId: products[0]._id,
      quantity: 1,
      deliveryOptionId: '1'
    }
  ];

  await user.save();

  // Re-running this script restores the demo account to a predictable state.
  await Order.deleteMany({ userId: user._id });

  const now = Date.now();

  await Order.insertMany([
    {
      userId: user._id,
      orderTime: new Date(now - DAY_MS),
      totalCostCents: products[0].priceCents,
      products: [{
        productId: products[0]._id,
        quantity: 1,
        estimatedDeliveryTime: new Date(now + 4 * DAY_MS)
      }]
    },
    {
      userId: user._id,
      orderTime: new Date(now - 3 * DAY_MS),
      totalCostCents: products[1].priceCents * 2,
      products: [{
        productId: products[1]._id,
        quantity: 2,
        estimatedDeliveryTime: new Date(now + 2 * DAY_MS)
      }]
    },
    {
      userId: user._id,
      orderTime: new Date(now - 8 * DAY_MS),
      totalCostCents: products[2].priceCents,
      products: [{
        productId: products[2]._id,
        quantity: 1,
        estimatedDeliveryTime: new Date(now - DAY_MS)
      }]
    }
  ]);

  console.log(`Demo user "${username}" seeded with cart and 3 orders.`);
}

seedDemoUser()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
