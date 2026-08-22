import {addToCart, loadCartFetch} from '../data/cart.js'
import {products, loadProductsFetch} from '../data/products.js'
import {renderAmazonHeader, updateCartQuantity} from "./amazonHeader.js";

loadPage();

async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      loadCartFetch()
    ]);
  } catch (error) {
    console.error("Error loading page:", error);
  }

  renderAmazonHeader();
  renderProductsGrid();
}

function renderProductsGrid() {

  const url = new URL(window.location.href);
  const searchQuery = url.searchParams.get("search");

  let filteredProducts = products;

  if (searchQuery) {
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchQuery.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  let productsHTML = ''



  filteredProducts.forEach((product) => {
    productsHTML += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          
          ${product.extraInfoHtml()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
  })


  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  function addedToCartCheckmark(timeoutId, productId) {
    const addedCheckmark = document.querySelector(`.js-added-to-cart-${productId}`);
    addedCheckmark.classList.add('visible');

    clearTimeout(timeoutId);

    return setTimeout(() => {
      addedCheckmark.classList.remove('visible');
    }, 2000)
  }

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    let timeoutId;
    button.addEventListener('click', (e) => {
      const productId = button.dataset.productId;

      addToCart(productId);
      timeoutId = addedToCartCheckmark(timeoutId, productId);
      updateCartQuantity();
    })
  })

  updateCartQuantity();
}