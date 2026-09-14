import {renderPaymentSummary} from "../../scripts/checkout/paymentSummary.js";
import {loadFromStorage} from "../../data/cart.js";
import {loadProductsFetch} from "../../data/products.js";

describe('test suite: renderPaymentSummary', () => {
  beforeAll(async () => {
    await loadProductsFetch();
  });

  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-payment-summary"></div>
    `

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: '6aa7b605df8996a26403ab0a',
        quantity: 2,
        deliveryOptionId: '1'
      },
        {
          productId: '6aa7b605df8996a26403ab0b',
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