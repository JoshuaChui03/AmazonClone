import {cart, calculateCartQuantity, resetCartLocally} from "../../data/cart.js";
import {getProduct} from "../../data/products.js";
import {getDeliveryOption} from "../../data/deliveryOptions.js";
import {formatCurrency} from "../utils/money.js"
import {addOrder} from "../../data/orders.js";
import {createOrder} from "../services/api.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId)
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div class="js-payment-summary-cart-quantity">Items (${calculateCartQuantity()}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-shipping-price">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money js-payment-summary-total-before-tax">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money js-payment-summary-tax">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money js-total-price">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order-button">
            Place your order
          </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order-button').addEventListener('click', async () => {
    try {
      const order = await createOrder();

      console.log(cart);
      console.log('order', order);
      addOrder(order);
    } catch (error) {
      console.error(error);
    }

    resetCartLocally();
    window.location.href = 'orders.html';
  });
}