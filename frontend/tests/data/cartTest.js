import {
  addToCart,
  cart,
  loadCartFetch,
  removeFromCart,
  updateDeliverOption
} from '../../data/cart.js';
import {installApiMock} from '../helpers/mockApi.js';
import {productId1, productId2} from '../helpers/testData.js';

describe('test suite: addToCart', () => {
  it('adds an existing product to the cart', async () => {
    const {fetchSpy} = installApiMock({
      cart: [{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]
    });

    await loadCartFetch();
    fetchSpy.calls.reset();

    await addToCart(productId1);

    expect(cart.length).toEqual(1);
    expect(cart[0]).toEqual({
      productId: productId1,
      quantity: 2,
      deliveryOptionId: '1'
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.calls.mostRecent().args[1].method).toEqual('POST');
  });

  it('adds a new product to the cart', async () => {
    const {fetchSpy} = installApiMock({cart: []});

    await loadCartFetch();
    fetchSpy.calls.reset();

    await addToCart(productId1);

    expect(cart.length).toEqual(1);
    expect(cart[0]).toEqual({
      productId: productId1,
      quantity: 1,
      deliveryOptionId: '1'
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe('test suite: removeFromCart', () => {
  it('removes an existing product from the cart', async () => {
    installApiMock({
      cart: [{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]
    });

    await loadCartFetch();
    await removeFromCart(productId1);

    expect(cart).toEqual([]);
  });

  it('rejects removing a product that is not in the cart', async () => {
    installApiMock({
      cart: [{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]
    });

    await loadCartFetch();

    await expectAsync(
      removeFromCart(productId2)
    ).toBeRejectedWithError('Cart item not found.');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId1);
  });
});

describe('test suite: updateDeliveryOption', () => {
  it('updates an existing product in the cart', async () => {
    installApiMock({
      cart: [{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]
    });

    await loadCartFetch();
    await updateDeliverOption(productId1, '3');

    expect(cart.length).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('3');
  });

  it('rejects updating a product that is not in the cart', async () => {
    installApiMock({
      cart: [{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]
    });

    await loadCartFetch();

    await expectAsync(
      updateDeliverOption(productId2, '3')
    ).toBeRejectedWithError('Cart item not found.');

    expect(cart[0].deliveryOptionId).toEqual('1');
  });

  it('does not make a request for an invalid delivery option', async () => {
    const {fetchSpy} = installApiMock({
      cart: [{
        productId: productId1,
        quantity: 1,
        deliveryOptionId: '1'
      }]
    });

    await loadCartFetch();
    fetchSpy.calls.reset();

    await updateDeliverOption(productId1, '4');

    expect(cart[0].deliveryOptionId).toEqual('1');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
