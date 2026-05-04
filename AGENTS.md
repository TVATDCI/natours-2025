# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-24
**Commit:** 3a380fd
**Branch:** main

## OVERVIEW

Natours — Node.js/Express/MongoDB tour booking API with Pug server-side rendering. CommonJS backend, Parcel-bundled ES module frontend. Learning project with enterprise-level structure aspirations.

## STRUCTURE

```
.
├── app.js              # Express app factory (middleware, routes, error handler)
├── server.js           # Entry point: env → DB → HTTP server → graceful shutdown
├── controllers/        # Business logic + handlerFactory CRUD pattern
├── models/             # Mongoose schemas (tour, user, review, booking)
├── routes/             # Express route definitions
├── middleware/         # Security, sanitization, CORS, global middlewares
├── utils/              # catchAsync, AppError, APIFeatures, email
├── views/              # Pug templates (SSR + email templates)
├── public/             # Static assets + frontend JS (Parcel bundled)
├── config/             # DB connection only
└── dev-data/           # Seed data + import scripts
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add API endpoint | `routes/` → `controllers/` → `app.js` | Wire route in app.js after existing routes |
| Modify data model | `models/` | Mongoose schemas with virtuals, middleware, geospatial |
| Fix auth/security | `middleware/security.js`, `controllers/authController.js` | JWT + bcrypt + helmet + rate limiting |
| Add query features | `utils/apiFeatures.js` | Filter, sort, limit, paginate chainable class |
| Handle async errors | `utils/catchAsync.js` | Wrap async handlers, auto-forward to global error handler |
| Custom error class | `utils/appError.js` | Operational vs programming error distinction |
| CRUD operation | `controllers/handlerFactory.js` | Generic factory: getAll, getOne, createOne, updateOne, deleteOne |
| Upload images | `controllers/multerTourImgController.js`, `multerUserImgController.js` | Sharp resize + Cloudinary upload |
| Email sending | `utils/email.js` | Nodemailer + SendGrid fallback |
| Frontend JS | `public/js/index.js` | Parcel entry point. Bundled to `public/js/bundle/` |
| Data seeding | `dev-data/data/import-dev-data.js` | `--import` or `--delete` flags |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `app` | Express app | `app.js` | Main application instance |
| `connectDB` | Function | `config/db.js` | Mongoose connection, no try/catch (bubbles to server.js) |
| `catchAsync` | HOF | `utils/catchAsync.js` | Wraps async handlers: `fn => (req, res, next) => fn(...).catch(next)` |
| `AppError` | Class | `utils/appError.js` | Extends Error with statusCode, status, isOperational |
| `APIFeatures` | Class | `utils/apiFeatures.js` | Chains filter, sort, limitFields, paginate |
| `handlerFactory` | Module | `controllers/handlerFactory.js` | Generic CRUD: deleteOne, updateOne, createOne, getOne, getAll |
| `securityMiddleware` | Router | `middleware/security.js` | Composes json, urlencoded, cookieParser, mongoSanitize, hpp, sanitization |
| `globalErrorHandler` | Middleware | `controllers/errorController.js` | 4-param Express error handler. Dev mode = full details. Prod = sanitized |

## CONVENTIONS

- **CommonJS only** — `require`/`module.exports`. Frontend JS uses ES imports but is Parcel-bundled.
- **Airbnb ESLint** with overrides: `no-console: warn`, `func-names: off`, `object-shorthand: off`, `no-underscore-dangle: off`, `class-methods-use-this: off`.
- **Prettier**: single quotes, semicolons, 2-space indent, 80-char width for Pug.
- **Async handlers**: ALWAYS wrap with `catchAsync`. NEVER write raw `try/catch` in controllers.
- **Errors**: Create operational errors with `new AppError(msg, statusCode)`. Forward via `next(err)`.
- **JSend responses**: `{ status: 'success'|'fail'|'error', data: { ... } }`.
- **Mongoose**: Use `.save()` for password changes (triggers pre-save hooks). Avoid `findByIdAndUpdate` for user password updates.
- **Route aliasing**: Pre-field middleware manipulates `req.query` before hitting `getAllTours`.
- **Nested routes**: `router.use('/:tourId/reviews', reviewRouter)` with `mergeParams: true`.

## ANTI-PATTERNS (THIS PROJECT)

- **DO NOT** use `findByIdAndUpdate` for user password changes — skips pre-save hashing middleware.
- **DO NOT** commit `config.env` — contains live secrets. It is in `.gitignore` but may still be tracked.
- **DO NOT** write `try/catch` in controllers — use `catchAsync` wrapper.
- **DO NOT** use ES module `import/export` in backend — project is CommonJS.
- **DO NOT** add raw `console.log` in production — ESLint warns on `no-console`.
- **DO NOT** forget `runValidators: true` on `findByIdAndUpdate` in factory handlers.
- **DO NOT** define `passwordConfirm` in schema without `select: false` — it is already `undefined` after save, but be careful.

## UNIQUE STYLES

- **handlerFactory pattern**: All standard CRUD is generic. Controllers delegate to `factory.getAll(Model)`, `factory.getOne(Model, popOptions)`, etc. Only custom logic (aggregations, geospatial) lives directly in controllers.
- **Split multer controllers**: Image upload logic is in separate `multerTourImgController.js` and `multerUserImgController.js` rather than middleware/ or utils/.
- **Webhook in app.js**: `/webhook-checkout` is mounted directly in `app.js` (needs raw body) rather than in `routes/bookingRoutes.js`.
- **Mixed module systems**: Backend CommonJS, frontend ES modules via Parcel.
- **No service layer**: Business logic is entirely in controllers. No `services/` directory.
- **No tests**: Zero test infrastructure.
- **No `start` script**: Only `start:dev`, `start:prod`, `start:local:prod`.

## COMMANDS

```bash
# Development
npm run start:dev          # nodemon server.js

# Production
npm run start:prod         # NODE_ENV=production node server.js

# Linting
npm run lint               # eslint .
npm run lint:fix           # eslint . --fix

# Frontend JS (Parcel)
npm run watch:js           # parcel serve public/js/index.js --dist-dir public/js/bundle
npm run build:js           # parcel build public/js/index.js --dist-dir public/js/bundle

# Data seeding
npm run import-data        # node dev-data/data/import-dev-data.js --import
npm run delete-data        # node dev-data/data/import-dev-data.js --delete
```

## SECURITY WORKFLOW (Cognitive Microservices)

This project now uses the **Cognitive Microservices** architecture for development, including automated security auditing as a mandatory pre-deployment gate.

### Available Skills

| Skill | Purpose | Use When |
|-------|---------|----------|
| `security-auditor` | Pre-deployment vulnerability scan | Before shipping to production |
| `momus-reviewer` | Deep review of PRDs/plans | After PRD creation, before execution |
| `sisyphus-plan` | Plan creation & execution | Approved brief → PRD → issues → plan |
| `discovery-orchestrator` | Scope clarification | Idea but unsure about requirements |

### Security-Auditor Skill

A dedicated `security-auditor` skill is available for pre-deployment vulnerability scanning:

**Triggers:** "security review", "audit", "check for vulnerabilities", "pre-deploy scan", "security check"

**What it scans for:**
- Plaintext secrets & API keys (config files, hardcoded strings)
- Injection vulnerabilities (SQL, command, NoSQL, LDAP, XXE)
- Cross-Site Scripting (XSS) — innerHTML, dangerouslySetInnerHTML, CSP gaps
- CSRF protection gaps — missing tokens, SameSite cookies, state-changing GET routes
- Insecure configurations — CORS, debug mode, disabled security features
- Path traversal — unvalidated user input in file paths

**Integration in workflow:**
```
discovery-orchestrator (scope) → sisyphus-plan (plan) → momus-reviewer (review)
  → security-auditor (pre-deploy scan) → archivist (publish)
```

**Gate decisions:**
- **PASS** → Safe to deploy
- **WARNING** → Proceed with caution, document accepted risks
- **FAIL** → STOP, fix critical vulnerabilities before deployment

### Current Security Status (2026-05-04)

**Last audit result:** `FAIL` — 8 critical findings

**Critical gaps requiring immediate attention:**
1. **Plaintext secrets in config.env** — Database, Stripe, SendGrid, Cloudinary, Gmail, JWT credentials
2. **No CSRF protection** — Application-wide missing CSRF tokens
3. **Mass assignment vulnerability** — `authController.signup` allows `role` field injection
4. **Weak JWT secret** — Current secret is predictable/guessable
5. **Cookie missing SameSite** — Session cookies lack SameSite attribute
6. **Logout via GET** — State-changing action uses GET instead of POST
7. **No auth-specific rate limiting** — Auth routes share global rate limit
8. **Unvalidated file paths** — Multer tour image controller accepts raw IDs

**Before next production deploy:**
- [ ] Rotate ALL secrets in config.env and move to hosting platform env vars
- [ ] Install and configure `csurf` for CSRF protection
- [ ] Whitelist signup fields to prevent role escalation
- [ ] Generate cryptographically secure JWT secret (`crypto.randomBytes(64)`)
- [ ] Add `sameSite: 'strict'` to session cookies
- [ ] Change logout route from GET to POST
- [ ] Add stricter rate limiting on auth endpoints
- [ ] Validate ObjectId format before using in file paths

### Skill Location
- Full skill: `~/.config/opencode/skills/security-auditor/SKILL.md`
- Latest audit report: `.sisyphus/notepads/natours-stability-refactor/security-audit-2026-05-04.md`

## UPDATED ANTI-PATTERNS (SECURITY)

- **DO NOT** commit `config.env` — contains live secrets (already in .gitignore, verify untracked)
- **DO NOT** generate predictable JWT secrets — use `crypto.randomBytes(64).toString('hex')`
- **DO NOT** allow mass assignment on signup — whitelist `name`, `email`, `password`, `passwordConfirm` only
- **DO NOT** use GET for state-changing operations — logout, delete, update should be POST/DELETE/PATCH
- **DO NOT** trust user input in file paths — validate ObjectId format before filesystem access
- **DO NOT** disable security middleware in production — keep mongoSanitize, helmet, hpp enabled

## NOTES

- `server.js` handles process-level errors inline: `uncaughtException`, `unhandledRejection`, `SIGINT`, `SIGTERM`. Graceful shutdown closes HTTP server before exit.
- `config/db.js` has NO try/catch — rejections bubble to `server.js` `unhandledRejection` handler.
- `middleware/security.js` is an Express Router that composes all security middleware. Imported as a single unit in `app.js`.
- `public/js/bundle/` is generated by Parcel and should not be edited manually.
- The project uses `config.env` (not `.env`) for environment variables.
- **NEW:** This project is part of the Main-vault Cognitive Microservices workflow (see `~/.config/opencode/skills/` for available skills).
