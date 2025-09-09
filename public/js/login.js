/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';

// LOGIN HANDLER AXIOS
export const login = async (email, password) => {
  try {
    const res = await axios.post('/api/v1/users/login', { email, password });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => location.assign('/'), 1500);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Something went wrong! Please try again.',
    );
  }
};

// DOM HANDLING
// moved to js/index.js for bundling!
