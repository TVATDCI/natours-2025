// ======================================
// catchAsync Utility Function
// ======================================
// A higher-order function that wraps async route handlers
// and forwards any errors thrown to Express's global error handler.
// This eliminates repetitive try/catch blocks in every async controller.
//
// Usage:
//   Instead of writing:
//     exports.getTour = async (req, res, next) => {
//       try {
//         const tour = await Tour.findById(req.params.id);
//         res.status(200).json({ status: 'success', data: { tour } });
//       } catch (err) {
//         next(err);
//       }
//     }
//
// In controller (tourController.js)
//     exports.getTour = catchAsync(async (req, res, next) => {
//       const tour = await Tour.findById(req.params.id);
//       res.status(200).json({ status: 'success', data: { tour } });
//     });
//
// This keeps controller code clean and focused on logic, not error handling.
//
// However, ESLint is moaning "Unexpected block statement surrounding arrow body; move the returned value immediately after the =>.eslintarrow-body-style"
// simplify arrow function by removing the curly braces and the return keyword — in other words, use an implicit return.
// module.exports = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next); // Automatically passes any rejected promise to next()
//   };
// };

//
// ======================================
// ESLint-friendly version:
// ======================================
//
module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);
