const mongoose = require('mongoose');
const Product = require('../model/Product');

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });
        res.json(products);
    } catch (err) {
        next(err);
    }
};

const getProductById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product id.' });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllProducts,
    getProductById
};
