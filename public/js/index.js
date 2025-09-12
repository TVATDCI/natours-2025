/* eslint-disable */
// public/js/index.js - Main Entry for JS Bundle _ Don't forget to update the script OR npm run watch:js
// ADD Global JS
import '@babel/polyfill';
// only export the function from login.js
import { login, logout } from './login.js';
// import the updateUserSettings
import { updateData } from './updateSettings.js';
// Import map.js (if used on certain pages)
import { leaflet } from './leaflet.js';
import { leafletMap } from './leafletMap';

// DOM Handling: only run this if we're on the login page (included logout!)
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
// select user data form
const userDataForm = document.querySelector('.form-user-data');

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

// === UPDATE FORM === USER SETTINGS(DATA) ==============
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // DEBUG: log form data
    console.log('📤 Form submit:', { name, email });
    // updateData(name, email) → function only accepts name + email - Nothing else!
    updateData(name, email);
  });
