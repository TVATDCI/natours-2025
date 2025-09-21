/* eslint-disable */
// public/js/index.js - Main Entry for JS Bundle _ Don't forget to update the script OR npm run watch:js
// ADD Global JS
import '@babel/polyfill';
// only export the function from login.js
import { login, logout } from './login.js';
// import the updateUserSettings
import { updateSettings } from './updateSettings.js';
// Import map.js (if used on certain pages)
import { leaflet } from './leaflet.js';
import { leafletMap } from './leafletMap';
import { bookTour } from './stripe';

// DOM Handling: only run this if we're on the login page (included logout!)
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
// select user data form
const userDataForm = document.querySelector('.form-user-data');
const removePhoto = document.getElementById('remove-photo');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

console.log('📇 index.js loaded successfully');

//  =================
// === LOGIN FORM ===
//  =================
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log('🤝 Form submit handler triggered');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // console.log('🟠 Passing to login():', { email, password });
    login(email, password);
  });

//  ====================
// === LOGOUT BUTTON ===
//  ====================
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// ===========================================================
// === UPDATE FORM === USER SETTINGS(DATA) === name, email ===
// ===========================================================
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();

    // Append text fields
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    // Append photo field (if user selected one)
    // ⚠️ IMPORTANT: input element must have id (id="photo")
    const photo = document.getElementById('photo').files[0];
    if (photo) form.append('photo', photo);

    // Debugging: log form contents to ensure everything is correct
    // Note: logging FormData directly won’t show contents.
    // Iterate instead if you want to see key-value pairs.
    // console.log('📃 Form submit data:');
    for (let [key, value] of form.entries()) {
      // console.log(key, value);
    }

    updateSettings(form, 'data');
  });
}

// ==============================
// REMOVE PROFILE PHOTO HANDLER
// ==============================
if (removePhoto) {
  removePhoto.addEventListener('click', () => {
    const photoInput = document.getElementById('photo');
    if (photoInput) photoInput.value = ''; // clear pending file input

    // Create a form to tell backend: reset to default
    const form = new FormData();
    form.append('photo', 'default.jpg');

    // console.log('🗑 Removing profile photo → reset to default.jpg');

    // Backend sets photo to default.jpg
    // updateSettings handles success alert + reload
    updateSettings(form, 'data');
  });
}

// ===========================================================
// === UPDATE FORM === USER SETTINGS (PASSWORD ONLY) =========
// ===========================================================
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // change button text while waiting
    const saveBtn = document.querySelector('.btn--save-password');
    saveBtn.textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    // console.log('🆕 Form submit new password:', {
    //   passwordCurrent,
    //   password,
    //   passwordConfirm,
    // });
    try {
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password',
      );
      // logs or handles errors without breaking the flow
    } catch (err) {
      console.error('Password update failed:', err);
      // always resets the UI, whether success or failure.
    } finally {
      // reset button text when done
      document.querySelector('.btn--save-password').textContent =
        'Save password';
      // and select the fields again to clear them (.value = '')
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    }
  });
}

// ========================
// === bookTour Handler====
// ========================

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    if (tourId) {
      bookTour(tourId);
    } else {
      console.error('❌ No tourId found on button');
    }
  });
}
