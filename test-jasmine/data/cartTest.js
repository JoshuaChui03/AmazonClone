import {addToCart, cart, loadFromStorage} from "../../data/cart.js";

describe('test suite: addToCart', () => {
  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    spyOn(localStorage, 'setItem');
    spyOn(document, 'querySelector').and.callFake(() => {
      return {
        value: '1'
      };
    });
    loadFromStorage();
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
    expect(document.querySelector).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
  });

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });
    spyOn(localStorage, 'setItem');
    spyOn(document, 'querySelector').and.callFake(() => {
      return {
        value: '1'
      };
    });
    loadFromStorage();
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(document.querySelector).toHaveBeenCalledTimes(1)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1)
  });
});