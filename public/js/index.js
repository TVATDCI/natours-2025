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

console.log('💡 index.js loaded successfully');

// === LOGIN FORM ===========================================
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('📥 Form submit handler triggered');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('📤 Passing to login():', { email, password });
    login(email, password);
  });

// === LOGOUT BUTTON ====================================
// If there is an event (addEventListener) when there is a click(logoutBtn), call the logout function
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// === UPDATE FORM === USER SETTINGS(DATA) === name, email ===========
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    // DEBUG: log form data
    console.log('📤 Form submit:', 'data');
    // updateData(name, email) → function only accepts name + email - Nothing else!
    updateSettings(form, 'data');
  });

// === UPDATE FORM === USER SETTINGS (PASSWORD) ==============
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // change button text while waiting
    const saveBtn = document.querySelector('.btn--save-password');
    saveBtn.textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    console.log('📤 Form submit new password:', {
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
