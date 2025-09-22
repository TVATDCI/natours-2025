/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// ========================================================
// Update user data or password
// type: 'data' | 'password'
// ========================================================
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    // http: req directly to API endpoint = /updateMe
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    // console.log('✅ Response from /updateMe:', res);
    // console.log('✅ Response from /updateMyPassword:', res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);

      // Reload only for profile data updates
      if (type === 'data') {
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
  } catch (err) {
    console.error('🔴 Update error:', err.response?.data || err.message);
    showAlert('error', err.response?.data?.message || 'Update failed!');
  }
};
