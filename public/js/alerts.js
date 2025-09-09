// export const hideAlert = () => {
//   const el = document.querySelector('.alert');
//   if (el) el.parentElement.removeChild(el);
// };

// // Show alert (success or error)
// export const showAlert = (type, msg) => {
//   hideAlert(); // remove any existing alerts first

//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

//   window.setTimeout(hideAlert, 5000);
// };

// =====================================
// Function declaration, hoisted version
// =====================================
export function hideAlert() {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}

// Show alert (success or error)
export function showAlert(type, msg) {
  hideAlert(); // remove any existing alerts first

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
}
