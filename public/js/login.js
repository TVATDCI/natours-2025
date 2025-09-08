/* eslint-disable */
import axios from 'axios';

// LOGIN HANDLER AXIOS
export const login = async (email, password) => {
  try {
    const res = await axios.post('/api/v1/users/login', { email, password });

    if (res.data.status === 'success') {
      alert('Logged in successfully!');
      window.setTimeout(() => location.assign('/'), 1500);
    }
  } catch (err) {
    alert(
      err.response?.data?.message || 'Something went wrong! Please try again.',
    );
  }
};
// DOM HANDLING
// moved to js/index.js
