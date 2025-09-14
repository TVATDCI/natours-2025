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

// DOM Handling: only run this if we're on the login page (included logout!)
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
// select user data form
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

console.log('📇 index.js loaded successfully');

// === LOGIN FORM ===========================================
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('🤝 Form submit handler triggered');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('🟠 Passing to login():', { email, password });
    login(email, password);
  });

// === LOGOUT BUTTON ====================================
// If there is an event (addEventListener) when there is a click(logoutBtn), call the logout function
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// === UPDATE FORM === USER SETTINGS(DATA) === name, email ===========
// ==============================================
// USER DATA UPDATE FORM HANDLER
// Handles profile updates (name, email, photo).
// Submits data using FormData, so that files can
// be uploaded along with text fields (multipart/form-data).
// ==============================================
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create a new FormData object to hold form inputs
    // FormData is required here because we’re sending both
    // text fields (name/email) AND potentially a file (photo).
    const form = new FormData();

    // Append text fields
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    // Append photo field (if user selected one)
    // ⚠️ IMPORTANT: input element must have id="photo"
    const photo = document.getElementById('photo').files[0];
    if (photo) form.append('photo', photo);

    // Debugging: log form contents to ensure everything is correct
    // Note: logging FormData directly won’t show contents.
    // Iterate instead if you want to see key-value pairs.
    console.log('📃 Form submit data:');
    for (let [key, value] of form.entries()) {
      console.log(key, value);
    }

    // Call updateSettings utility function
    // Second argument 'data' indicates we’re updating user data (not password).
    updateSettings(form, 'data');
  });
}

// ==============================
// REMOVE PROFILE PHOTO HANDLER
// ==============================
const removePhoto = document.getElementById('remove-photo');
if (removePhoto) {
  removePhoto.addEventListener('click', () => {
    // Reset file input (so nothing is pending upload)
    const photoInput = document.getElementById('photo');
    const fileChosen = document.getElementById('file-chosen');
    if (photoInput) photoInput.value = '';
    if (fileChosen) fileChosen.textContent = 'Default (no profile picture)';

    // Create a form to reset backend to default
    const form = new FormData();
    form.append('photo', 'default.jpg');

    console.log('🗑 Removing profile photo → reset to default.jpg');

    updateSettings(form, 'data');
  });
}

// ===========================================================
// === UPDATE FORM === USER SETTINGS (PASSWORD ONLY) ==============
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

    console.log('🆕 Form submit new password:', {
      passwordCurrent,
      password,
      passwordConfirm,
    });

    // Add async within the function and and await for the promise + with try/catch/finally.
    // So the btn and fields always reset, never gets “stuck” on Updating., even if the request fails:
    // runs the API call.
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
