// import axios from 'axios'; - NO NEED to install axios by injecting AJEX script in base.pug as global dependency. Watch you have to let Helmet know 🤓

/* eslint-disable */

// LOGIN HANDLER
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: { email, password },
    });

    console.log('Login response:', res);

    if (res.data.status === 'success') {
      alert('Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/'); // redirect to homepage
      }, 1500);
    }
  } catch (err) {
    console.error('Login error:', err.response || err);
    alert(
      err.response.data.message || 'Something went wrong! Please try again.',
    );
  }
};

// DOM HANDLING
const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}
