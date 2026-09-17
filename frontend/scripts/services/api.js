import {
  showGuestSessionStartedAlert,
  showGuestSessionExpiredAlert, showUserSessionExpiredAlert
} from '../utils/sessionAlerts.js';

import {API_URL} from '../config/config.js';

let guestExpirationTimer;
let guestExpirationPromise;
let guestSessionDurationMinutes;
let currentSession = null;

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

  const timeRemaining = new Date(expiresAt).getTime() - Date.now();

  if (timeRemaining <= 0) {
    void handleGuestExpiration();
    return;
  }

  guestExpirationTimer = setTimeout(() => {
    void handleGuestExpiration();
  }, timeRemaining);
}

async function handleUserExpiration() {
  clearGuestExpirationTimer();
  currentSession = null;
  showUserSessionExpiredAlert();
  window.location.replace('login.html');

  // Keep callers waiting until the browser navigates away.
  return new Promise(() => {});
}

async function request(path, options = {}, retryGuest = true) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include'
  });

  const data = await parseResponse(response);

  if (response.status === 401 && retryGuest && path !== '/guest') {
    if (data?.code === 'USER_EXPIRED' || data?.code === 'USER_INVALID') {
      return handleUserExpiration();
    }

    if (data?.code === 'GUEST_EXPIRED' || data?.code === 'GUEST_INVALID') {
      return handleGuestExpiration();
    }

    if (data?.code === 'GUEST_REQUIRED') {
      return redirectToLogin();
    }
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
  const session = await request('/guest', { method: 'POST' }, false);

  currentSession = {
    type: 'guest',
    account: session.guest
  };

  guestSessionDurationMinutes = session.sessionDurationMinutes;
  scheduleGuestExpiration(session.guest.expiresAt);

  if (showStartAlert) {
    showGuestSessionStartedAlert(guestSessionDurationMinutes);
  }
}

function redirectToLogin() {
  clearGuestExpirationTimer();
  currentSession = null;
  window.location.replace('login.html');

  // Keep callers waiting until the browser navigates away.
  return new Promise(() => {});
}

async function handleGuestExpiration() {
  if (guestExpirationPromise) {
    return guestExpirationPromise;
  }

  guestExpirationPromise = (async () => {
    clearGuestExpirationTimer();
    currentSession = null;

    showGuestSessionExpiredAlert(guestSessionDurationMinutes);
    return redirectToLogin();
  })();

  return guestExpirationPromise;
}

export async function ensureSession() {
  try {
    const session = await request('/auth/session', {}, false);

    currentSession = {
      type: session.type,
      account: session.account
    };

    if (session.type === 'guest') {
      guestSessionDurationMinutes = session.sessionDurationMinutes;
      scheduleGuestExpiration(session.account.expiresAt);
    } else {
      clearGuestExpirationTimer();
    }

    return;
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }

    if (error.code === 'USER_EXPIRED' || error.code === 'USER_INVALID') {
      return handleUserExpiration();
    }

    if (error.code === 'GUEST_EXPIRED' || error.code === 'GUEST_INVALID') {
      return handleGuestExpiration();
    }

    if (error.code === 'GUEST_REQUIRED') {
      return redirectToLogin();
    }

    throw error;
  }
}

export function getCurrentSession() {
  return currentSession;
}

export async function loginUser(username, password) {
  const session = await request('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  }, false);

  clearGuestExpirationTimer();
  currentSession = {
    type: 'user',
    account: session.user
  };

  return session.user;
}

export async function logoutUser() {
  await request('/auth/logout', { method: 'POST' }, false);
  clearGuestExpirationTimer();
  currentSession = null;
}

export async function deleteGuestSession() {
  const response = await request('/guest', { method: 'DELETE' }, false);
  clearGuestExpirationTimer();
  currentSession = null;
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
