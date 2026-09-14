const { randomUUID } = require('crypto');
const Order = require('../model/Order');
const Product = require('../model/Product');

const deliveryOptions = {
    '1': { deliveryDays: 7, priceCents: 0 },
    '2': { deliveryDays: 3, priceCents: 499 },
    '3': { deliveryDays: 1, priceCents: 999 }
};

function addBusinessDays(startDate, businessDays) {
    const result = new Date(startDate);
    let remainingDays = businessDays;

    while (remainingDays > 0) {
        result.setUTCDate(result.getUTCDate() + 1);
        const day = result.getUTCDay();

        if (day !== 0 && day !== 6) {
            remainingDays -= 1;
        }
    }

    return result;
}

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ orderTime: -1 });
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const cart = req.body?.cart;

        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ message: 'A non-empty cart is required.' });
        }

        for (const item of cart) {
            if (
                !item?.productId ||
                !Number.isInteger(item?.quantity) ||
                item.quantity < 1 ||
                !deliveryOptions[item?.deliveryOptionId]
            ) {
                return res.status(400).json({ message: 'Cart contains an invalid item.' });
            }
        }

        const productIds = [...new Set(cart.map((item) => item.productId))];
        const products = await Product.find({ _id: { $in: productIds } });
        const productsById = new Map(
            products.map((product) => [product._id.toString(), product])
        );

        if (products.length !== productIds.length) {
            return res.status(400).json({ message: 'Cart contains an unknown product.' });
        }

        const orderTime = new Date();
        let subtotalCents = 0;
        let shippingCents = 0;

        const orderProducts = cart.map((item) => {
            const product = productsById.get(item.productId);
            const deliveryOption = deliveryOptions[item.deliveryOptionId];

            subtotalCents += product.priceCents * item.quantity;
            shippingCents += deliveryOption.priceCents;

            return {
                productId: item.productId,
                quantity: item.quantity,
                estimatedDeliveryTime: addBusinessDays(
                    orderTime,
                    deliveryOption.deliveryDays
                )
            };
        });

        const totalBeforeTaxCents = subtotalCents + shippingCents;
        const taxCents = Math.round(totalBeforeTaxCents * 0.1);

        const order = await Order.create({
            orderTime,
            totalCostCents: totalBeforeTaxCents + taxCents,
            products: orderProducts
        });

        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllOrders,
    createOrder
};
