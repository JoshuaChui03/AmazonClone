import {renderOrderSummary} from "../../scripts/checkout/orderSummary.js";
import {loadFromStorage, cart} from "../../data/cart.js";

describe('test suite: renderOrderSummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d'

  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
      <div class="js-payment-summary"></div>
      <div class="js-checkout-header"></div>
    `

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 2,
        deliveryOptionId: '1'
      },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: '2'
        }]);
    });
    spyOn(localStorage, 'setItem');
    loadFromStorage();

    renderOrderSummary();
  })

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('displays the cart', () => {
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-name-${productId1}`).innerText).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual('Intermediate Size Basketball');
    expect(document.querySelector(`.js-product-price-${productId1}`).innerText).toEqual('$10.90');
    expect(document.querySelector(`.js-product-price-${productId2}`).innerText).toEqual('$20.95');
    expect(document.querySelector(`.js-product-quantity-${productId1}`).innerText).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).innerText).toContain('Quantity: 1');
  });

  it('removes a product', () => {
    expect(document.querySelector(`.js-product-name-${productId1}`).innerText).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual('Intermediate Size Basketball');
    expect(document.querySelector(`.js-product-price-${productId1}`).innerText).toEqual('$10.90');
    expect(document.querySelector(`.js-product-price-${productId2}`).innerText).toEqual('$20.95');
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual('Intermediate Size Basketball');
    expect(document.querySelector(`.js-cart-item-container-${productId1}`)).toEqual(null);
    expect(document.querySelector(`.js-cart-item-container-${productId2}`)).not.toEqual(null);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
  });

  it('updates price when clicking delivery options', () => {
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);
    expect(document.querySelector(`.js-product-name-${productId1}`).innerText).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');
    expect(document.querySelector(`.js-product-name-${productId2}`).innerText).toEqual('Intermediate Size Basketball');
    expect(document.querySelector(`.js-product-price-${productId1}`).innerText).toEqual('$10.90');
    expect(document.querySelector(`.js-product-price-${productId2}`).innerText).toEqual('$20.95');
    const deliverySelector = document.querySelector(`.js-delivery-option-input-${productId1}-3`);
    deliverySelector.click();
    expect(deliverySelector.checked).toEqual(true);
    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(document.querySelector('.js-shipping-price').innerText).toEqual('$14.98');
    expect(document.querySelector('.js-total-price').innerText).toEqual('$63.50');
  })
});