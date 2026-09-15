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
        required: true,
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
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
});

module.exports = mongoose.model('Order', orderSchema);
