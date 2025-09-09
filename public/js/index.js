/* eslint-disable */
// public/js/index.js - Main Entry for JS Bundle
// ADD Global JS
import '@babel/polyfill';
// only export the function from login.js
import { login, logout } from './login.js';
// 2) Import map.js (if used on certain pages)
import { leaflet } from './leaflet.js';
import { leafletMap } from './leafletMap';

// DOM Handling: only run this if we're on the login page (included logout!)
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });

// If there is an event (addEventListener) when there is a click(logoutBtn), call the logout function
if (logoutBtn) logoutBtn.addEventListener('click', logout);
