/* eslint-disable */
// Update user data settings form in account.pug - It must be implemented in index.js (bundle entry)

import axios from 'axios';
import { showAlert } from './alerts';

// ======================================================================================================================
// updateData V2. This version (updateSettings) will use ternary operator to differ url between updateData and updatePassword
// NOTE: updateMe and updateMyPassword are 2 different endpoint, which mean it could be done separately!
// ======================================================================================================================
// type is either 'password' or 'data'
// Call for updateSettings in js/index.js
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

    console.log('✅ Response from /updateMe:', res);
    console.log('✅ Response from /updateMyPassword:', res);

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    console.error('🔴 Update error:', err.response?.data || err.message);
    showAlert('error', err.response?.data?.message || 'Update failed!');
  }
};

// ==========================================================================
// updateData V1. This version is only specify updating Data {name and email}
// Call for updateData in js/index.js
// ==========================================================================
// export const updateData = async (name, email) => {
//   try {
//     // DEBUG:
//     console.log('📤 Sending PATCH to /updateMe:', { name, email });
//     // http: req directly to API endpoint = /updateMe
//     const res = await axios({
//       method: 'PATCH',
//       url: '/api/v1/users/updateMe',
//       // The data is explicitly sent only name and email for the updating process
//       data: {
//         name,
//         email,
//       },
//     });

//     console.log('✅ Response from /updateMe:', res);

//     if (res.data.status === 'success') {
//       showAlert('success', 'Data updated successfully!');
//     }
//   } catch (err) {
//     console.error('🔴 Update error:', err.response?.data || err.message);
//     showAlert('error', err.response?.data?.message || 'Update failed!');
//   }
// };
