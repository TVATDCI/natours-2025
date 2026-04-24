# CONTROLLERS KNOWLEDGE BASE

**Scope:** `controllers/` — Business logic, CRUD handlers, auth, views, errors.

## OVERVIEW

Controllers follow a **factory + custom** pattern. Generic CRUD is delegated to `handlerFactory.js`. Only domain-specific logic (aggregations, geospatial, auth, views) lives directly in named controllers.

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Generic CRUD | `handlerFactory.js` | `deleteOne`, `updateOne`, `createOne`, `getOne`, `getAll` — all take a Mongoose Model |
| Tour CRUD | `tourController.js` | Delegates to factory. Custom: `getTourStats`, `getMonthlyPlan`, `getToursWithin`, `getDistances` |
| User CRUD | `userController.js` | Delegates to factory. Custom: `updateMe`, `deleteMe`, `getMe` |
| Review CRUD | `reviewController.js` | Delegates to factory. Custom: `setTourUserIds` (nested route pre-middleware) |
| Booking CRUD | `bookingController.js` | Delegates to factory. Custom: `getCheckoutSession`, `webhookCheckout` |
| Auth | `authController.js` | `signup`, `login`, `logout`, `protect`, `restrictTo`, `forgotPassword`, `resetPassword`, `updatePassword` |
| Views | `viewController.js` | Pug-rendered pages: overview, tour detail, login, signup, account, admin dashboard |
| Errors | `errorController.js` | Global 4-param error handler. Dev = full details. Prod = sanitized operational errors |
| Image upload (tour) | `multerTourImgController.js` | Multer config + Sharp resize for tour images |
| Image upload (user) | `multerUserImgController.js` | Multer config + Sharp resize for user avatars |
| Image upload (generic) | `photoController.js` | Cloudinary upload helper |

## CONVENTIONS

- **Always wrap async handlers with `catchAsync`** — imported from `../utils/catchAsync`.
- **Factory delegation**: Standard CRUD exports are one-liners: `exports.getAllTours = factory.getAll(Tour);`
- **Custom handlers**: Use `catchAsync(async (req, res, next) => { ... })` directly.
- **Populate on getOne**: `factory.getOne(Tour, { path: 'reviews' })` — virtual populate for reviews.
- **Nested route filter**: `handlerFactory.getAll` auto-filters by `req.params.tourId` if present.

## ANTI-PATTERNS

- **DO NOT** write `try/catch` blocks in controllers — use `catchAsync`.
- **DO NOT** use `findByIdAndUpdate` for password changes — skips Mongoose pre-save hooks. Use `.save()` instead.
- **DO NOT** forget to call `next()` in middleware-like controller functions (e.g., `aliasTopTours`).
- **DO NOT** put business logic in route files — routes are thin; controllers hold logic.

## UNIQUE PATTERNS

- **handlerFactory**: Generic CRUD functions return Express handler functions. Example: `exports.deleteTour = factory.deleteOne(Tour);`
- **Route aliasing**: `exports.aliasTopTours` manipulates `req.query` before `getAllTours` runs.
- **Split multer**: Upload logic is in controller files, not middleware/. This is project-specific.
- **setTourUserIds**: Review controller middleware sets `req.body.tour` and `req.body.user` for nested `POST /tours/:tourId/reviews`.
