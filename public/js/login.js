/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';

// ======================================================
// Future REFACTOR DRY Plan = Unify login / logout helper
// ======================================================
// LOGIN HANDLER AXIOS
// ===================
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      setTimeout(() => location.assign('/'), 1500);
    }
  } catch (err) {
    console.error('Login error:', err.response || err);
    showAlert('error', err.response.data.message || 'Something went wrong!');
  }
};

// DOM HANDLING
// moved to js/index.js for bundling!

// ===================
// LOGOUT HANDLER AXIOS
// ===================
export const logout = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      setTimeout(() => location.assign('/'), 1500);
    }
  } catch (err) {
    console.error('Logout error:', err.response || err);
    showAlert('error', 'Error logging out! Try again.');
  }
};
