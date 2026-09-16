import {createGuestSession, loginUser} from './services/api.js';

const form = document.querySelector('.js-login-form');
const usernameInput = document.querySelector('.js-username');
const passwordInput = document.querySelector('.js-password');
const errorElement = document.querySelector('.js-login-error');
const guestLink = document.querySelector('.js-continue-as-guest');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorElement.textContent = '';

  try {
    await loginUser(
      usernameInput.value.trim(),
      passwordInput.value
    );

    window.location.href = 'amazon.html';
  } catch (error) {
    errorElement.textContent = error.message || 'Unable to sign in.';
  }
});


guestLink.addEventListener('click', async (event) => {
  event.preventDefault();
  errorElement.textContent = '';

  try {
    await createGuestSession(true);
    window.location.replace('amazon.html');
  } catch (error) {
    errorElement.textContent = error.message || 'Unable to start guest session.';
  }
});
