export const cart = [];

export function addToCart(productId) {
  const quantityAdding = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantityAdding;
  } else {
    cart.push({
      productId: productId,
      quantity: quantityAdding,
    });
  }
}