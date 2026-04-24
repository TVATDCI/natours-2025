# UTILS KNOWLEDGE BASE

**Scope:** `utils/` — Cross-cutting utilities used by controllers, middleware, and models.

## OVERVIEW

Small, focused utility modules. Every async controller depends on `catchAsync`. Every custom error uses `AppError`. Every `getAll` uses `APIFeatures`.

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Wrap async handler | `catchAsync.js` | HOF: `fn => (req, res, next) => fn(...).catch(next)` |
| Custom error | `appError.js` | `class AppError extends Error` — adds statusCode, status, isOperational |
| Query building | `apiFeatures.js` | `new APIFeatures(query, req.query).filter().sort().limitFields().paginate()` |
| Send email | `email.js` | Nodemailer + SendGrid. Uses Pug templates from `views/emails/` |
| Send email (alt) | `emailOrg.js` | Alternative/experimental email implementation |
| Cloudinary upload | `cloudinary.js` | Cloudinary config + upload helper |

## CONVENTIONS

- **catchAsync**: Import in EVERY controller that has async handlers. No exceptions.
- **AppError**: Use for ALL operational errors (bad input, not found, unauthorized). Set `isOperational = true`.
- **APIFeatures**: Chain methods in order: `.filter().sort().limitFields().paginate()`. Each returns `this`.
- **Email**: `new Email(user, url).sendWelcome()` or `.sendPasswordReset()`. Templates live in `views/emails/`.

## ANTI-PATTERNS

- **DO NOT** write raw `try/catch` in controllers when `catchAsync` exists.
- **DO NOT** throw plain `Error` — always use `AppError` for operational errors.
- **DO NOT** mutate `req.query` directly in APIFeatures — it clones via spread operator.
- **DO NOT** call `apiFeatures.query` before chaining all methods — the chain builds the query; execution happens later with `await`.

## UNIQUE PATTERNS

- **catchAsync arrow style**: `module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);` — ESLint-friendly implicit return.
- **APIFeatures chaining**: Methods mutate `this.query` and return `this`. Final execution: `await features.query`.
- **AppError stack trace**: `Error.captureStackTrace(this, this.constructor)` — excludes constructor from stack.
