/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { signup } from './signup.js';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';
import { leaflet } from './leaflet.js';
import { leafletMap } from './leafletMap.js';
import { bookTour } from './stripe.js';
import { showAlert } from './alerts.js';

// ==================
// DOM Elements
// ==================
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const removePhotoBtn = document.getElementById('remove-photo');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// ==================
// Auth Handlers
// ==================
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

// ==================
// User Data Handlers
// ==================
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    const photo = document.getElementById('photo').files[0];
    if (photo) form.append('photo', photo);

    updateSettings(form, 'data');
  });
}

if (removePhotoBtn) {
  removePhotoBtn.addEventListener('click', () => {
    const form = new FormData();
    form.append('photo', 'default.jpg');
    updateSettings(form, 'data');
  });
}

// ==================
// Password Handlers
// ==================
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.querySelector('.btn--save-password');
    saveBtn.textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    try {
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password',
      );
    } catch (err) {
      console.error('Password update failed:', err);
    } finally {
      saveBtn.textContent = 'Save password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    }
  });
}

// ==================
// Booking Handler
// ==================
if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    if (tourId) bookTour(tourId);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
// console.log('🟢 Alert message from body:', alertMessage);
if (alertMessage) showAlert('success', alertMessage, 20);
