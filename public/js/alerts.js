export const showAlert = (type, msg) => {
  const el = document.createElement('div');
  el.className = `alert alert--${type}`;
  el.textContent = msg;
  document.querySelector('body').append(el);

  setTimeout(() => el.remove(), 5000);
};
