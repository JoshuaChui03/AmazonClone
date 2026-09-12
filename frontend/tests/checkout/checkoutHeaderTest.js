import {renderCheckoutHeader} from "../../scripts/checkout/checkoutHeader.js";
import {loadFromStorage} from "../../data/cart.js";

describe('test suite: renderCheckoutHeader', ()=>{
  afterEach(()=>{
    document.querySelector('.js-test-container').innerHTML = '';
  });

  it ('displays the checkout header', ()=>{
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-checkout-header"></div>
    `;
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

    renderCheckoutHeader();

    expect(document.querySelector('.js-checkout-quantity-return-to-home-link').innerText).toEqual('3 items');
  });

  it ('displays the checkout header with other items', ()=>{
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-checkout-header"></div>
    `;
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 5,
        deliveryOptionId: '1'
      },
        {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 9,
          deliveryOptionId: '2'
        }]);
    });
    spyOn(localStorage, 'setItem');
    loadFromStorage();

    renderCheckoutHeader();

    expect(document.querySelector('.js-checkout-quantity-return-to-home-link').innerText).toEqual('14 items');
  });
});