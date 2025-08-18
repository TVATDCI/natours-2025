const sanitizeHtml = require('sanitize-html');

module.exports = (req, res, next) => {
  const sanitize = (obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        obj[key] = sanitizeHtml(value, {
          allowedTags: [], // strip ALL tags
          allowedAttributes: {}, // strip ALL attributes
        }).trim();
      } else if (typeof value === 'object' && value !== null) {
        sanitize(value); // recursively sanitize nested objects
      }
    });
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  next();
};
