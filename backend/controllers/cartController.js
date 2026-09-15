const mongoose = require('mongoose');
const Product = require('../model/Product');

const deliveryOptionIds = new Set(['1', '2', '3']);

const getCart = async (req, res) => {
  res.json(req.guest.cart);
};

const addCartItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (
        !mongoose.isValidObjectId(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 999
    ) {
      return res.status(400).json({ message: 'Invalid cart item.' });
    }

    const productExists = await Product.exists({ _id: productId });

    if (!productExists) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existingItem = req.guest.cart.find(
        (item) => item.productId.equals(productId)
    );

    if (existingItem) {
      if (existingItem.quantity + quantity > 999) {
        return res.status(400).json({ message: 'Quantity cannot exceed 999.' });
      }

      existingItem.quantity += quantity;
    } else {
      req.guest.cart.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }

    await req.guest.save();
    res.json(req.guest.cart);
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    const cartItem = req.guest.cart.find(
        (item) => item.productId.equals(productId)
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    if (quantity !== undefined) {
      if (!Number.isInteger(quantity) || quantity < 0 || quantity > 999) {
        return res.status(400).json({ message: 'Quantity must be between 0 and 999.' });
      }

      if (quantity === 0) {
        req.guest.cart = req.guest.cart.filter(
            (item) => !item.productId.equals(productId)
        );
        await req.guest.save();
        return res.json(req.guest.cart);
      }

      cartItem.quantity = quantity;
    }

    if (deliveryOptionId !== undefined) {
      if (!deliveryOptionIds.has(deliveryOptionId)) {
        return res.status(400).json({ message: 'Invalid delivery option.' });
      }

      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await req.guest.save();
    res.json(req.guest.cart);
  } catch (err) {
    next(err);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product id.' });
    }

    req.guest.cart = req.guest.cart.filter(
        (item) => !item.productId.equals(productId)
    );

    await req.guest.save();
    res.json(req.guest.cart);
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    req.guest.cart = [];
    await req.guest.save();
    res.json(req.guest.cart);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
};
