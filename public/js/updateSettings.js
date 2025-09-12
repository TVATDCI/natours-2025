/* eslint-disable */
// Update user data settings form in account.pug - It must be implemented in index.js (bundle entry)

import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    // DEBUG:
    console.log('📤 Sending PATCH to /updateMe:', { name, email });
    // http: req directly to API endpoint = /updateMe
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      // The data is explicitly sent only name and email for the updating process
      data: {
        name,
        email,
      },
    });

    console.log('✅ Response from /updateMe:', res);

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
    }
  } catch (err) {
    console.error('🔴 Update error:', err.response?.data || err.message);
    showAlert('error', err.response?.data?.message || 'Update failed!');
  }
};
