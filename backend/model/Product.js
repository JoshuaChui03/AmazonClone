const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        image: {
            type: String,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        rating: {
            stars: {
                type: Number,
                required: true
            },

            count: {
                type: Number,
                required: true
            }
        },

        priceCents: {
            type: Number,
            required: true,
            min: 0
        },

        keywords: {
            type: [String],
            default: []
        },

        type: String,
        sizeChartLink: String,
        instructionsLink: String,
        warrantyLink: String
    }
);

module.exports = mongoose.model('Product', productSchema);