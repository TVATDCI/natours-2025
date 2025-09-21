// XSS-CLEAN replacement using sanitize-html + escape-html
const sanitizeHtml = require('sanitize-html');
const escape = require('escape-html'); // tiny lib to escape HTML safely

module.exports = (req, res, next) => {
  ['body', 'query', 'params'].forEach((key) => {
    if (req[key]) {
      Object.entries(req[key]).forEach(([field, value]) => {
        if (typeof value === 'string') {
          // Clean tags first
          let cleaned = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          }).trim();

          // If cleaned is empty but original had content, escape it instead
          if (!cleaned && value.trim()) {
            cleaned = escape(value);
          }

          req[key][field] = cleaned;
        }
      });
    }
  });

  next();
};
