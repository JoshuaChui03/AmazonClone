import {renderPaymentSummary} from "../../scripts/checkout/paymentSummary.js";
import {loadFromStorage} from "../../data/cart.js";

describe('test suite: renderPaymentSummary', () => {
  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-payment-summary"></div>
    `

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      },
        {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 1,
          deliveryOptionId: '2'
        }]);
    });
    spyOn(localStorage, 'setItem');
    loadFromStorage();

    renderPaymentSummary();
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it ('displays the payment summary', () => {
    expect(document.querySelector('.payment-summary-title').innerText).toEqual('Order Summary');
    expect(document.querySelector('.js-payment-summary-cart-quantity').innerText).toEqual('Items (3):');
    expect(document.querySelector('.js-shipping-price').innerText).toEqual('$4.99');
    expect(document.querySelector('.js-payment-summary-total-before-tax').innerText).toEqual('$47.74');
    expect(document.querySelector('.js-payment-summary-tax').innerText).toEqual('$4.77');
    expect(document.querySelector('.js-total-price').innerText).toEqual('$52.51');
  });
});