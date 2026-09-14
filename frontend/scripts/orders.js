import {orders} from "../data/orders.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {formatCurrency} from './utils/money.js'
import {getProduct, loadProductsFetch} from "../data/products.js";
import {addToCart, loadCartFetch} from "../data/cart.js";
import {renderAmazonHeader, updateCartQuantity} from "./amazonHeader.js";

loadPage();

async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      loadCartFetch()
    ]);
  } catch (error) {
    console.error("Error loading page:", error);
  }

  renderAmazonHeader();

  let ordersHTML = ''

  orders.forEach((order) => {
    console.log('order', order);

    const orderTimeString = dayjs(order.orderTime).format('MMMM D, YYYY');
    ordersHTML += `
        <div class="order-container"> 
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${productsListHtML(order)}
          </div>
        </div>`
  })

  function productsListHtML(order) {
    let productsListHtML = '';
    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      const currentTime = dayjs();
      const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
      const deliveredMessage = currentTime < deliveryTime ? 'Arriving on' : 'Delivered on';

      productsListHtML += `
          <div class="product-image-container">
              <img src="${product.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-delivery-date">
                ${deliveredMessage}: ${deliveryTime.format('MMMM D')}
              </div>
              <div class="product-quantity">
                Quantity: ${productDetails.quantity}
              </div>
              <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.id}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
        `
    })
    return productsListHtML;
  }

  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;

  document.querySelectorAll(".js-buy-again-button").forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
      updateCartQuantity();
    });
  });
}



