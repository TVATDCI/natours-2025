/* eslint-disable */
// type = 'success' or 'error'
// Dom Handling ;)
// hide the left over
export const hideAlert = () => {
  const el = document.querySelector('.alert'); // select el with alert class
  if (el) el.parentElement.removeChild(el); // then remove it.
};

export const showAlert = (type, msg, time = 7) => {
  hideAlert(); // remove any existing alerts first

  const markup = `<div class="alert alert--${type}">${msg}</div>`; // style.css
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // select the alert!

  setTimeout(hideAlert, time * 1000); // default time at at 7sec
};
