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
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
// select user data form
const userDataForm = document.querySelector('.form-user-data');

// === LOGIN FORM ===========================================
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

// === LOGOUT BUTTON ====================================
// If there is an event (addEventListener) when there is a click(logoutBtn), call the logout function
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// === UPDATE FORM === USER SETTINGS(DATA) ==============
if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}
