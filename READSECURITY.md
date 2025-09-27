# Security Overview – Natours 2025

This document explains the security middleware setup in this project. It serves as a reference for future maintenance and for anyone reviewing the codebase.

---

## Global Middleware (`globalsMiddleware.js`)

### Logging

- **`morgan('dev')`**
  Only enabled in development. Provides HTTP request logs to aid debugging.

### Secure HTTP Headers

- **`helmet.contentSecurityPolicy`**
  Configures a strict Content Security Policy (CSP).
  - `defaultSrc: 'self'` → blocks all external resources unless explicitly whitelisted.
  - `scriptSrc` → allows only self, Cloudflare CDN, and Stripe scripts.
  - `styleSrc` → self + https sources, with `'unsafe-inline'` (required for inline CSS in templates).
  - `imgSrc` → self + data/blob + OpenStreetMap + Carto + Cloudinary.
  - `connectSrc` → API calls allowed only to self, OSM, Carto, and Stripe.
  - `frameSrc` → restricts iframes to Stripe checkout.
  - `objectSrc: none` → disables Flash and other plugin embeds.
  - `upgradeInsecureRequests` → ensures HTTPS usage where possible.

---

## Security Middleware (`securityMiddleware.js`)

### Body & Cookie Handling

- **`express.json({ limit: '10kb' })`**
  Limits JSON request size to 10 KB to prevent DOS via large payloads.
- **`express.urlencoded({ extended: true, limit: '10kb' })`**
  Limits URL-encoded form data.
- **`cookieParser()`**
  Parses and secures cookies for authentication.

### Data Sanitization

- **`express-mongo-sanitize`**
  Prevents MongoDB operator injection (`$gt`, `$or`, etc.).
- **`hpp` (HTTP Parameter Pollution)**
  Prevents multiple query string parameters from overriding each other.
  Example: `?price=200&price=100` → only the last one is used unless whitelisted.
  - Whitelisted fields (safe to allow multiple values):
    - `duration`, `ratingsQuantity`, `ratingsAverage`, `maxGroupSize`, `difficulty`, `price`, `rating`.

- **Custom `sanitizeQueryMiddleware` & `sanitizeHtmlMiddleware`**
  Additional layers to strip out malicious HTML/JS from user input and query strings. Defends against XSS.

---

## Rate Limiting (`app.js`)

- **`express-rate-limit`**
  Limits each IP to **100 requests per hour** on `/api` routes.
  Prevents brute-force attacks and abuse.

---

## Proxy Trust (`app.js`)

- **`app.set('trust proxy', 1)`**
  Informs Express it’s running behind a proxy (e.g., Render, Heroku).
  Ensures correct client IP handling for rate limiting and secure cookies.

---

## Summary

This setup provides a **multi-layered defense**:

1. Hardened HTTP headers (Helmet + CSP).
2. Input sanitization (NoSQL injection, XSS, HPP).
3. Request size limits (prevent DOS).
4. Rate limiting (prevent brute force).
5. Proxy awareness (for deployed environments).

This level of protection is more than sufficient for a learning/demo project and aligns with real-world Node.js security best practices.
