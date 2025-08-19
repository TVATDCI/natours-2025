// XSS-CLEAN replacement using sanitize-html + escape-html
// 1. sanitize-html removes any HTML tags or attributes, leaving plain text.
// 2. escape-html converts any remaining special characters into safe HTML entities.
//    This ensures that even if a malicious string is entered, it cannot execute as code.
// 3. Works on req.body, req.query, and req.params to sanitize all incoming data.
// 4. Preserves user input safely in the database; no script or HTML injection is possible.
// 5. If sanitize-html strips everything but the original had content, escape it instead
//    to maintain user input while keeping it safe.
// 6. Ideal for small/medium projects where backend should enforce XSS safety.
// 7. Note: Frontend rendering should still follow safe practices, e.g., innerText vs innerHTML.

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

// =================================================================================================

// Option 1: Keep “empty” values (strict cleaning) - force the user to provide a proper value.
// Use sanitizeHtmlMiddleware to clean the entire field down to an empty string!
// Example input:
// {
//   "name": "<script>alert('xss')</script>",
//   "email": "safeuser@example.com",
//   "password": "pass1234",
//   "passwordConfirm": "pass1234"
// }
// After sanitization, the "name" field becomes empty because all tags were stripped.
// Since "name" is required in your Mongoose schema, the save operation is rejected (status 500).

// Middleware example (sanitize-html):
// const sanitizeHtml = require('sanitize-html');

// module.exports = (req, res, next) => {
//   const sanitize = (obj) => {
//     Object.entries(obj).forEach(([key, value]) => {
//       if (typeof value === 'string') {
//         obj[key] = sanitizeHtml(value, {
//           allowedTags: [],      // strip ALL tags
//           allowedAttributes: {},// strip ALL attributes
//         }).trim();
//       } else if (typeof value === 'object' && value !== null) {
//         sanitize(value); // recursively sanitize nested objects
//       }
//     });
//   };

//   if (req.body) sanitize(req.body);
//   if (req.params) sanitize(req.params);

//   next();
// };

// ==================================================================================================

// Option 2: User-friendly cleaning (preserve harmless text)
// Instead of stripping everything, sanitize-html removes only dangerous tags but keeps plain text.
// This prevents Mongoose validation errors when a required field is present but has HTML content.

// Example middleware implementation:
// const sanitizeHtml = require('sanitize-html');

// module.exports = (req, res, next) => {
//   ['body', 'query', 'params'].forEach((key) => {
//     if (req[key]) {
//       Object.entries(req[key]).forEach(([field, value]) => {
//         if (typeof value === 'string') {
//           const cleaned = sanitizeHtml(value, {
//             allowedTags: [],      // strip all tags
//             allowedAttributes: {},// strip all attributes
//           }).trim();

//           // If sanitizeHtml returns empty but user actually sent something,
//           // replace with placeholder instead of breaking validation
//           req[key][field] = cleaned || (value.trim() ? '[removed]' : '');
//         }
//       });
//     }
//   });

//   next();
// };

// Example output for malicious input:
// Input:
// {
//   "name": "<script>alert('xss')</script>",
//   "email": "safeuser@example.com",
//   "password": "pass1234",
//   "passwordConfirm": "pass1234"
// }
// Output after sanitization:
// {
//     "status": "success",
//     "data": {
//         "user": {
//             "name": "[removed]", // dangerous content removed but field preserved
//             "email": "safeuser@example.com",
//             "photo": "default.jpg",
//             "role": "user",
//             "active": true,
//             "_id": "68a3c8fb14eca8bc7cc95605",
//             "createdAt": "2025-08-19T00:44:43.185Z",
//             "updatedAt": "2025-08-19T00:44:43.185Z",
//             "__v": 0
//         }
//     }
// }
