const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');

router.route('/')
  .get(cartController.getCart)
  .delete(cartController.clearCart);

router.route('/items')
  .post(cartController.addCartItem);

router.route('/items/:productId')
  .patch(cartController.updateCartItem)
  .delete(cartController.removeCartItem);

module.exports = router;
