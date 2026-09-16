import {renderCheckoutHeader} from '../../scripts/checkout/checkoutHeader.js';
import {loadCartFetch} from '../../data/cart.js';
import {installApiMock} from '../helpers/mockApi.js';
import {productId1, productId2} from '../helpers/testData.js';

describe('test suite: renderCheckoutHeader', () => {
  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  });

  async function renderWithCart(cart) {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-checkout-header"></div>
    `;

    installApiMock({cart});
    await loadCartFetch();
    renderCheckoutHeader();
  }

  it('displays the checkout header', async () => {
    await renderWithCart([
      {productId: productId1, quantity: 2, deliveryOptionId: '1'},
      {productId: productId2, quantity: 1, deliveryOptionId: '2'}
    ]);

    expect(
      document.querySelector('.js-checkout-quantity-return-to-home-link').innerText
    ).toEqual('3 items');
  });

  it('displays the checkout header with other quantities', async () => {
    await renderWithCart([
      {productId: productId1, quantity: 5, deliveryOptionId: '1'},
      {productId: productId2, quantity: 9, deliveryOptionId: '2'}
    ]);

    expect(
      document.querySelector('.js-checkout-quantity-return-to-home-link').innerText
    ).toEqual('14 items');
  });
});
