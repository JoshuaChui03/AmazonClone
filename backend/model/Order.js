const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderProductSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    estimatedDeliveryTime: {
      type: Date,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new Schema({
  guestId: {
    type: Schema.Types.ObjectId,
    ref: 'Guest',
    default: null,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  orderTime: {
    type: Date,
    required: true
  },
  totalCostCents: {
    type: Number,
    required: true,
    min: 0
  },
  products: {
    type: [orderProductSchema],
    required: true
  },
  // Guests get an expiry date so MongoDB's TTL index cleans them up.
  // Persistent user orders leave this field unset.
  expiresAt: {
    type: Date,
    default: undefined,
    index: { expires: 0 }
  }
});

module.exports = mongoose.model('Order', orderSchema);
