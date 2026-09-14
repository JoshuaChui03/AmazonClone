const express = require('express');
const router = express.Router();

const productsController =
    require('../../controllers/productController');

router.route('/')
    .get(productsController.getAllProducts);

router.route('/:id')
    .get(productsController.getProductById);

module.exports = router;