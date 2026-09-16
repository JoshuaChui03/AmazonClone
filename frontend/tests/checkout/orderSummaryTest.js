import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js';
import {cart, loadCartFetch} from '../../data/cart.js';
import {loadProductsFetch} from '../../data/products.js';
import {installApiMock, waitFor} from '../helpers/mockApi.js';
import {
  defaultTestCart,
  productId1,
  productId2,
  testProducts
} from '../helpers/testData.js';

describe('test suite: renderOrderSummary', () => {
  beforeEach(async () => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
      <div class="js-checkout-header"></div>
    `;

    installApiMock({
      products: testProducts,
      cart: defaultTestCart()
    });

    await loadProductsFetch();
    await loadCartFetch();
    renderOrderSummary();
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('displays the cart', () => {
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-name-${productId1}`).innerText)
      .toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText)
      .toEqual('Intermediate Size Basketball');
    expect(document.querySelector(`.js-product-price-${productId1}`).innerText).toEqual('$10.90');
    expect(document.querySelector(`.js-product-price-${productId2}`).innerText).toEqual('$20.95');
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
  });

  it('removes a product', async () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();

    await waitFor(() =>
      cart.length === 1 &&
      document.querySelectorAll('.js-cart-item-container').length === 1
    );

    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toBeNull();
    expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toBeNull();
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });

  it('updates price when clicking delivery options', async () => {
    const deliverySelector = document.querySelector(
      `.js-delivery-option-input-${productId1}-3`
    );

    deliverySelector.click();

    await waitFor(() =>
      cart[0].deliveryOptionId === '3' &&
      document.querySelector('.js-shipping-price') !== null
    );

    const updatedDeliverySelector = document.querySelector(
      `.js-delivery-option-input-${productId1}-3`
    );

    expect(updatedDeliverySelector.checked).toEqual(true);
    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(document.querySelector('.js-shipping-price').innerText).toEqual('$14.98');
    expect(document.querySelector('.js-total-price').innerText).toEqual('$63.50');
  });
});
