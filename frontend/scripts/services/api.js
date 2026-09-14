const API_URL = 'http://localhost:3500';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export function fetchProducts() {
  return request('/products');
}

export function createOrder(cart) {
  return request('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cart })
  });
}

export function fetchOrders() {
  return request('/orders');
}