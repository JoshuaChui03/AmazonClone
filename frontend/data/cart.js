import {validDeliveryOption} from './deliveryOptions.js';
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} from '../scripts/services/api.js';

export let cart = [];

export async function loadCartFetch() {
  cart = await fetchCart();
  return cart;
}

export async function addToCart(productId, quantityAdding = 1) {
  cart = await addCartItem(productId, quantityAdding);
  return cart;
}

export async function removeFromCart(productId) {
  cart = await deleteCartItem(productId);
  return cart;
}

export function calculateCartQuantity() {
  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
}

export async function updateQuantity(productId, newQuantity) {
  cart = await updateCartItem(productId, { quantity: newQuantity });
  return cart;
}

export async function updateDeliverOption(productId, deliveryOptionId) {
  if (!validDeliveryOption(deliveryOptionId)) {
    return cart;
  }

  cart = await updateCartItem(productId, { deliveryOptionId });
  return cart;
}

export async function resetCart() {
  cart = await clearCart();
  return cart;
}

// Used after POST /orders because the backend already cleared the saved cart.
export function resetCartLocally() {
  cart = [];
}