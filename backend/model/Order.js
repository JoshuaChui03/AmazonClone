const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderProductSchema = new Schema({
    productId: {
        type: String,
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
});

const orderSchema = new Schema({

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
    }
});

module.exports = mongoose.model('Order', orderSchema);