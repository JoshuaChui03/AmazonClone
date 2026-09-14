import {validDeliveryOption} from "./deliveryOptions.js";

export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));

  if (!cart) {
    cart = [{
      productId: '6aa7b605df8996a26403ab0a',
      quantity: 2,
      deliveryOptionId: '1'
    },
      {
        productId: '6aa7b605df8996a26403ab0b',
        quantity: 1,
        deliveryOptionId: '2'
      }];
  }
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantityAdding = 1) {
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
      deliveryOptionId: '1',
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  })

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  })

  return cartQuantity;
}

export function  updateQuantity (productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  })

  saveToStorage();
}

export function updateDeliverOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId && validDeliveryOption(deliveryOptionId)) {
      matchingItem = cartItem;
      matchingItem.deliveryOptionId = deliveryOptionId;
      saveToStorage();
    }});
}

export async function loadCartFetch() {
    const response = await fetch('https://supersimplebackend.dev/cart');
    const data = await response.text();
    console.log(data);
}

export function resetCart() {
  cart = [];
  saveToStorage();
}