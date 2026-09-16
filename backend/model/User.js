const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 999
    },
    deliveryOptionId: {
      type: String,
      required: true,
      default: '1'
    }
  },
  { _id: false }
);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    type: [cartItemSchema],
    default: []
  },
  isDemo: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
