import {calculateCartQuantity} from "../data/cart.js";
import {getCurrentSession, logoutUser} from './services/api.js';

export function renderAmazonHeader() {
  const session = getCurrentSession();
  const isUser = session?.type === 'user';
  const username = session?.account?.username;

  const accountHTML = isUser
    ? `
      <button class="account-link header-link js-sign-out-link">
        <span class="returns-text">Hello, ${username}</span>
        <span class="orders-text">Sign Out</span>
      </button>
    `
    : `
      <a class="account-link header-link" href="login.html">
        <span class="returns-text">Guest</span>
        <span class="orders-text">Sign In</span>
      </a>
    `;

  document.querySelector('.js-amazon-header').innerHTML = `
      <div class="amazon-header-left-section">
        <a href="amazon.html" class="header-link">
          <img class="amazon-logo"
            src="images/amazon-logo-white.png">
          <img class="amazon-mobile-logo"
            src="images/amazon-mobile-logo-white.png">
        </a>
      </div>

      <div class="amazon-header-middle-section">
        <input class="search-bar js-search-bar" type="text" placeholder="Search">

        <button class="search-button js-search-button">
          <img class="search-icon" src="images/icons/search-icon.png">
        </button>
      </div>

      <div class="amazon-header-right-section">
        ${accountHTML}

        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>

        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png">
          <div class="cart-quantity js-cart-quantity"></div>
          <div class="cart-text">Cart</div>
        </a>
      </div>
  `;
  updateCartQuantity();

  document.querySelector('.js-search-bar').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      window.location.href = `amazon.html?search=${event.target.value}`;
    }
  });

  document.querySelector('.js-search-button').addEventListener('click', function() {
    const searchValue = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${searchValue}`;
  });

  const signOutLink = document.querySelector('.js-sign-out-link');

  if (signOutLink) {
    signOutLink.addEventListener('click', async () => {
      await logoutUser();
      window.location.replace('login.html');
    });
  }
}

export function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML = calculateCartQuantity();
}
