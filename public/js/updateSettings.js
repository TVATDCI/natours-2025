/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// ==========================================================================================================================
// updateData V2. This version (updateSettings) will use ternary operator to differ url between updateData and updatePassword
// ==========================================================================================================================
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
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

      // ✅ If updating user DATA (not password), reload the page
      if (type === 'data') {
        window.setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
  } catch (err) {
    console.error('🔴 Update error:', err.response?.data || err.message);
    showAlert('error', err.response?.data?.message || 'Update failed!');
  }
};
