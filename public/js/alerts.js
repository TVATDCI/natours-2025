/* eslint-disable */
// type = 'success' or 'error'
// Dom Handling ;)
// hide the left over
export const hideAlert = () => {
  const el = document.querySelector('.alert'); // select el with alert class
  if (el) el.parentElement.removeChild(el); // then remove it.
};

export const showAlert = (type, msg) => {
  hideAlert(); // remove any existing alerts first

  const markup = `<div class="alert alert--${type}">${msg}</div>`; // style.css
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // select the alert!

  window.setTimeout(hideAlert, 5000); // hide it after 5 secs
};
