/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';
// ===================
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

    // console.log('Login response:', res);
    // console.log(
    //   'Calling showAlert with:',
    //   'success',
    //   'Logged in successfully!',
    // );

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => location.assign('/'), 1500);
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
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!');
      window.setTimeout(() => location.reload(true), 3000); // reload fresh page after 3secs!
    }
  } catch (err) {
    console.error('Logout error:', err.response || err);
    showAlert('error', 'Error logging out! Try again.');
  }
};
