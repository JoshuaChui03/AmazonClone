import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliverOption} from "../../data/cart.js";
import {products, getProducts} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
import {calculateDeliveryDate, deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from "./paymentSummary.js";
import {renderCheckoutHeader} from "./checkoutHeader.js";

export function renderOrderSummary() {
  let cartSummaryHtML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProducts(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHtML +=`
  <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
  `;
  });


  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0 ? 'Free' : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
    <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id= "${deliveryOption.id}">
                  <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>`
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHtML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary()
      renderPaymentSummary();
      renderCheckoutHeader();
    })
  })

  document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const productId = link.dataset.productId;

      document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
    })
  })

  document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const productId = link.dataset.productId;

      const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

      if (newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }
      updateQuantity(productId, newQuantity);

      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');

      renderOrderSummary()
      renderPaymentSummary();
      renderCheckoutHeader();
    })
  })

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', (e) => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliverOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
}