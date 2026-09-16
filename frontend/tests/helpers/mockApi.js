function jsonResponse(data, status = 200, statusText = 'OK') {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function installApiMock({
  products = [],
  cart = []
} = {}) {
  let currentCart = clone(cart);

  const fetchSpy = spyOn(window, 'fetch').and.callFake(async (url, options = {}) => {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;
    const method = (options.method || 'GET').toUpperCase();

    if (path.endsWith('/products') && method === 'GET') {
      return jsonResponse(clone(products));
    }

    if (path.endsWith('/cart') && method === 'GET') {
      return jsonResponse(clone(currentCart));
    }

    if (path.endsWith('/cart') && method === 'DELETE') {
      currentCart = [];
      return jsonResponse([]);
    }

    if (path.endsWith('/cart/items') && method === 'POST') {
      const {productId, quantity = 1} = JSON.parse(options.body || '{}');
      const existingItem = currentCart.find((item) => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        currentCart.push({
          productId,
          quantity,
          deliveryOptionId: '1'
        });
      }

      return jsonResponse(clone(currentCart));
    }

    const cartItemMatch = path.match(/\/cart\/items\/([^/]+)$/);

    if (cartItemMatch) {
      const productId = decodeURIComponent(cartItemMatch[1]);
      const itemIndex = currentCart.findIndex((item) => item.productId === productId);

      if (method === 'DELETE') {
        if (itemIndex === -1) {
          return jsonResponse({
            message: 'Cart item not found.'
          }, 404, 'Not Found');
        }

        currentCart.splice(itemIndex, 1);
        return jsonResponse(clone(currentCart));
      }

      if (method === 'PATCH') {
        if (itemIndex === -1) {
          return jsonResponse({
            message: 'Cart item not found.'
          }, 404, 'Not Found');
        }

        const updates = JSON.parse(options.body || '{}');
        currentCart[itemIndex] = {
          ...currentCart[itemIndex],
          ...updates
        };

        return jsonResponse(clone(currentCart));
      }
    }

    return jsonResponse({
      message: `Unhandled test request: ${method} ${path}`
    }, 500, 'Test Mock Error');
  });

  return {
    fetchSpy,
    getCart: () => clone(currentCart)
  };
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function waitFor(condition, timeoutMs = 1000) {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime >= timeoutMs) {
      throw new Error('Timed out waiting for test condition.');
    }

    await flushPromises();
  }
}
