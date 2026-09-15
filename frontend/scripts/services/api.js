import {
  showGuestSessionStartedAlert,
  showGuestSessionExpiredAlert
} from '../utils/sessionAlerts.js';

const API_URL = 'http://localhost:3500';

let guestExpirationTimer;
let guestRenewalPromise;
let guestExpirationPromise;
let guestSessionDurationMinutes;

class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function clearGuestExpirationTimer() {
  if (guestExpirationTimer) {
    clearTimeout(guestExpirationTimer);
    guestExpirationTimer = undefined;
  }
}

function scheduleGuestExpiration(expiresAt) {
  clearGuestExpirationTimer();

  const timeRemaining =
      new Date(expiresAt).getTime() - Date.now();

  if (timeRemaining <= 0) {
    void handleGuestExpiration();
    return;
  }

  guestExpirationTimer = setTimeout(() => {
    void handleGuestExpiration();
  }, timeRemaining);
}

async function request(path, options = {}, retryGuest = true) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include'
  });

  const data = await parseResponse(response);

  if (
      response.status === 401 &&
      retryGuest &&
      path !== '/guest'
  ) {
    if (data?.code === 'GUEST_REQUIRED') {
      await createGuestSession(true);

      return request(
          path,
          options,
          false
      );
    }

    return handleGuestExpiration();
  }

  if (!response.ok) {
    throw new ApiError(
        data?.message ||
        `Request failed: ${response.status} ${response.statusText}`,
        response.status,
        data?.code
    );
  }

  return data;
}

export async function createGuestSession(showStartAlert = true) {
  const session = await request(
      '/guest',
      { method: 'POST' },
      false
  );

  guestSessionDurationMinutes =
      session.sessionDurationMinutes;

  scheduleGuestExpiration(
      session.guest.expiresAt
  );

  if (showStartAlert) {
    showGuestSessionStartedAlert(
        guestSessionDurationMinutes
    );
  }
}

async function renewGuestSession() {
  if (guestRenewalPromise) {
    return guestRenewalPromise;
  }

  guestRenewalPromise =
      createGuestSession(false);

  try {
    await guestRenewalPromise;
  } finally {
    guestRenewalPromise = undefined;
  }
}

async function handleGuestExpiration() {
  if (guestExpirationPromise) {
    return guestExpirationPromise;
  }

  guestExpirationPromise = (async () => {
    clearGuestExpirationTimer();

    showGuestSessionExpiredAlert(
        guestSessionDurationMinutes
    );

    await renewGuestSession();

    window.location.replace('amazon.html');
  })();

  return guestExpirationPromise;
}

export async function ensureGuestSession() {
  try {
    const session = await request(
        '/guest',
        {},
        false
    );

    guestSessionDurationMinutes =
        session.sessionDurationMinutes;

    scheduleGuestExpiration(
        session.guest.expiresAt
    );

  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }

    if (error.code === 'GUEST_REQUIRED') {
      await createGuestSession(true);
      return;
    }

    return handleGuestExpiration();
  }
}

export async function deleteGuestSession() {
  const response = await request('/guest', { method: 'DELETE' }, false);
  clearGuestExpirationTimer();
  return response;
}

export function fetchProducts() {
  return request('/products', {}, false);
}

export function fetchCart() {
  return request('/cart');
}

export function addCartItem(productId, quantity = 1) {
  return request('/cart/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId, quantity })
  });
}

export function updateCartItem(productId, updates) {
  return request(`/cart/items/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
}

export function deleteCartItem(productId) {
  return request(`/cart/items/${productId}`, {
    method: 'DELETE'
  });
}

export function clearCart() {
  return request('/cart', {
    method: 'DELETE'
  });
}

export function createOrder() {
  return request('/orders', {
    method: 'POST'
  });
}

export function fetchOrders() {
  return request('/orders');
}

export function fetchOrder(orderId) {
  return request(`/orders/${orderId}`);
}
