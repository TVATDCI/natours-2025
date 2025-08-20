# natours-2025

## Project Overview – Natours API

Digging [Compleat Node.js, Express, MongoDB](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) with [Jonas Schmedtmann](https://codingheroes.io/).

I value this project as a deep dive into building a **real-world, production-ready Node.js application** using **modern backend tools** like **Express, MongoDB,** and **Mongoose**. Along the way, including, clean API architect, powerful, and ready to scale.. It covers all essential concepts to master full-stack backend development using modern technologies.

**Natours** isn't a brand new project around. However, it has the approach and introduces me to **enterprise-level structure**. Its core feature gives an Opportunity to develop it into a modern real world app. It gives me that feels like: **practical, grounded, and developer-focused**

[Tuanthong Vaidyanond](https://www.linkedin.com/in/tuanthong-vaidyanond-6789782b2)

---

### Table of Contents

---

1. [Recap & Current Development Goals](#recap--current-development-goals)
2. [Technologies Used](#technologies-used)
3. [Folder Structure](#folder-structure)
4. [Project Setup: CommonJS First, ES Modules Later](#project-setup-commonjs-first-es-modules-later)
5. [What is an API?](#what-is-an-api)
   - [POST `/` Route Example](#post--route-example)
6. [REST Architecture and CRUD Operations](#rest-architecture-and-crud-operations)
   - [What is REST?](#what-is-rest)
   - [CRUD Operations in REST](#crud-operations-in-rest)
   - [Resources in REST](#resources-in-rest)
   - [Tour API Example](#tour-api-example)
   - [REST Best Practices](#rest-best-practices)
7. [What is JSON?](#what-is-json)
   - [JSON Structure](#json-structure)
   - [Example JSON](#example-json)
8. [What is JSend?](#what-is-jsend)
   - [JSend Structure](#jsend-structure)
   - [Example Tour JSend Response](#example-tour-jsend-response)
   - [Why Use JSend?](#why-use-jsend)
9. [Stateless RESTful APIs](#stateless-restful-apis)
   - [What Does Stateless Mean?](#what-does-stateless-mean)
   - [Why Stateless?](#why-stateless)
   - [Example with Token Auth](#example-with-token-auth)
   - [Summary of Stateless APIs](#summary-of-stateless-apis)
10. [MVC: Model – View – Controller](#mvc-model--view--controller)
    - [What Each Part Does](#what-each-part-does)
    - [MVC in API-Only Projects](#mvc-in-api-only-projects)
    - [Suggested Project Structure](#suggested-project-structure)
11. [The Request–Response Cycle in Express](#the-requestresponse-cycle-in-express)
    - [Express Middleware Flow](#express-middleware-flow)
12. [Express Morgan in Development](#express-morgan-in-development)
13. [Param Middleware in Express](#param-middleware-in-express)
    - [Additions for Learning & Scaling](#additions-for-learning--scaling)
    - [Param Middleware for ID Validation](#param-middleware-for-id-validation)
14. [Serving Static Files in Express](#serving-static-files-in-express)
15. [Mongoose Query Methods](#mongoose-query-methods)
    - [Chaining Queries](#chaining-queries)
    - [Creating Documents with Mongoose](#creating-documents-with-mongoose)
16. [Dynamic Filtering with queryObj](#dynamic-filtering-with-queryobj)
    - [The Flow of Dynamic Filtering](#the-flow-of-dynamic-filtering)
17. [Advanced Filtering](#advanced-filtering)
    - [Sorting](#sorting)
    - [Field Limiting](#field-limiting)
18. [Pagination with Mongoose in Node.js](#pagination-with-mongoose-in-nodejs)
19. [Route aliasing pattern](#route-aliasing-pattern)
20. [Refactoring API Feature](#refactoring-api-feature)
    - [Class Structure](#class-structure)
    - [Introducing what Inside the Constructor](#introducing-what-inside-the-constructor)
    - [Blueprint Analogy: Why a Class](#blueprint-analogy-why-a-class)
    - [Removing page out of range check after refactoring into APIFeatures](#removing-page-out-of-range-check-after-refactoring-into-apifeatures)
21. [Aggregation Pipeline](#aggregation-pipeline)
    - [Use Case in this project](#use-case-in-this-project)
    - [getMonthlyPlan](#getmonthlyplan)
    - [Update the startDates](#update-the-startdates)
    - [res.status(500) ERROR HANDLING in monthly-plan](#resstatus500-error-handling-in-monthly-plan)
    - [Examples of Triggers for This Catch Block](#examples-of-triggers-for-this-catch-block)
22. [Virtual Properties in MongoDB/Mongoose](#virtual-properties-in-mongodbmongoose)
23. [Mongoose Middleware](#mongoose-middleware)
24. [Data Validation](#data-validation)
25. [Errors handling in Express](#errors-handling-in-express)
    - [Operational Errors vs Programming Errors](#operational-errors-vs-programming-errors)
    - [Global Error Handler controllers/errorController](#global-error-handler-controllerserrorcontrollerjs)
    - [Global error handler with production readiness](#global-error-handler-controllerserrorcontrollerjs)
    - [Centralizing Async Error Handling in `server.js`](#centralizing-async-error-handling-in-serverjs)
26. [Authentication - Authorization - Security](#authentication---authorization---security)
    - [Many are missing here](#many-are-missing-here)
    - [Document Middleware](#document-middleware)
    - [Password Reset & Authentication Lifecycle](#password-reset--authentication-lifecycle)
    - [Update Current User Password](#update-current-user-password)
    - [save() VS findByIdAndUpdate](#save-vs-findbyidandupdate)
27. [Modelling Data and Advanced Mongoose](#modelling-data-and-advanced-mongoose)
    - [What is Data Modelling?](#1-what-is-data-modelling)
    - [Real-World Scenario → Unstructured Data](#2-real-world-scenario--unstructured-data)
    - [Structured Data](#3-structured-data)
    - [Relationships in MongoDB](#4-relationships-in-mongodb)
    - [Two main methods to model data in MongoDB](#two-main-methods-to-model-data-in-mongodb)
      - [Embedding (Denormalization)](#embedding-denormalization)
      - [Referencing Types in MongoDB (Normalization)](#referencing-types-in-mongodb)
    - [Types of relationships in MongoDB data modelling](#types-of-relationships-in-mongodb-data-modelling)
    - [MongoDB Data Modelling: Embed vs Reference Framework](#mongodb-data-modelling-embed-vs-reference-framework)
      - [1. Relationship Type](#1-relationship-type)
      - [2. Data Access Patterns](#2-data-access-patterns)
      - [3. Data Closeness](#3-data-closeness)
    - [Many are missing here](#many-are-missing-here)

---

### Recap & Current Development Goals

- **Master the complete modern backend stack**  
  Working with Node.js, Express, MongoDB, and Mongoose to build efficient, scalable web services.

- **Build a production-ready application from scratch**  
  Designing and developing a full-stack app, including a RESTful API and server-rendered frontend (Pug).

- **Develop a powerful RESTful API**  
  Creating modular, structured APIs for tours, users, reviews, and bookings — using middleware, validation, and advanced routing techniques.

- **Implement advanced query features**  
  Enable filtering, sorting, pagination, and field limiting via query strings and Mongoose capabilities.

- **Robust error handling**  
  Centralized error management with custom error classes and Express middleware.

- **Understand Node.js under the hood**  
  Deep-dive into Node's core concepts: event loop, asynchronous/non-blocking I/O, modules, and streams.

- **CRUD operations and advanced Mongoose**  
  Full create, read, update, delete functionality + schema validation, virtuals, and middleware.

- **Work with complex NoSQL data**  
  Including geospatial data, embedded/nested documents, and custom aggregation pipelines.

- **Authentication & Authorization**  
  Secure routes with JWT-based auth, hashed passwords, and user role permissions.

- **Security best practices**  
  Sanitize data, prevent NoSQL injection, XSS, and use rate limiting and secure HTTP headers.

- **Handle file uploads and emails**  
  Add functionality for uploading files (images) and sending transactional emails.

- **Credit card payments with Stripe**  
  Integrate Stripe for secure payment processing.

- **Deploy to production**  
  Deploy the app using Render or similar platforms with secure environment configuration.

---

#### Technologies Used

- **Node.js** – Backend JavaScript runtime
- **Express** – Web framework for routing and middleware
- **MongoDB** & Mongoose – NoSQL database and ODM
- **Pug** – Template engine for server-side rendering
- **Stripe API** – Payment processing (optional)
- **JWT & bcrypt** – Authentication and password hashing
- **Postman** – API testing

---

#### Folder Structure

```markdown
project-root/
├── config/
│ └── db.js
├── controllers/
│ ├── authController.js
│ ├── errorController.js
│ ├── tourController.js
│ └── userController.js
├── dev-data/
│ ├── data/
│ │ ├── reviews.json
│ │ ├── tour5.js
│ │ ├── tours-simple.json
│ │ ├── tours.json
│ │ └── users.json
│ ├── img/
│ │ ├── aarav.jpg
│ │ ├── leo.jpg
│ │ ├── monica.jpg
│ │ ├── new-tour-1.jpg
│ │ ├── new-tour-2.jpg
│ │ ├── new-tour-3.jpg
│ │ └── new-tour-4.jpg
│ └── templates/
│ ├── accountTemplate.pug
│ ├── emailTemplate.pug
│ ├── errorTemplate.pug
│ ├── loginTemplate.pug
│ ├── tourCardTemplate.pug
│ └── tourTemplate.pug
├── middleware/
│ ├── sanitizeHtml.js
│ └── sanitizeQuery.js
├── models/
│ ├── tourModel.js
│ └── userModel.js
├── public/
│ ├── css/
│ │ └── style.css
│ ├── img/
│ │ ├── tours/
│ │ ├── users/
│ │ ├── favicon.png
│ │ ├── icon.svg
│ │ ├── logo-green-round.png
│ │ ├── logo-green-small.png
│ │ ├── logo-green.png
│ │ ├── log-white.png
│ │ └── pin.png
│ ├── overview.html
│ └── tour.html
├── routes/
│ ├── tourRoutes.js
│ └── userRoutes.js
├── utils/
│ ├── apiFeatures.js
│ ├── appError.js
│ └── catchAsync.js
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── app.js
├── config.env
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

To stay aligned with the course content and maximize learning, I am starting the development using **CommonJS module syntax** (`require`, `module.exports`).

#### Why CommonJS for Now?

- **Beginner-Friendly:** Easier to grasp while learning core Node.js concepts like routing, middleware, and MVC structure.
- **Matches the Course:** Staying consistent with the instructor helps avoid unnecessary friction or confusion.
- **Stable Ecosystem Support:** CommonJS is mature and well-supported across the Node.js ecosystem.

#### Developing Plan

My plan is to start developing in the `commonJs` branch, step-by-step with the course. After completing each section, i’ll open a pull request into `main`.

Once the course is complete, we plan to

- Gradually refactor the project into **ES Modules** (`import/export`)
- Update build tools and dependencies as needed
- Modernize the codebase for production-readines
  This approach gives us both a **solid foundation** and a **modern development path**.

---

### What is an API?

---

**API** stands for **Application Programming Interface**.

An API is a piece of software that allows different applications to **communicate with each other**. It defines a set of rules and protocols that one piece of software can use to access the features or data of another.

In web development, when we talk about APIs, we're usually referring to **web APIs**—specifically, APIs that use the **HTTP protocol** to send and receive data between a **client (like a browser or mobile app)** and a **server**.

For example, in this project:

- The `GET /` route returns a JSON message when someone accesses the root URL.
- The `POST /` route simulates how we might accept data from a client.

These routes are examples of **API endpoints**—each one performs a specific task and responds to specific types of requests.

> Simply put: An API is like a waiter in a restaurant. You (the client) tell the waiter what you want (a request), and the waiter brings it from the kitchen (the server) to you (the response).

---

#### POST `/` Route

---

This route handles **HTTP POST requests** to the root URL (`/`):

```js
app.post('/', (req, res) => {
  res.send('Sending msg using post method endpoint...');
});
```

---

[Back to the top](#natours-2025)

---

### REST Architecture and CRUD Operations

---

#### What is REST?

**REST** stands for **Representational State Transfer**.  
It is a software architectural style used for building **web services and APIs**. REST relies on **standard HTTP methods** to enable communication between clients (like browsers, mobile apps) and servers.

RESTful APIs are:

- Stateless: each request is independent and self-contained
- Resource-based: data is treated as resources (like users, tours, products)
- Accessible via standard HTTP methods

---

### CRUD Operations in REST

---

REST uses HTTP methods to implement **CRUD operations**:

| Operation | Description             | HTTP Method      | Example Endpoint           |
| --------- | ----------------------- | ---------------- | -------------------------- |
| Create    | Add a new resource      | `POST`           | `POST /api/v1/tours`       |
| Read      | Retrieve one or many    | `GET`            | `GET /api/v1/tours`        |
| Read      | Retrieve a single item  | `GET`            | `GET /api/v1/tours/:id`    |
| Update    | Modify an existing item | `PATCH` or `PUT` | `PATCH /api/v1/tours/:id`  |
| Delete    | Remove a resource       | `DELETE`         | `DELETE /api/v1/tours/:id` |

---

#### Resources in REST

---

A **resource** is any piece of data the API manages:

- `/users` → users resource
- `/tours` → tours resource
- `/bookings` → bookings resource

Resources are usually returned in **JSON format**, and identified by **URLs** (called _endpoints_).

---

**Example: Tour API**

If i were building a tour-related REST API, with **HTTP Methods**. **POST-GET-PUT-PATCH-DELETE**

- `POST /api/v1/tours` → Add a new tour **C**reate
- `GET /api/v1/tours` → Get all tours **R**ead
- `GET /api/v1/tours/:id` → Get a specific tour READ:id
- `PUT /api/v1/tours` → **U**pdate a tour
- `PATCH /api/v1/tours/:id` → Update a tour
- `DELETE /api/v1/tours/:id` → **D**elete a tour

**CRUD** Operations!

---

#### REST Best Practices

---

- Use **nouns**, not verbs, in endpoints: `/users`, not `/getUsers`
- Use **plural names** for resources: `/tours`, not `/tour`
- Keep APIs **stateless**: No user sessions should be stored on the server
- Return proper **HTTP status codes** (e.g., 200 OK, 404 Not Found, 201 Created)

---

**REST** makes it easy to build scalable, predictable APIs that follow standard web conventions.

**JSON data format is usually used for both side the server <--> the client**

---

#### What is JSON?

---

**JSON** stands for **JavaScript Object Notation**.

It is a lightweight, human-readable format used to **store and exchange data** especially between a **client** and a **server**.

In REST APIs, JSON is the most common format for:

- Sending data from the client to the server (e.g. via POST)
- Receiving data from the server (e.g. via GET)

---

#### JSON Structure:

---

- JSON looks like a **JavaScript object**.
- Data is organized in **key-value pairs**.
- **Strings must use double quotes ("")**, not single quotes.
- JSON supports values like:
  - Strings
  - Numbers
  - Booleans (`true`, `false`)
  - `null`
  - **Arrays** (lists)
  - **Objects** (nested structures)

**Example `JSON` with an Array:**

```json
{
  "id": "0",
  "name": "Natours",
  "tourName": "The Park Camper",
  "rating": 4.8,
  "guides": [
    {
      "name": "John Doe",
      "role": "Lead Guide"
    },
    {
      "name": "Jane Doe",
      "role": "Guide"
    }
  ],
  "location": "Worldwide"
}
```

---

#### What about JSend?

---

**JSend** is a convention for formatting `JSON` responses in a clean, predictable structure. It helps clients understand what happened — whether the request was successful, failed, or errored.

---

#### Basic JSend Structure:

---

```json
// On success
{
"status": "success",
"data": { ... }
}

// On failure (e.g., invalid input)
{
"status": "fail",
"data": { ... }
}

// On error (e.g., server crashed)
{
"status": "error",
"message": "Something went wrong."
}

```

**Example using tour data (Success response)**

```json
{
  "status": "success",
  "data": {
    "tour": {
      "id": "0",
      "name": "Natours",
      "tourName": "The Park Camper",
      "rating": 4.8,
      "location": "Worldwide",
      "guides": [
        {
          "name": "John Doe",
          "role": "Lead Guide"
        },
        {
          "name": "Jane Doe",
          "role": "Guide"
        }
      ]
    }
  }
}
```

---

#### Why Use JSend?

---

- Encourages consistency across endpoints

- Makes error handling easier on the frontend

- Separates transport logic (status, message) from business data

---

### Stateless RESTful APIs

---

One of the **core principles of REST** is that it must be **stateless**.

---

#### What Does "Stateless" Mean?

---

In a **stateless API**, the **server does not store any information** about the client's previous requests.  
Each request is **independent** and must contain **all the information** the server needs to understand and respond.

> The server does **not remember** who you are between requests.

---

#### What It Looks Like:

---

For example:

- If a client sends a request to `GET /api/v1/tours`, it must include **everything** the server needs (like authentication, filters, etc.).
- The server processes it and sends a response, but **does not store any session data**.

---

#### Why Stateless?

---

- **Scalability**: Easier to scale horizontally (across multiple servers)
- **Reliability**: Each request can be retried without depending on past state
- **Security**: Less risk of leaking session data

---

**Example:**

Clients often send authentication info (like a token) **with every request** instead of logging in once and keeping a session.

```http
GET /api/v1/users
Authorization: Bearer <token>
```

---

### IMPORTANT!

---

#### A stateless RESTful API:

---

- **Does not track sessions or history**

- **Treats every request as a brand new interaction**

- **Requires clients to be self-contained in every call**

---

[Back to the top](#natours-2025)

---

### MVC: Model – View – Controller

It’s a design pattern used to organize your code, especially in server-side apps like those built with Node.js and Express.

---

#### What Each Part Does:

---

| Component      | Purpose                                                                                                               | Example in this project                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Model**      | Handles **data and business logic** (e.g., reading/writing to JSON or a database)                                     | when the project moves from `tours-simple.json` to MongoDB or another DB                          |
| **View**       | Handles **UI** (what the user sees)                                                                                   | It is usually not used in current API-only setup, but would be used if the project had HTML pages |
| **Controller** | Handles **requests and responses** — all the logic to process input, interact with the model, and return the response | For example: `getAllTours`, `createTour`, etc. functions are **controllers**                      |

---

Typical **MVC-style flow** (Model–View–Controller)

```scss
Client (Postman/browser)
   ↓
Express Route (app.js → tourRoutes.js)
   ↓
Controller (tourController.js)
   ↓
Model (tourModel.js → MongoDB via Mongoose)
```

---

#### (API-only project):

---

It is often called a **"RESTful API (MVC-light)"** — where **V (View)** is not needed, and you mainly have:

- **Model** – (you’ll use this when working with MongoDB later)

- **Controller** – (you already started separating route logic into controller functions!)

- **Route** – (defines the endpoint + method, e.g., `GET /api/v1/tours`)

```pgsql
project/
├── controllers/
│   └── tourController.js     ← logic (controllers)
├── routes/
│   └── tourRoutes.js         ← routes definitions
├── models/
│   └── tourModel.js          ← data logic (MongoDB/Mongoose)
├── app.js                    ← sets up server, middleware, routes
└── server.js                 ← starts the server
```

---

### The Request–Response Cycle in Express

---

In **Express** (and web development in general), the **request–response cycle** is the **fundamental** flow of how **data moves between a client** (like a browser or app) and the server (**Node.js/Express app**).

1. **Client Sends a Request**

- The client sends an **HTTP request** (e.g. `GET /api/v1/tours`)
- This request contains:
  - The **HTTP method** (GET, POST, etc.)
  - A **URL**
  - Optional data (like query parameters, body data)

2. **Express Matches a Route**

- Express checks your route definitions (e.g. `app.get(...)`) to find a match.
- If matched, Express runs the appropriate **route handler** (a function).

3. **Middleware and Processing**

- Any **middleware functions** (e.g. `express.json()`, custom logging, auth) run before the route handler.
- The handler processes the request, fetches or manipulates data, etc.

4. **Server Sends a Response**

- The handler sends back a response using `res`:
  - A **status code** (e.g. 200 OK, 404 Not Found)
  - A **JSON** object or other content

- The connection ends.

---

#### Express Middleware Flow

---

When a request comes in, Express processes it through a chain of middleware functions before sending a response:

The **client makes a request**, Express **handles and processes it**, and the **server responds**.

```yaml
Client Request
↓
[ Middleware 1 ] — next() →
↓
[ Middleware 2 ] — next() →
↓
[ Middleware 3 ] — next() →
↓
[ Final Middleware (sends response with res.send/res.json) ]
↓
Client Response

Each middleware can:

- Modify the `req` and `res` objects
- End the request–response cycle (using `res.send()`, `res.json()`, etc.)
- Or call `next()` to pass control to the next middleware in the stack
```

**Example:**

```js
app.use((req, res, next) => {
  console.log('Middleware 1');
  req.requestTime = Date.now();
  next();
});

app.use((req, res, next) => {
  console.log('Middleware 2');
  next();
});

app.get('/', (req, res) => {
  res.send(`Hello! Request received at: ${req.requestTime}`);
});
```

---

#### Using Morgan in Development

---

As a HTTP request logger middleware for Node.js and Express. It logs details of incoming requests in a readable format, which is especially useful during development.

**Morgan shows:**

- HTTP method and URL
- Status code (color-coded)
- Response time
- Response size in bytes
- Helps track incoming requests
- Debugs which routes are hit and how long they take
- Confirms status codes sent (e.g. 200 OK, 404 Not Found)

```bash
GET /api/v1/tours 200 2.275 ms - 9277
{ id: '11' }
GET /api/v1/tours/11 200 0.982 ms - 208
{ id: '111' }
GET /api/v1/tours/111 404 0.628 ms - 46
{ id: '7' }
GET /api/v1/tours/7 200 0.569 ms - 885
```

**Use environment variables to switch modes:**

```bash
NODE_ENV=development nodemon app.js
```

```js
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

**More details!**
[`Package: morgan`](https://www.npmjs.com/package/morgan)
[`expressjs/morgan`](https://github.com/expressjs/morgan)

---

[Back to the top](#natours-2025)

---

### Param Middleware in Express**Example Error Response:**

---

Param middleware is a special type of middleware in Express that **runs automatically whenever a specific route URL parameter is present** (like `:id`).

It allows you to:

- Run validation logic

- Preprocess parameters (e.g., lookup resources, format data)

- Abort early if the param is invalid

- Attach useful data to req for later middleware or route handlers

**Syntax**

```js
app.param('paramName', callback);
```

**Example paramName = `id`**

**1. param in middleware**

```js
// It runs whenever a route with `:id` is matched
router.param('id', (req, res, next, val) => {
  console.log(`Tour ID received: ${val}`);

  // Example: basic numeric validation
  if (!Number.isInteger(+val)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID format',
    });
  }

  next();
});

// After next, any routes with trigger it:
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
```

**It usually happens in route file (e.g. `routes/tourRoutes.js`) just after defining `router`:**

```js
const router = express.Router();

// Param middleware must be added before routes that use :id
router.param('id', (req, res, next, val) => {
  console.log(`Param Middleware: ID = ${val}`);
  next();
});
```

**REASON**

- **DRY** principle: avoid repeating validation in every route handler

- **Centralized** logic for parameter processing

- **Improves readability** and structure

---

#### Additions (For Learning & Scaling):

---

**1. Validate the ID**

To make the param middleware more useful, you could validate that id is a number or even pre-fetch tour data:

```js
router.param('id', (req, res, next, val) => {
  if (!/^\d+$/.test(val)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID format',
    });
  }

  console.log(`Param Middleware tour:ID is: ${val}`);
  next();
});
```

**2. Attach data** to `req` (optional pattern for preloading)

In more advanced APIs, you can preload data and attach it to `req`:

```js
router.param('id', (req, res, next, val) => {
  const id = +val;
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  req.tour = tour; // Attach tour object to req
  next();
});
```

Then in `getTour`, you can use `req.tour` instead of searching again.

---

### Param Middleware for ID Validation

---

To **avoid repeating** with **DRY Method**

`if (!tour)` in every route handler, ID can be extract and check into a **custom param middleware** called `checkID`.

In `tourController.js`:

```js
exports.checkID = (req, res, next, val) => {
  const id = val * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};
```

Then register router.param('paramName', callback) to, in this case, `tourRouters.js`

```js
router.param('id', tourController.checkID);
```

[Back to the top](#natours-2025)

---

### Serving static files in Express

---

#### `express.static()`

[`express.static`](https://expressjs.com/en/starter/static-files.html) is built-in middleware function in Express to serve static files like:

- HTML (e.g. overview.html, tour.html)
- CSS
- JavaScript (frontend)
- Images
- Fonts

**The function signature is:**

```js
express.static(root, [options]);
```

The root argument specifies the root directory from which to serve static assets. For more information on the options argument.

For example in this project:

```js
app.use(express.static(`${__dirname}/public`));
```

Now, you can load the files that are in the public directory, which is in root `__dirname`

Or,

```js
app.use(express.static('public'));
```

```bash
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```

This works without writing custom routes for each file — Express handles it for you automatically! see [express.static](https://expressjs.com/en/starter/static-files.html)

---

### Mongoose Query Methods

---

Mongoose provides powerful query methods to interact with MongoDB documents. Some common examples include:

- `Model.find()`
- `Model.findById()`
- `Model.findOne()`
- `Model.findByIdAndUpdate()`
- `Model.findByIdAndDelete()`

These methods allow you to perform CRUD operations efficiently and are commonly used in controllers.

These methods are async and return query objects you can chain with additional helpers like `sort()`, `limit()`, and `select()`.

---

#### Chaining Queries

---

**example:**

```js
// Get top 5 cheapest tours
const topCheapTours = await Tour.find()
  .sort('price') // Sort by ascending price
  .limit(5) // Only return 5 documents
  .select('name price rating'); // Return only these fields

console.log(topCheapTours);
```

---

#### Creating Documents with Mongoose

---

**Core concept in JavaScript and Mongoose**
The fundamentals of how it breaks down and how it's related to JavaScript and Mongoose query methods:

```js
// This approach (Instantiate and Save Manually) reflects core JavaScript OOP principles (like creating an instance of a class).
// It gives a full control over the document before saving.
const newTour = new Tour(req.body);
await newTour.save();

// Shorthand using Model.create()
// This is syntactic sugar for creating and saving in one line.
// It's clean, concise, and recommended for most use cases.
const newTour = await Tour.create(req.body);
```

**NOTE:**

1. **JavaScript Object Instantiation**

- `new Tour(req.body)` is creating a new instance of the `Tour` model (like instantiating a class in JS).

- It's a good way to understand object-oriented programming in JS and how models in Mongoose map to documents in MongoDB.

2. **Method Chaining and Async**

- `.save()` is a method available on a document instance. It returns a Promise, which is why you're using await.
- `Tour.create()` is a shortcut that combines both `new Tour()` and `.save()` internally. It’s cleaner and more concise.

3. **Mongoose Abstraction Layer**

- Mongoose abstracts the low-level MongoDB driver calls (like `db.collection.insertOne(...)`) into these high-level, chainable, JavaScript-friendly methods.

```js
/**
 * Two ways to create and save a Mongoose document:
 *
 * 1. Manual: Instantiate and then save
 *    const newTour = new Tour(req.body);
 *    await newTour.save();
 *
 * 2. Shortcut: .create() does both in one step
 *    const newTour = await Tour.create(req.body);
 *
 * Both return the saved document.
 * Are asynchronous and should be awaited.
 * Will trigger schema validation before writing to MongoDB.
 */
```

**Learn more:** [Mongoose Query Documentation](https://mongoosejs.com/docs/queries.html)
[Back to the top](#natours-2025)

---

### Dynamic Filtering with `queryObj`

---

In the `getAllTours` controller, implementing **dynamic filtering** based on the query parameters provided by the user via the URL. This allows for a flexible API that users can customize.

**example:**

```bash
GET /api/v1/tours?duration=5&difficulty=easy
```

---

#### The flow of dynamic filtering

---

Clone the request query object with spread opt:

```js
const queryObj = { ...req.query };
```

This creates a **shallow copy** of the query so we can manipulate it without affecting the original `req.query`.

Next, Define fields by destructuring the obj to variable(excludeFields) to exclude **not used for filtering**, such as pagination or sorting:

```js
const excludeFields = ['page', 'sort', 'limit', 'fields'];
```

Then remove those fields from the `queryObj`:

```js
excludeFields.forEach((el) => delete queryObj[el]);
```

Finally, pass the cleaned `queryObj` into the Mongoose `find()` method:

```js
const tours = await Tour.find(queryObj);
```

This ensures only the relevant fields (like `difficulty` or `duration`) are used to query the database.

---

**Example**

**Request:**

```bash
GET /api/v1/tours?difficulty=easy&page=2&sort=1&limit=10
```

**Logs:**

```js
req.query: {
  difficulty: 'easy',
  page: '2',
  sort: '1',
  limit: '10'
}

queryObj: {
  difficulty: 'easy'
}
```

Only `difficulty` is used for filtering, while `page`, `sort`, and `limit` are handled by other features in the pipeline (like pagination and sorting).

---

**What it does!**

This pattern ensures:

- Clean and secure database queries
- Better separation of concerns between filtering and other query features
- More control over how users can interact with the API

**Importantly it lays the foundation for additional features later.**

---

#### Advanced Filtering:

---

MongoDB uses comparison operators like $gte, $lte, $lt, $gt. These aren’t supported in URL parameters by default.
**URL request** **URL**-friendly-\*\*syntax must be implemented to validate MongoDB queries!

```bash
GET /api/v1/tours?duration[gte]=5&price[lt]=1500
```

```js
let queryStr = JSON.stringify(queryObj);
queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
const advancedFilter = JSON.parse(queryStr);
const query = Tour.find(advancedFilter);
// EXECUTE
const tours = await query;
```

**basically**

- Use `let` to allow chaining methods
- Convert queryObj to a JSON string
- Replace **MongoDB operators** (`gte`, `gt`, `lte`, `lt`) with `$prefix` (e.g., `$gte`)
- Parse Obj back into query

---

#### Sorting

---

- Sorting
- Pagination
- Field limiting

Sorting by one or more fields:

```bash
GET /api/v1/tours?sort=price
GET /api/v1/tours?sort=price,ratingsAverage
GET /api/v1/tours?sort=-ratingsAverage,-price
```

```js
if (req.query.sort) {
  // Support multi-field sorting: ?sort=price,ratingsAverage
  const sortBy = req.query.sort.split(',').join(' ');
  console.log('Sorting by:', sortBy);
  query = query.sort(sortBy);
}
```

- `sort=price`: Sorts by price ascending.
- `sort=-price`: Sorts by price descending.
- `sort=price,ratingsAverage`: Sorts by price first, then by ratings (if price is equal).
- `sort=-ratingsAverage,-price`: Prioritizes highest-rated and most expensive tours.

**example**

```bash
GET /api/v1/tours?duration[gte]=5&difficulty=easy&sort=-ratingsAverage,price
```

- Filter for tours with duration >= 5 and difficulty=easy
- Sort them by highest ratingsAverage, then lowest price

**sorting default to the date of the document created**

If the user does **not** provide a `?sort=` parameter in the request, the API automatically applies a default sort order:

- If the user sends ?sort=price,ratingAverage, it sorts by both.
- If no sort parameter is provided, it defaults to createdAt (latest first).

```js
if (req.query.sort) {
  // Support multi-field sorting from query string(queryStr): ?sort=price,ratingsAverage
  const sortBy = req.query.sort.split(',').join(' ');
  console.log('Sorting by:', sortBy);
  query = query.sort(sortBy);
} else {
  // set default to the time document were created in DESC order
  query = query.sort('-createdAt');
}
```

It ensures the newest tours (or documents) are returned first.

- `GET /api/v1/tours?sort=price` → Sort by price ascending
- `GET /api/v1/tours?sort=-ratingsAverage,-price` → Highest rated & most expensive
- `GET /api/v1/tours` → Defaults to `createdAt` (most recent documents first)

**This modular query system allows:**

- Cleaner, safer, and more flexible MongoDB queries
- Separation of concerns between filtering, sorting, and pagination
- A professional, enterprise-ready API design

[Back to the top](#natours-2025)

---

#### FIELD LIMITING

---

Field Limiting — also known as "selecting specific fields" — a useful feature for optimizing the API responses.

```js
if (req.query.fields) {
  // Converts comma-separated fields to space-separated for Mongoose .select()
  const fields = req.query.fields.split(',').join(' ');
  query = query.select(fields);
} else {
  // By default, exclude the internal version key
  query = query.select('-__v');
}
```

- `Tour.find().select('name price')` → returns only `name` and price
- `Tour.find().select('-__v')` → excludes the `__v` field (which Mongoose adds by default)

**Test example**

```bash
GET /api/v1/tours?fields=name,price,duration
```

**Respond example**

```json
[
  {
    "name": "The Forest Hiker",
    "price": 297,
    "duration": 5
  }
  // The rest of the document
]
```

**IT:**

- Allows client-side customization of responses
- Reduces payload size[Back to the top](#natours-2025)

- Prevents exposing sensitive fields (like passwords, internal fields)

**NOTE:**
**Exclude fields permanently (e.g., `password` or `createdAt`), use `.select: false` in your Mongoose schema:**

```js
password: {
  type: String,
  required: true,
  select: false, // Will never be returned in query results
}
```

| Feature         | Method Used         | Example                       |
| --------------- | ------------------- | ----------------------------- |
| Field limiting  | `.select()`         | `?fields=name,duration,price` |
| Field exclusion | `.select('-field')` | `?fields=-__v`                |

**Learn more:** [Mongoose Schema](<https://mongoosejs.com/docs/api/schema.html#Schema()>)

**Better sorting**

[Back to the top](#natours-2025)

---

### Pagination with Mongoose in NodeJs

---

Pagination is the process of dividing content into discrete pages, primarily used to improve user experience when dealing with large (**data in chunks (pages)**) amounts of information. It allows for organized presentation and easier navigation, especially useful for improving **performance** and **user experience** when dealing with large datasets.websites and APIs.

\*It does\*\*

- Prevent sending all data at once (which can crash mobile apps or slow pages)
- Give users control over how much they see
- Help with infinite scroll or paginated tables

**Logic**

```js
//  * 1 = convert a str to number
const page = req.query.page * 1 || 1; // Get page number, default is 1
const limit = req.query.limit * 1 || 100; // Get items per page, default is 100
const skip = (page - 1) * limit; // Calculate how many documents to skip

// page=3&limit=10, 1-10 page 1, 11-20 page 2, = 3 21-30 page
query = query.skip(skip).limit(limit); // Apply pagination to the query
console.log('Pagination:', { page, limit, skip });
```

- **NOTE:**

- skip() tells MongoDB how many documents to ignore
- limit() tells MongoDB how many to return
- Make sure to cast req.query.page and req.query.limit to numbers

`URL req;`

```bash
GET /api/v1/tours?page=2&limit=3
```

`returned:`

```bash
Raw query: { limit: '3', page: '3' }
Pagination: { page: 3, limit: 3, skip: 6 }
```

- `page = 3`
- `limit = 3`
- `skip = (3 - 1) \* 3 = 6`

| Step                       | Explanation                                                                |       |                                                                  |
| -------------------------- | -------------------------------------------------------------------------- | ----- | ---------------------------------------------------------------- |
| \`page \* 1                |                                                                            | 1\`   | Converts the `page` query string to a number; default is `1`.    |
| \`limit \* 1               |                                                                            | 100\` | Converts the `limit` query string to a number; default is `100`. |
| `skip = (page-1)*limit`    | Calculates how many results to skip for the current page.                  |       |                                                                  |
| `.skip(skip).limit(limit)` | Modifies the Mongoose query to only return results for that page.          |       |                                                                  |
| Error Handling             | If the `skip` value is too large (beyond the dataset), return a 404 error. |       |                                                                  |

---

#### Testing Pagination

---

| URL Request                    | Description                              |
| ------------------------------ | ---------------------------------------- |
| `/api/v1/tours?page=1&limit=3` | Returns the first 3 tours                |
| `/api/v1/tours?page=2&limit=3` | Returns the next 3 tours                 |
| `/api/v1/tours?page=3&limit=3` | Returns the last 3 tours                 |
| `/api/v1/tours?page=4&limit=3` | ❌ Returns 404 error — page out of range |

---

**Example Success Response:**

```js
{
  "status": "success",
  "results": 3,
  "data": {
    "tours": [ ... ]
  }
}
```

[Back to the top](#natours-2025)

**Example Error Response:**

```js
{
  "status": "fail",
  "message": "This page does not exist"
}

```

**Summary**
| Query Param | Meaning | Example |
| ----------- | --------------------- | -------------------- |
| `page` | Which page to fetch | `?page=2` |
| `limit` | Results per page | `?limit=5` |
| `skip` | Calculated internally | `(page - 1) * limit` |

**NOTE**

- If no page or limit is specified, default is page 1 with 100 results.
- This logic does not crash the server on invalid requests — instead it returns a controlled error response.
- Always pair pagination with sort (e.g. ?sort=createdAt) for consistent ordering.

[Pagination-stack-overflow](https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js)

---

#### Route aliasing pattern

---

**FEATURE** `/top-5-cheap`

routes/tourRoutes.js

```js
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
```

pre-fields middleware to manipulate the incoming queryObj as default query before it hits the controller

```js
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
```

Then call `GET /api/v1/tours/top-5-cheap`:

**Feature:**

- Will hit the route.
- Trigger the aliasTopTours middleware:
- Sets `req.query.limit` to `'5'`
- Sets `req.query.sort` to `-ratingsAverage,price`
- Sets `req.query.fields` to show only selected fields
- Pass `req to getAllTours`, which will process it just like a regular `GET /tours` request but with those query defaults applied.

---

### Refactoring API Feature

---

As API grows with more filtering, sorting, field limiting, and pagination—it becomes harder to maintain these features inside `getAllTours` controller. To make the code more modular and reusable, **refactoring these query features into a dedicated utility class**: `APIFeatures`.

This follows the principle of **separation of concerns**, keeping controller focused on handling requests and responses, while the query logic is abstracted away.

---

##### Refactoring controller

---

Any controller is likely bloated with filtering, sorting, field limiting, and pagination logic all in one place. By refactoring into a class (`APIFeature`). It creates architectural upgrade to improves readability, reusability, and separation of concerns in `tourControllers.js`to stay clean and keep **focusing on logic**, not technical query building.

- Keeps tourController.js clean and focused.
- Makes it easy to reuse query features across different resources (e.g., Tours, Users, Reviews).
- Adds a clear structure for chaining query methods.

**Refactored `tourController.js`**:

```js
exports.getAllTours = async (req, res) => {
  try {
    // 1) Build the query
    // With this pattern, any new resource (e.g., Reviews, Users) can instantly gain rich query features
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // 2) Execute the query
    const tours = await features.query;

    // 3) Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
```

---

#### Class Structure

---

**New class APIFeatures in `utils/APIFeature.js`**:

```js
class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // Express req.query
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering: convert operators to MongoDB syntax
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const advancedFilter = JSON.parse(queryStr);

    // Optional for more transparent and readable: explicitly name the parsed filter
    console.log('Parsed filter:', advancedFilter);

    this.query = this.query.find(advancedFilter);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
```

| Feature         | Example Query Param                        | Description                                       |
| --------------- | ------------------------------------------ | ------------------------------------------------- |
| Filtering       | `/api/v1/tours?duration=5`                 | Filters results by fields in the schema           |
| Advanced Filter | `/api/v1/tours?price[gte]=500`             | MongoDB-style filters with operators              |
| Sorting         | `/api/v1/tours?sort=price,-ratingsAverage` | Sort by one or more fields (ascending/descending) |
| Field Limiting  | `/api/v1/tours?fields=name,price`          | Select only specific fields                       |
| Pagination      | `/api/v1/tours?page=2&limit=10`            | Skip and limit results for pagination             |

- Makes unit testing easier.

---

#### Introducing what Inside the Constructor:

---

**example**: constructor inside our `APIFeatures` class.
In object-oriented programming, a constructor is a special method used for creating and initializing objects based on a class.

```js
constructor(query, queryString) {
  this.query = query; // The Mongoose query object
  this.queryString = queryString; // Express request query (req.query)
}
```

- `query` is the actual Mongoose query (e.g., `Tour.find()`), which we will chain and modify (e.g., add sorting, pagination, etc.).
- `queryString` is the raw object from the incoming request URL (like `req.query`), containing things like `?sort=price&limit=5`.

By assigning them to `this.query` and `this.queryString`, we can use them across all methods inside the class (e.g., `.filter()`, `.sort()`, etc.)—because `this` refers to the current instance of the class.

---

#### Blueprint Analogy: Why a Class

---

Think of the `APIFeatures` class as a blueprint or recipe for building enhanced queries. Just like a blueprint can build multiple houses, this class can create multiple customized query pipelines for any resource (Tours, Users, Reviews...).

That means every time instance is created with:

```js
new APIFeatures(Tour.find(), req.query);
```

A new customizable query engine, tailored to the request’s parameters. Then chaining methods begins `new`:

```js
.filter()
.sort()
.limitFields()
.paginate();
```

Each method modifies the original `this.query`, and at the end, it is **executed** it with:

```js
const tours = await features.query;
```

---

**Summery**
| Concept | Role in `APIFeatures` |
| -------------- | --------------------------------------------------------- |
| `constructor` | Initializes and stores the base query and parameters |
| `this.query` | A Mongoose query that gets modified by each method |
| Blueprint idea | Enables reuse of filtering/sorting logic across resources |

[Back to the top](#natours-2025)

---

#### Removing “page out of range” check after refactoring into `APIFeatures`

In the original implementation (before the class), in `getAllTours` controller "STEP 4: `PAGINATION`"
ERROR handler `status(404)` explicitly checked after building the query whether the page requested goes beyond the available data:

```js
// Handle case when page is out of range
if (req.query.page) {
  const numTours = await Tour.countDocuments();
  if (skip >= numTours) {
    return res.status(404).json({
      status: 'fail',
      message: 'This page does not exist',
    });
  }
}
```

**However, it is not included in `APIFeatures.paginate()`**

**REASONS**

1. **Separation of Concerns**
   `APIFeatures` class: Encapsulates, chains query logic and class is designed to **build and manipulate a query**. Its role is to:

- Filter
- Sort
- Limit fields
- Paginate

- It **does not execute** the query (await query) or send a response.
- Checking if the page is out of range requires executing this line:

**NOTE**:

```js
await Tour.countDocuments();
```

IS **asynchronous**, `paginate()` method in `APIFeatures` is a **synchronous chainable method**. **Injecting an await would break the flow** or require major redesign (like making all methods async and awaiting each one).

2. **Mongoose Handles It Gracefully**

Requesting a page that's out of range (e.g., page 1000 when there are only 10 results), the `query.skip(skip).limit(limit)` will simply return an empty array. It’s not an error — it’s just “no results on this page.”

**strict 404 VS silent empty**

Some developers **prefer** this silent behavior over throwing a 404. In fact, most APIs (like GitHub, Stripe, etc.)

```sass
❌ No 404 for empty pages — just return results: 0.
```

However, If API contract demands it (e.g., The API must return a 404 when out of range)
A solution (optional) by implementing **after executing the query** in controller, which keep the separation of concerns **and** add the validation after the query runs.

```js
// Execute the query
const tours = await features.query;

if (tours.length === 0 && req.query.page) {
  const numTours = await Tour.countDocuments();
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  if (skip >= numTours) {
    return res.status(404).json({
      status: 'fail',
      message: 'This page does not exist',
    });
  }
```

| Reason                             | Explanation                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| Separation of Concerns             | `APIFeatures` shouldn't be responsible for sending HTTP responses or running async logic. |
| Design Simplicity                  | Keep `paginate()` fast, chainable, and free of database hits.                             |
| Mongoose Handles It                | Empty arrays are not errors — many APIs prefer it that way.                               |
| CHECK _can_ be added in controller | Optional, based on your design goal (strict 404 vs silent empty).                         |

---

### Aggregation Pipeline

---

Aggregation pipeline can be seen as a series of processing stages where each stage transforms the documents and passes the result to the next stage.

Each stage is an object that performs a specific operation. It's like a conveyor belt: documents go in one end, get filtered, shaped, grouped, and transformed, then come out the other end.

- Group values from multiple documents together.
- Perform operations on the grouped data to return a single result.
- Analyze data changes over tim

[Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)

**1. `$match` — Filter documents - "match stage"**

This stage filters documents, similar to a `find()` query. It’s usually used early in the pipeline to narrow down the documents you're working with.

**Example**

Filtering tours to only those with a `ratingsAverage` of 4.5 or higher.

```js
{
  $match: {
    ratingsAverage: {
      $gte: 4.5;
    }
  }
}
```

**2. `$group` — Group and calculate stats - "group stage"**

This stage groups documents by a specified field and can perform aggregations like sum, avg, min, max, etc.

**Example**

Grouping the tours by their difficulty (`easy`, `medium`, `difficult`) and calculate stats for each group.

```js
{
  $group: {
    _id: '$difficulty', // group by difficulty
    numTours: { $sum: 1 }, // count tours per group
    avgRating: { $avg: '$ratingsAverage' },
    avgPrice: { $avg: '$price' },
    minPrice: { $min: '$price' },
    maxPrice: { $max: '$price' }
  }
}
```

**Eventually, adding them together with `.aggregate`**

```js
Tour.aggregate([
  {
    $match: { ratingsAverage: { $gte: 4.5 } },
  },
  {
    $group: {
      _id: '$difficulty',
      numTours: { $sum: 1 },
      avgRating: { $avg: '$ratingsAverage' },
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxPrice: { $max: '$price' },
    },
  },
]);
```

At the end of this pipeline:

1.  Filters tours with high ratings
2.  Groups by difficulty
3.  Calculates meaningful stats for each difficulty level

##### Use Case in this project

```js
GET / api / v1 / tours / tour - stats;
```

```js
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
```

[Back to the top](#natours-2025)

**Test URI `getTourStats`**

`GET`;

```js
http://127.0.0.1:3000/api/v1/tours/tour-stats
```

**OR switching between total and grouped stats with a query param**

`GET`

```js
http://127.0.0.1:3000/api/v1/tours/tour-stats?group=none
```

**result**

```js
{
    "status": "success",
    "data": {
        "stats": [
            {
                "_id": "easy",
                "numTours": 4,
                "avgRating": 4.675,
                "avgPrice": 1272,
                "minPrice": 397,
                "maxPrice": 1997
            },
            {
                "_id": "difficult",
                "numTours": 2,
                "avgRating": 4.6,
                "avgPrice": 1997,
                "minPrice": 997,
                "maxPrice": 2997
            },
            {
                "_id": "medium",
                "numTours": 3,
                "avgRating": 4.8,
                "avgPrice": 1664.3333333333333,
                "minPrice": 497,
                "maxPrice": 2997
            }
        ]
    }
}
```

**Or toggle `\_id` between `null and` `'$difficulty'`**

1. With `_id: null`
   This is expected when you group **all documents together** — to get just one aggregated result for all tours.

```js
{
  $group: {
    _id: null,
    numTours: { $sum: 1 },
    ...
  }
}

```

2. With `_id: '$difficulty'`
   This groups the documents by **difficulty** (`easy`, `medium`, `difficult`) and applies the same stats per group — works as designed.

```js
{
  $group: {
    _id: '$difficulty',
    ...
  }
}

```

Updating documents with an aggregation pipeline using the stages shown in [MongoDB - Aggregation Pipeline](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/)

---

##### `getMonthlyPlan`

Using aggregation pipeline on the `startDates` field (which is an array), and calculate:

- How many tours start per month
- Names of those tours
- filter by year

**Current data**

```json
"startDates": [
  "2021-03-23T09:00:00.000Z",
  "2021-10-25T08:00:00.000Z",
  "2022-01-30T09:00:00.000Z"
]
```

##### Update the startDates!

**One-liner update script** to run in a Node.js script, MongoDB shell, or Mongoose context to update all `startDates` in all tour documents to future years

**MongoDB Shell or Compass (aggregation-aware tools):**

```js
db.tours.updateMany({}, [
  {
    $set: {
      startDates: {
        $map: {
          input: '$startDates',
          as: 'date',
          in: {
            $dateFromParts: {
              year: 2025, // current year(2025)
              month: { $month: '$$date' },
              day: { $dayOfMonth: '$$date' },
              hour: { $hour: '$$date' },
              minute: { $minute: '$$date' },
              second: { $second: '$$date' },
            },
          },
        },
      },
    },
  },
]);
```

**🛑**

- Loops through each startDates array
- Keeps the same month, day, and time
- Updates the year to the current (now year2025) for all

**Mongoose (Node.js):**

```js
await Tour.updateMany({}, [
  {
    $set: {
      startDates: {
        $map: {
          input: '$startDates',
          as: 'date',
          in: {
            $dateFromParts: {
              year: 2025, // current year(2025)
              month: { $month: '$$date' },
              day: { $dayOfMonth: '$$date' },
              hour: { $hour: '$$date' },
              minute: { $minute: '$$date' },
              second: { $second: '$$date' },
            },
          },
        },
      },
    },
  },
]);
```

[Update Aggregation Pipeline](https://www.mongodb.com/docs/manual/tutorial/update-documents-with-aggregation-pipeline/#std-label-updates-agg-pipeline)

**Implement `routes/tourRoutes.js`**

```js
router
  // additional URL params(/:year) to filter by year
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);
```

**Start getting your hand dirty building the `getMonthlyPlan` Logic**

Have Fun 😄

[Back to the top](#natours-2025)

---

##### `res.status(500)` ERROR HANDLING in monthly-plan

---

```js
catch (err) {

  console.error('Error in getMonthlyPlan:', err);

  res.status(500).json({
    status: 'error',
    message: err.message,
  });
}
```

`500` is the HTTP status code for **Internal Server Error**, which means something unexpected happened on the **server side**

**It could be:**

- There’s an unhandled exception in your code.
- MongoDB throws an error (e.g., invalid aggregation, bad operator).
- Something breaks during the asynchronous operation (`await Tour.aggregate(...)`).
- The input causes a runtime error (like a malformed Date, undefined, etc.) OR, forgotten pre-validate.

---

##### Examples of Triggers for This Catch Block

---

**1. Invalid `req.params.year` (e.g. NaN)**:

- If **URL** `.req` is sent:
  `GET /api/v1/tours/monthly-plan/abc` to:

  ```js
  const year = +req.params.year; // Number(req.params.year) or req.params.year * 1
  ```

  **Then: It is confusing ...**

  ```js
  new Date('NaN-01-01'); // ➜ Invalid Date
  ```

  **In postman test: status(200) ok!**

  ```js
  {
    "status": "success",
    "data": {
        "plan": []
    }
  }
  ```

  **2. Aggregation syntax error:**
  - If it accidentally mistype an aggregation stage or operator:

  ```js
  $unwind: '$startDates'; // but you mistyped `$unwind` or used the wrong path
  ```

  **3. Schema-related issues:**
  - If a document has no `startDates` array or contains invalid types (e.g. a string instead of a date), MongoDB may throw or return unexpected results.

  **In my development**
  I `catch` it with this block:

  ```js
  console.error('Error in getMonthlyPlan:', err);
  ```

  **YES, It is a beginner problem.**

  But it
  - Prevents the server from crashing.
  - Returns a clear message to the client.
  - Helps me debug by logging the real error to the server console:

  ***

  **Optional Improvement: Validate Input Early**

  ***

  Guarding the pipeline against invalid input. It ensures only clean input makes it into the aggregation pipeline.

  ```js
  const year = Number(req.params.year);
  if (isNaN(year)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid year. Please provide a numeric value.',
    });
  }
  ```

  ##### Virtual Properties in MongoDB/Mongoose

  **Virtuals** are fields that don’t actually get stored in the database, but are **computed dynamically** when a document is retrieved.

It is useful when included in calculated value in the API responses, without permanently saving it to the DB.

**1. Defining a Virtual Property in the schema**
virtuals can be implemented in Mongoose Schema, not to individual documents. But Define virtual property in tourSchema(.schema)

```js
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
```

- Now `durationWeeks`(in the existing database) is the virtual property.
- this.duration refers to the duration field in the document.
- It calculates weeks by dividing days by 7.

**Example**:

```js
const tour = await Tour.findOne();
console.log(tour.durationWeeks); // ➜ 2
```

But in MongoDB, there's **NO** `durationWeeks` **field**. It **can not be used as a query**. It’s purely virtual.

**2. Implement virtuals inside tourSchema(.schema)** as **Obj schema option** to virtual property

More Objects can be inserted in `const tourSchema = new mongoose.Schema({})` such as Obj. schema definitions and also Obj. schema option `mongoose.Schema({schema definitions},{schema options})`

By default, virtuals don't show up in `res.json()` or `.toObject().`

```js
const tourSchema = new mongoose.Schema(
  {
    name: String,
    duration: Number,
    // other fields
  },
  {
    toJSON: { virtuals: true }, // enable JSON
    toObject: { virtuals: true }, // enable Obj
  },
);
```

Now, when the tour data as JSON (e.g. via API), durationWeeks will appear automatically.

---

#### Mongoose Middleware

---

Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins.

**Types of Middleware**

Mongoose has 4 types of middleware: document middleware, model middleware, aggregate middleware, and query middleware.

Document middleware is supported for the following document functions. In Mongoose, a document is an instance of a `Model` class. In document middleware functions, `this` refers to the document. To access the model, use `this.constructor`.

- [Pre](https://mongoosejs.com/docs/middleware.html#pre)
  - Pre middleware functions are executed one after another, when each middleware calls next.
- [Post](https://mongoosejs.com/docs/middleware.html#post)

**Document Middleware Lifecycle**

```js
tourSchema
  .pre('save', function (next) {
    // Runs before .save() and .create()
    next();
  })
  .post('save', function (doc, next) {
    // Runs after .save()
    next();
  });
```

- [Errors in Pre Hooks](https://mongoosejs.com/docs/middleware.html#error-handling)
- [Asynchronous Post Hooks](https://mongoosejs.com/docs/middleware.html#post-async)
- [Define Middleware Before Compiling Models](https://mongoosejs.com/docs/middleware.html#defining)
- [Save/Validate Hooks](https://mongoosejs.com/docs/middleware.html#order)
- [Accessing Parameters in Middleware](https://mongoosejs.com/docs/middleware.html#accessing-parameters-in-middleware)
- [Naming Conflicts](https://mongoosejs.com/docs/middleware.html#naming)
- [Notes on findAndUpdate() and Query Middleware](https://mongoosejs.com/docs/middleware.html#notes)
- [Error Handling Middleware](https://mongoosejs.com/docs/middleware.html#error-handling-middleware)
- [Aggregation Hooks](https://mongoosejs.com/docs/middleware.html#aggregate)
  - Aggregation middleware lets you intercept and modify aggregation pipelines before they're executed. This is useful when, Example in this project:
  - Exclude secret tours from all aggregation pipelines unless explicitly included.
  - Add common stages (like filtering, logging, or caching).

```js
// ======================================
// AGGREGATION MIDDLEWARE
// ======================================
// This middleware runs before any aggregation pipeline is executed on the Tour model.
// It is used to automatically exclude secret tours from all AGGREGATION!
// ======================================

tourSchema.pre('aggregate', function (next) {
  // Adds a $match stage to the beginning of the aggregation pipeline
  // This filters out secret tours (secretTour: true), so they won't appear in aggregations by default
  // unshift() is used to make sure this is the FIRST stage in the pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});
```

**Summary**

```js
// tourSchema
secretTour: {
  type: Boolean,
  default: false
}
```

- Every tour defaults to `secretTour`: false (i.e., not secret).
- If it is manually set `secretTour: true`, then it will be set as a secret.

```js
// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
```

- Query Middleware filters out any `secretTour: true` documents from all find queries (find, findOne, etc.)
- So now, even if a tour is secret, it won’t show up in regular `Tour.find()` queries

```js
// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
```

- Modifies every aggregation pipeline before it's executed
- It injects a `$match` stage to exclude secret tours from being processed
- `unshift()` makes sure it’s the first stage, which is important for correct filtering
- “Tricky but now the secretTour is a secret! ... After it goes through this process next();, it is now also excluded from the pipeline." I say so!

- [Synchronous Hooks](https://mongoosejs.com/docs/middleware.html#synchronous)

**More >>** [Mongoose Middleware(official docs)](https://mongoosejs.com/docs/middleware.html)

[Back to the top](#natours-2025)

---

### Data Validation

[validatot.js](https://github.com/validatorjs/validator.js/)

---

#### Built-in Validation

Data Validation, specifically Built-in Validation with Mongoose is is a very important part of modeling data. It must done correctly and safely.

Mongoose lets you define validation rules directly in your schema, using properties,
such as:

- `required`
- `minlength`, `maxlength`
- `min`, `max`
- `enum`
- `validate` (for custom validators)
- These validations run before the document is saved to the database.
- If validation fails, Mongoose throws an error.

```js
{
  "errors": {
    "price": {
      "message": "A tour must have a price",
      "kind": "required",
      ...
    }
  },
  "message": "Tour validation failed"
}
```

##### Example: Tour Schema With Built-in Validation

`tourSchema`

```js
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // Built-in: field must be provided
    unique: true, // Ensures no duplicate names (not a validator, more of a DB constraint)
    trim: true, // Removes extra spaces
    maxlength: [40, 'A tour name must have <= 40 characters'], // Built-in validator
    minlength: [10, 'A tour name must have >= 10 characters'], // Built-in validator
  },

  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty must be either: easy, medium, or difficult',
    },
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    // Custom validator
    validate: {
      validator: function (val) {
        // 'this' only points to current doc on NEW document creation
        return val < this.price; // Check if the val is less than the real price (this.price)
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  createdAt: {
    type: Date,
    // Correct Usage in Mongoose. It passes the function, not the result.
    // Mongoose will call the function each time a new document is created.
    // So each document gets its own unique creation timestamp
    default: Date.now,
    // NOT Date.now() will It sets the default value to the timestamp at the time the schema is defined,
    // NOT when the document is created. All documents will get the same timestamp
    select: false, // exclude(select) field(createdAt) from the schema(false)
  },
  // ... other fields
});
```

**Summery**

- Mongoose has built-in validation you define inside your schema
- These rules make sure invalid data is never saved to the database
- Most validation errors return clear messages — you can customize them
- Sample used in this project `required`, `min`, `max`, `minlength`, `maxlength`, and `enum`

---

##### The Difference Between `Date.now()` and `Date.now`

---

**Memory Trick**

**`default: Date.now()` ← This runs the function immediately**

- **Result:** It sets the default value to the **timestamp at the time the schema is defined** — not when the document is created.
- **Problem:** All documents will get the **same timestamp** (from when the app started or model was loaded).

**`default: Date.now` ← This passes the function, not the result**

- Correct Usage in Mongoose
- Mongoose will **call the function** each time a new document is created
- **Each document gets its own unique creation timestamp**

[Back to the top](#natours-2025)

#### Errors Handling in Express:

The distinction between **operational errors** and **programming errors** is a fundamental concept in robust Node.js app architecture

---

##### Operational Errors vs Programming Errors

| **Type**               | **What it means**                                                              | **Examples**                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Operational Errors** | Known, expected, and handled errors caused by _legitimate runtime conditions_. | - Invalid user input (e.g. bad ID) <br> - Failing to connect to DB <br> - Route not found <br> - Failed to read a file |
| **Programming Errors** | Bugs in your code — things you _did not expect to happen_.                     | - `undefined is not a function` <br> - Trying to access a property on `null` <br> - Logic bugs                         |

##### The Matters in Express Apps

Operational errors are safe to send to the client (with friendly messages). Programming errors are not — they’re bugs, and typically when tested and logged, crash the app (in production), and fix the code.

**Example**: class `AppError` to mark **operational errors**:

`utils/appError.js`

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Marks this as an "expected" error

    Error.captureStackTrace(this, this.constructor);
  }
}
```

This flag `isOperational` allows us to handle operational errors gracefully, while allowing other (programming) errors to crash the app in production (to avoid undefined behavior).

- Extends the native JS `Error` class.
- Adds `statusCode` and `status` (like fail or error) for easier control.
- Adds a flag `isOperational` so for global err to **distinguish between operational vs programming errors**.
- Captures stack trace without polluting it with the constructor function itself.

##### Summery

- **Operational errors** = catch them, handle gracefully, send to client.
- **programming errors** = don't try to handle; crash app (in production) and fix

---

#### Catch-All for Unhandled Routes

```js
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Refactored err handler can't find ${req.originalUrl} on this server!`,
      404,
    ),
  );
});
```

- Handles all undefined routes (like **/cucumber**).
- It creates a new operational **error** with a message and statusCode **404**.
- The error is then passed to your **global error handler** via `next()`.

---

#### Global Error Handler `controllers/errorController.js`

`errorController.js` is the **global error-handling middleware** in Express. It follows a **centralized error handling strategy**

```js
// ======================================
// Global Error Handler - BASIC
// ======================================
// 1. Imports
// 2. Helper functions (like handleCastErrorDB)
// 3. Error response functions (sendErrorDev / sendErrorProd)
// 4. Exported middleware (main error handler)

module.exports = (err, req, res, next) => {
  // ======================================
  // SET DEFAULTS
  // ======================================
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // ======================================
  // DEVELOPMENT MODE: send full error details
  // ======================================
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err, // Entire error object
      message: err.message, // Useful error message
      stack: err.stack, // Stack trace for debugging
    });
  }

  // ======================================
  // PRODUCTION MODE: avoid leaking sensitive info
  // ======================================
  if (process.env.NODE_ENV === 'production') {
    // Operational (trusted) error: send specific message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or unknown error: log and send generic message
    console.error('UNEXPECTED ERROR:', err); // Log full error to server logs

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // ======================================
  // DEFAULT FALLBACK (safety net for misconfigured NODE_ENV)
  // ======================================
  res.status(err.statusCode).json({
    status: err.status,
    message: 'An unexpected error occurred.',
  });
};
```

---

#### Global error handler with production readiness

---

**Core Concepts**

1. **Centralized Error Handling**
   Instead of writing `try/catch` blocks or `res.status(...).json(...)` in every controller, funnel all errors to one place using next(err) — and handle everything here.

It covers:

- **Trusted (operational) errors** → caused by user input, invalid data, etc.
- **Programming errors** → bugs, undefined variables, DB misconfig, etc.
- **Unknown errors** → just in case something unexpected happens.

2. **Early Return Pattern**
   Using return to **avoid nesting**. It improves readability and makes the error logic clear.

```js
if (...) {
  return res.status(...).json(...);
}
```

#### Error Handling Layers

```js
module.exports = (err, req, res, next) => {
```

- Express recognizes it because it has 4 parameters: (`err`, `req`, `res`, `next`).
- Express global error middleware — must have four arguments, or Express won’t treat it as an error handler.

---

##### 1. Set Default Properties

```js
err.statusCode = err.statusCode || 500;
err.status = err.status || 'error';
```

- Sets default values for the error object in case they’re missing.

If an error doesn’t define these properties (e.g., throw new Error()), it defaults to:

- `500 Internal Server Error`
- `status: 'error'`

---

##### 2. Development Mode

```js
if (process.env.NODE_ENV === 'development') {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}
```

- **Full error object**
- **Stack trace**
  - Logs the error's stack trace. (for development of where the err occurred line by line!)
- **Message**

---

##### 3. Production Mode

```js
if (process.env.NODE_ENV === 'production') {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('UNEXPECTED ERROR:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
}
```

In production, never leak internal implementation (like `.stack`, error objects, or MongoDB traces).

- **If it's operational** (e.g., `new AppError('Tour not found', 404)`), return the custom message.

- **If not** (e.g., programming error), log it and show a generic message.

- Sends a structured JSON response back to the client.

This ensures users don’t see DB errors, crash logs, or stack traces.

---

##### 4. Fall Back

```js
res.status(err.statusCode).json({
  status: err.status,
  message: 'An unexpected error occurred.',
});
```

This final return acts as a **safety net** if `NODE_ENV` is not defined.

#### Global Error Handler

All errors are handled in a centralized `errorController.js`:

- Development Mode: Full stack trace and error object
- Production Mode: Clean and secure messages

Supported Errors:

| Error Type        | Description                         | HTTP Status |
| ----------------- | ----------------------------------- | ----------- |
| CastError         | Invalid MongoDB ObjectId            | 400         |
| AppError (custom) | Resource not found, forbidden, etc. | 404, 403    |
| ValidationError   | Schema validation failed            | 400         |
| DuplicateField    | Unique field violated (e.g., name)  | 400         |
| JWT Errors        | Invalid or expired token            | 401 / 403   |
| Programming Error | Unknown, handled gracefully in prod | 500         |

---

🕵️ **DEEP DIVE:**
[express.js Error Handling Docs](https://expressjs.com/en/guide/error-handling.html)
[MDN: JS Error Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[Back to the top](#natours-2025)

---

#### catchAsync Utility Function

The `catchAsync` utility function helps handle errors in asynchronous Express route handlers without writing repetitive `try/catch` blocks.

---

```js
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
```

##### CLEANER:

- `catchAsync` is a higher-order function (a function that returns another function).
- It **wraps** any **async route handler** and **automatically catches** any error, forwarding them to Express's global error handler using`next(err)`.

---

**DRY** = **cleaner code**

Without `catchAsync` removes try and catch in every controller:

```js
exports.getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    next(err); // Manually forward error
  }
};
```

With `catchAsync`:

```js
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({ status: 'success', data: { tour } });
});
```

- No boilerplate
- All errors automatically handled
- Focus stays on business logic

**fn?**
`fn` is a **placeholder for an async route handler function** — the actual function you pass in when you use `catchAsync()`.

**Under the hood**

```js
// utils/catchAsync.js
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
```

- `fn` is any async function (in controller).
- It's wrapped in another function that Express can call.
- If `fn` throws or returns a rejected promise, `.catch(next)` forwards the error to Express.

Without this, unhandled promise rejections in route handlers **won’t** be caught by Express by default.

##### The Flow in `Natours`

```js
// routes/tourRoutes.js
router.get('/:id', tourController.getTour);

// controllers/tourController.js
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});
```

If anything inside the handler throws (e.g., DB connection fails, tour not found), `catchAsync` automatically sends it to:

```js
// middleware/errorController.js
app.use((err, req, res, next) => {
  // Global error handler
});
```

---

| Benefit           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| DRY               | No need to repeat `try/catch` in every controller |
| Centralized Error | All errors go to one place — the global handler   |
| Clean Syntax      | Focus on logic, not error handling boilerplate    |

---

[Production-Readiness](#global-error-handler-with-production-readiness)

---

#### Error Handling Philosophy

Global Error Handler `(errorController.js)` 'goal is to manage and format all operational errors before sending them to the client.
The goal is to **fail gracefully, protect sensitive data**, and **help developers debug faster**.

**Global Error Handling – Quick Reference**

```yaml
modes:
  development:
    goal: 'Give developers full error details for debugging'
    response:
      - status: 'fail or error'
      - error: 'Full raw error object'
      - message: 'Human-readable explanation'
      - stack: 'Stack trace for pinpointing issue'

  production:
    goal: 'Hide sensitive data, fail gracefully for users'
    handlers:
      CastError:
        description: 'Invalid MongoDB ObjectId format'
        statusCode: 400
        message: 'Invalid <field>: <value>'
      DuplicateField:
        match: 'err.code === 11000'
        statusCode: 400
        message: 'Duplicate field value: <value>. Please use another value.'
      ValidationError:
        description: 'Schema validation failed'
        statusCode: 400
        message: 'Invalid input data'

    unknown_error:
      statusCode: 500
      message: 'Something went very wrong!'

notes:
  preserve_message:
    reason: 'Shallow copy `{ ...err }` may drop `err.message`'
    fix: 'error.message = err.message'
  objectid_format:
    allowed_chars: '0-9 and a-f (24 hex chars)'
    invalid_example: '6885669311c1889fa57a9e4z → triggers CastError (400)'
    valid_but_not_found: '6885669311c1889fa57a9e4e → triggers 404 Not Found'
  design_goals:
    - Consistency
    - Security
    - Clarity
    - Extensibility
```

[Back to the top](#natours-2025)

---

#### Centralizing Async Error Handling in `server.js`

Handling `connectDB()` used a `try/catch` block to handle MongoDB connection

---

```js
try {
  await mongoose.connect(process.env.MONGO_URL);
} catch (err) {
  console.error(err);
  process.exit(1);
}
```

It **handles the error immediately** inside `db.js`,

- The rejection **never reaches** the global `unhandledRejection` handler.
- Database startup **errors are isolated** instead of being part of the **central error-handling ecosystem**.

---

##### Refactor Philosophy

**All async errors outside Express** (including DB connection failures) **should be handled in one place** — the global handler in `server.js`.

---

**Refactor Steps**

1. Remove try/catch from `connectDB()`.
   - Let the promise rejection bubble up naturally.

```js
const connectDB = async () => {
  // No try/catch — let the rejection bubble up
  const DB = await mongoose.connect(process.env.MONGO_URL);
  console.log(`MongoDB connected successfully 🛸 : ${DB.connection.host}`);
  console.log(`Port:👉 ${DB.connection.port}`);
  console.log(`Database: ${DB.connection.name}`);
};

module.exports = connectDB;
```

2. Call connectDB() in `server.js` without `.catch()`.

```js
// ======================================
// Connect to Database
connectDB(); // No catch here — failures go to unhandledRejection

// ======================================
```

3. Synchronous errors outside Express.
   - `uncaughtException` = sync errors, no `try/catch` present, outside Express’ middleware system.

```js
// throw new Error('💥 Test uncaughtException!');
// =================================
// Global Uncaught Exception Handler
// listen to events even before requiring main app
// (Synchronous errors outside Express)
// Keep uncaughtException → protects against sync runtime errors before/after Express is running.
process.on('uncaughtException', (err) => {
  console.error('🔥 :UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// ====================================
dotenv.config({ path: './config.env' });

const connectDB = require('./config/db');
const app = require('./app');
```

4. Store the HTTP server instance so it can be closed timely:

```js
// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```

5. Attach a global rejection handler in `server.js`:

```js
// ======================================
// Global Unhandled Promise Rejection Handler
// (Async errors outside Express)
process.on('unhandledRejection', (err) => {
  console.error('🧨 :UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
```

---

**Error Handling Map**
| Error Type | Where It’s Caught |
| --------------------------------------------- | ---------------------------------- |
| Sync errors inside Express | `errorController.js` |
| Async errors inside Express (via `next(err)`) | `errorController.js` |
| Sync errors outside Express | `process.on('uncaughtException')` |
| Async errors outside Express | `process.on('unhandledRejection')` |

This approach makes `server.js` the single point of failure control for your application startup and runtime errors that happen outside the Express middleware chain.

- **Centralized Control** → All unexpected async errors are handled in one place.
- **Graceful Shutdown** → Gives ongoing requests time to complete before exiting.
- **Consistent Logging** → Same format for all fatal errors outside Express.

---

[Back to the top](#natours-2025)

---

### Authentication - Authorization - Security

In modern web applications, securing user data and restricting access to resources are critical concerns. This section focuses on **Authentication, Authorization**, and related **Security** measures implemented in the application.

- **Authentication** is the process of verifying the identity of users, typically through login credentials like email and password. Once verified, users receive a token (JWT) that proves their identity for subsequent requests.

- **Authorization** controls what authenticated users are allowed to do. Based on roles or permissions, it restricts access to certain API routes or resources to ensure users can only perform actions they are permitted to.

- **Security** involves protecting sensitive data, such as passwords and tokens, preventing unauthorized access, and mitigating risks like token theft or replay attacks. This includes using secure cookies, setting token expiration times, and handling token errors properly.

---

## Many are missing here

---

#### Document Middleware

##### 1) Last stop before the new password is saved to MongoDB

What happens inside Mongoose pre-save middleware in `userModel.js`:

```js
userSchema.pre('save', async function (next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm field (not persisted)
  this.passwordConfirm = undefined;

  next();
});

// =====================================
// 2) Update passwordChangedAt timestamp
// =====================================
// This runs only before saving a user document
userSchema.pre('save', function (next) {
  // If password field has NOT been modified, OR this is a new document, skip
  if (!this.isModified('password') || this.isNew) return next();

  // Set the passwordChangedAt property to current time (minus 1 second)
  // Why minus 1 second? To ensure the JWT issued *after* signup
  // is always valid (avoids rare token issue if save() finishes slightly later)
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// ===============================
// Instance Methods
// ===========================================
```

That `Date.now() - 1000` line ensures that **passwordChangedAt** is slightly before the JWT issuance time (avoiding race conditions).

So this is the **“final pit stop”** before the new hashed password and updated passwordChangedAt get persisted to MongoDB.

---

##### Checking if the password was changed after JWT was issued

Later, when the user makes a request with their JWT, you might call:

```js
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
```

Here’s what’s happening:

- This method **does not save anything** — it’s only a check.
- It’s used during authentication to **invalidate old tokens** issued before the password change.
- If the JWT’s timestamp is older than passwordChangedAt → **force re-login**.

---

#### Password Reset & Authentication Lifecycle

| Step | Location in Code                                                                 | What Happens                                                                                                                                                                  | Saves to DB?                         |
| ---- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 1    | **User requests forgotPassword** (`authController.forgotPassword`)               | Creates a **plain resetToken**, hashes it with SHA-256, stores hash in `passwordResetToken`, sets `passwordResetExpires` (+10 min), returns plain token via email.            | 🟢 Yes — saves hashed token + expiry |
| 2    | **User clicks email link & sends new password** (`authController.resetPassword`) | Hashes token from URL, finds matching user with valid expiry, sets `password` and `passwordConfirm`, clears `passwordResetToken` + `passwordResetExpires`.                    | 🟢 Yes — on `.save()`                |
| 3    | **pre('save') middleware (hashing)** (`userModel.js`)                            | If password was modified → hash new password with bcrypt, remove `passwordConfirm` field (not stored in DB).                                                                  | 🟢 Yes — hashed password saved       |
| 4    | **pre('save') middleware (timestamp)** (`userModel.js`)                          | If password was modified and user is not new → set `passwordChangedAt = Date.now() - 1000` to avoid JWT timing issues.                                                        | 🟢 Yes — saves timestamp             |
| 5    | **JWT issued** (`createSendToken`)                                               | After successful save, new JWT is signed with current time as `iat` (issued at).                                                                                              | 🔴 No — JWT is sent to client        |
| 6    | **JWT validation** (`protect` middleware)                                        | When a request comes in, `changedPasswordAfter(JWTTimestamp)` checks if `passwordChangedAt` is after token `iat`. If yes → reject request (password was changed after login). | 🔴 No — just a check                 |
| 7    | **User continues authenticated session**                                         | If no password change detected, JWT remains valid until expiry.                                                                                                               | 🔴 No                                |

---

### Notes

- Step 1 and Step 2 are **controller-level** actions (business logic).
- Step 3 and Step 4 happen **automatically** because of Mongoose hooks.
- Step 6 is purely a **validation** — no DB writes.

##### 1) When the user clicks "Forgot Password"

- `createPasswordResetToken()` is called on the user document.
- This method:
  - Generates a plain reset token (`resetToken` → random hex string) → this will be in email to the user. but it will be ..
  - Created as a hashed version of that token using SHA-256 and stores it in `passwordResetToken` in the DB.
  - THEN: Sets `passwordResetExpires` to 10 minutes in the future.
  - Returns the `plain token` to the controller (so it can be sent via email).

NOTE: 📌 Why hash before storing?
**If someone hacked your DB, they wouldn’t be able to use the plain reset token — they’d only see the hashed one**

---

##### 2) When user receives email and sends a PATCH to `/resetPassword/:token`

- The URL contains the plain token from the email.
  Example: `/api/v1/users/resetPassword/4f9ad7e63fe...`

---

##### 3) The resetPassword controller runs

1. It hashes the incoming token from the URL exactly the same step 1:

```js
const hashedToken = crypto
  .createHash('sha256')
  .update(req.params.token)
  .digest('hex');
```

2. It looks up a user in MongoDB where:
   - `passwordResetToken` matches this hashed token
   - `passwordResetExpires` is still in the future

3. If no user found → token invalid or expired → throw error.

---

##### 4) Setting the new password

If a matching user is found:

- Assign `req.body.password` and `req.body.passwordConfirm` to the user doc.
- Clear out `passwordResetToken` and `passwordResetExpires` so they can’t be reused.
- Call `user.save()`:
  - This triggers mongoose pre-save hooks:
    - Hashes the new password
    - Updates `passwordChangedAt`

- User document in DB now contains **the new hashed password.**

---

##### 5) Logging in the user

- A fresh JWT is created and sent back (via createSendToken).
- Now the user is authenticated with the new password.

---

[Back to the top](#natours-2025)

---

#### Update Current User Password

---

##### Update Current User Password (when logged in)

**Concept**

1. **User is logged-in** → is already authenticated (`req.user.id`) in protect middleware.
2. The user must provide their current password in the request body → to prove it’s them.
3. The user also send a new `password` and `passwordConfirm`.

**STEPS**

- Check current password against the DB (`user.correctPassword`).
- If it’s valid → update the password fields.
- Save user (`.save()` NOT `.findByIdAndUpdate`, so pre - save middleware runs).
- Log them in again (send new JWT).

```js
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get current user from collection and ask for the password from protect middleware
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct from `userSchema.methods.correctPassword`
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password like in step 3 in resetPassword
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Use save(),runs the pre-save password hashing. NOT findByIdAndUpdate!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
```

---

#### save() VS findByIdAndUpdate

---

- `user.save()` → does trigger pre-save middleware hooks in the schema.
- `User.findByIdAndUpdate(...)` → does not trigger `pre('save')` hooks, because no `.save()` actually happens — MongoDB is updated directly.

In `userModel.js` pre-save middleware

```js
userSchema.pre('save', async function (next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
```

What will happen IF `User.findByIdAndUpdate(...)` is called instead of `await user.save()`

```js
await User.findByIdAndUpdate(req.user.id, {
  password: req.body.password,
  passwordConfirm: req.body.passwordConfirm,
});
```

It would update the DB directly. **Password would be saved in plain text**, because the hashing middleware never ran!

**“Use `save()`, NOT `findByIdAndUpdate` — otherwise pre-save hooks will not run!”**

---

#### Multi-role or role stacking - OPTIONAL

---

In the current Natours setup, it uses a simple **single-role model:**

```js
role: {
  type: String,
  enum: ['user', 'guide', 'lead-guide', 'admin'],
  default: 'user'
}
```

It means **one user can only have one role at a time** — stored as a single string. So in this system, one can’t literally be "admin" and "lead-guide" at once unless the `userSchema` is changed!

**Optional**
Change `role` to an **array** of strings:

```js
roles: {
  type: [String],
  enum: ['user', 'guide', 'lead-guide', 'admin'],
  default: ['user']
}
```

Now **multi-role** could be stored

```js
roles: ['admin', 'lead-guide'];
```

// HOWEVER, any place the currently checks role

```js
// FROM
if (req.user.role !== 'admin')

// TO
if (!req.user.roles.includes('admin'))

```

Also in `restrictTo` middleware would need to handle arrays:

```js
// FROM
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403), // 403 = Forbidden
      );
    }
    next();
  };

// ---------------------------------------------------------------------------

// TO
exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.some((role) => req.user.roles.includes(role))) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};
```

**It could cause complications**
Info: [Role-Based Access Control](https://medium.com/@eshikashah2001/exploring-role-based-access-control-rbac-32843370e604) (RBAC) in depth.

---

### More about Rate Limiting, Setting Security HTTP Headers, Data Sanitization and Preventing Parameter Pollution.

#### To be continued!

[Back to the top](#natours-2025)

---

### Modelling Data and Advanced Mongoose

#### 1. What is Data Modelling?

Data modelling is about **structuring data** in a way that:

- Represents the **real-world entities** (like Tours, Users, Reviews).
- Defines how these entities **relate** to each other.
- Balances **performance** (fast queries) with **flexibility** (easy to evolve).

In MongoDB, because it’s **NoSQL** and document-based, there is NO strict schemas like `SQL`. Instead, there flexibility → but that means it must be carefully designed the shape of documents as framework!

---

#### 2. Real-World Scenario → Unstructured Data

Imagine if the model data is not modeled properly:

Each `Tour` document might store:

```js
{
  "name": "The Forest Hiker",
  "price": 497,
  "guides": [
    { "name": "Jonas", "email": "jonas@test.com" },
    { "name": "Martha", "email": "martha@test.com" }
  ],
  "reviews": [
    { "review": "Amazing!", "rating": 5 },
    { "review": "Too long", "rating": 3 }
  ]
}
```

- This is **unstructured** and becomes messy fast:
  - Guides duplicated across tours.
  - Hard to update if a guide’s email changes.
  - Reviews are stuck inside tours — can’t easily query “all reviews by Martha”.

So → unstructured = flexible at first, but **painful at scaling!**

---

#### 3. Structured Data

Instead, we create separate collections for `users`, `tours`, `reviews`:

- `users` → keep user info in one place.
- `tours` → reference users (guides) with their IDs.
- `reviews` → reference both `tours` and `users`.

This is called a **Logical Data Model**:

- Defines entities (`Tour`, `User`, `Review`).
- Defines relationships (1-to-many, many-to-many).
- Prevents duplication, makes queries more consistent.

---

#### 4. Relationships in MongoDB

Unlike SQL (which has joins), MongoDB uses two strategies:

1. **Embedding** → put related data inside a document (fast reads, denormalized).
2. **Referencing** → keep in separate collections and connect via `ObjectId` (normalized, flexible).

---

The **art of modelling** = deciding **when to embed and when to reference.**

---

#### Two main methods to `model data` in `MongoDB`

[Data Modelling MongoBD](https://www.mongodb.com/docs/manual/data-modeling/)

There are **two main methods** to **model data in MongoDB**.

**1. Embedding (Denormalization)** → Storing related data inside a document.

- Example: storing tour reviews inside the Tour document.
- Pros: fewer queries, fast reads.
- Cons: duplication, bigger documents, harder to update consistently.

##### Embedding (Denormalization):

**1.1 One-to-Few (Best Case for Embedding)**

When the child data is **small in number**, tightly coupled, and always queried with the parent.

**Example in Natours**: `Tour` locations (start and stop points along a route).

**Schema**

```js
const tourSchema = new mongoose.Schema({
  name: String,
  duration: Number,
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // [longitude, latitude]
      description: String,
      day: Number,
    },
  ],
});
```

- Pros: All location data comes directly with the tour — no extra query or populate needed.
- Cons: If locations changed often (unlikely), you’d have to update them inside every tour.

---

**1.2 Embedding User Data into a Tour (for denormalization)**

Suppose you want **performance** and don’t care about data duplication. You might embed guides directly inside the `Tour` instead of referencing them.

**Schema:**

```js
const tourSchema = new mongoose.Schema({
  name: String,
  guides: [
    {
      name: String,
      email: String,
      role: {
        type: String,
        enum: ['guide', 'lead-guide'],
      },
    },
  ],
});
```

- Pros: No populate(), faster reads.
- Cons: If a guide changes their email, you must update it in every tour they lead.

---

**1.3 Embedding Reviews in a `Tour` (not recommended at scale)**

Imagine storing all reviews directly inside the Tour document.

Schema:

```js
const tourSchema = new mongoose.Schema({
  name: String,
  reviews: [
    {
      review: String,
      rating: Number,
      user: String,
    },
  ],
});
```

- Pros: Super fast if you always fetch reviews together with tours.
- Cons: Tours with hundreds/thousands of reviews → bloated documents, slow writes, duplication issues.

---

**More example in this project:**

- **Guides** (users leading tours) → better as references.
- **Locations** (tour stops) → better as embedded sub-documents.
- **Reviews** → stored separately and linked via references.

---

**2. Referencing (Normalization)** → Storing related data in separate collections and reference them with IDs (ObjectId).

- Example: a `Tour` just stores `guide: ObjectId` instead of embedding the whole guide.
- Pros: no duplication, consistent data, smaller documents.
- Cons: requires additional queries or `populate()`.

---

#### Referencing Types in MongoDB

---

**2.1 Child Referencing**

The child document stores a reference (ObjectId) to the parent document.

- Example: In Natours, each `Review` stores the `tourId` and ``userId`.
- Schema:

```js
const reviewSchema = new mongoose.Schema({
  review: String,
  rating: Number,
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});
```

- Pros: The `Tour` document stays small. Reviews can be queried independently.
- Cons: You need `populate()` to fetch review details with tours.

---

**2.2 Parent Referencing**

```js
const tourSchema = new mongoose.Schema({
  name: String,
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});
```

- Pros: Easy to get all guides for a tour in one query.
- Cons: If the child list grows too big (hundreds/thousands), the parent document can become bloated.

---

**2.3 Two-Way Referencing**

Both parent and child documents store references to each other.

- Example:
  - A `Tour` references its `Reviews`.
  - Each `Review` also references its `Tour`.
- Schema (Tour side):

```js
const tourSchema = new mongoose.Schema({
  name: String,
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
    },
  ],
});
```

- Schema (Review side):

```js
const reviewSchema = new mongoose.Schema({
  review: String,
  rating: Number,
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
  },
});
```

- Pros: Makes queries flexible both ways (easy to fetch tour → reviews, or review → tour).
- Cons: Can lead to duplication of references and harder consistency management (must keep both sides updated).

---

#### In Natours

Practically, It is usually recommended **child referencing** as the main strategy (especially for 1:N like Reviews), because MongoDB docs stay smaller and it avoids bloating the parent document.

Or More in this project!

- **Embedding vs. Referencing** → Theory + examples.
- **Modelling Tours, Users, and Reviews** with the correct approach.
- **Populating References** (using .populate() in queries).
- **Embedding Sub-documents** for tour locations.
- **Child Referencing** (e.g., reviews referencing tours & users).
- Some **Advanced** stuff like:
  - Indexes
  - Virtual properties
  - Virtual populate
  - Middleware for queries and documents.
    1

---

### Types of relationships in MongoDB data modelling

#### 1. One-to-One (1:1)

- **Definition**: One document in a collection relates to **exactly one document** in another collection.
- **Example in Natours**:
  - A `Tour` might have **one main guide profile** (it can be modelled that way, though often there are multiple guides).
- **Implementation**:
  - Can embed the data inside the document.
  - Or reference by storing the other document’s `_id`.

---

#### 2. One-to-Many (1:N)

- **Definition**: One document relates to **many documents** in another collection.
- **Examples in Natours**:
  - A `Tour` has many `Reviews`.
  - A `User` can write many `Reviews`.
- **Implementation Options**:
  1. **Embedding**: If the “many” side is small and doesn’t grow unbounded, you can embed documents (like a few locations in a tour).
  2. **Referencing**: If the “many” side grows large (like hundreds of reviews), store them separately and reference via IDs (`ObjectId`).

---

#### 3. Many-to-Many (M:N)

- **Definition**: Many documents in one collection relate to **many documents** in another collection.
- **Example in Natours**:
  - Tours and Guides → each `Tour` can have multiple `Guides`, and each `User` (guide) can lead multiple `Tours`.
- **Implementation**:
  - Usually handled with referencing.
  - Store arrays of `_ids` on one side (or both sides).

  ***

🔹 **Key MongoDB**

- **Embedding = great for 1:1 or small 1:N relationships** where fast read is important.
- **Referencing = better for large 1:N or M:N relationships** to avoid duplication and keep documents small.
- **The art is in knowing the data and how it will be queried** — speed vs. storage vs. consistency.

---

### MongoDB Data Modelling: Embed vs Reference Framework

A practical guide for deciding when to **embed** data or **reference**
it in MongoDB.

---

#### 1. Relationship Type

- **One-to-few (1:1 or small 1:N): → Embed**
  - Example: A `Tour` has a few `locations`.
- **One-to-many (large or growing): → Reference**
  - Example: A `Tour` has hundreds of `Reviews`.
- **Many-to-many (M:N): → Reference**
  - Example: `Tours` and `Guides` (Users).

---

#### 2. Data Access Patterns

- **If always queried together → Embed**
  - Example: `Tour` + `locations` (whenever you fetch a tour, you
    also want its locations).
- **If often queried separately → Reference**
  - Example: `Reviews` → Sometimes you want "all reviews by a user"
    without needing the tour.

---

#### 3. Data Closeness

- **Strong ownership / dependency → Embed**
  - Example: `location` exists only as part of a `Tour`. If the tour
    is deleted, the location has no meaning.
- **Weak ownership / independence → Reference**
  - Example: `User` exists independently of `Tour`. A `Review`
    belongs to both `User` and `Tour`.

---

#### Natours Examples

- **Embed:**
  - Tour `locations` (strong ownership, small 1:N, always queried
    with tour).
- **Reference:**
  - Tour `guides` (M:N, independent, queried separately).
  - Tour `reviews` (large 1:N, independent, queried separately).

---

### Decision Checklist

1.  What is the relationship type? (1:1, 1:N, M:N)
2.  How will the data be accessed? (always together or often
    separately?)
3.  How close is the relationship? (strongly dependent or independent?)

If in doubt: **start with referencing** for flexibility, then embed
later for performance if needed.

[Back to the top](#natours-2025)

```

```
