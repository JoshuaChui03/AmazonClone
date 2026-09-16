import {renderPaymentSummary} from '../../scripts/checkout/paymentSummary.js';
import {loadCartFetch} from '../../data/cart.js';
import {loadProductsFetch} from '../../data/products.js';
import {installApiMock} from '../helpers/mockApi.js';
import {defaultTestCart, testProducts} from '../helpers/testData.js';

describe('test suite: renderPaymentSummary', () => {
  beforeEach(async () => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-payment-summary"></div>
    `;

    installApiMock({
      products: testProducts,
      cart: defaultTestCart()
    });

    await loadProductsFetch();
    await loadCartFetch();
    renderPaymentSummary();
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it('displays the payment summary', () => {
    expect(document.querySelector('.payment-summary-title').innerText).toEqual('Order Summary');
    expect(document.querySelector('.js-payment-summary-cart-quantity').innerText).toEqual('Items (3):');
    expect(document.querySelector('.js-shipping-price').innerText).toEqual('$4.99');
    expect(document.querySelector('.js-payment-summary-total-before-tax').innerText).toEqual('$47.74');
    expect(document.querySelector('.js-payment-summary-tax').innerText).toEqual('$4.77');
    expect(document.querySelector('.js-total-price').innerText).toEqual('$52.51');
  });
});
