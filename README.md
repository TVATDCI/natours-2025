# natours-2025

## Project Overview – Natours API

[Natours Node.js course](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) by [Jonas Schmedtmann](https://codingheroes.io/).

I value this project as a deep dive into building a **real-world, production-ready Node.js application** using **modern backend tools** like **Express, MongoDB,** and **Mongoose**. Along the way, including, clean API architect, powerful, and ready to scale.. It covers all essential concepts to master full-stack backend development using modern technologies.

**Natours** isn't a brand new project around. However, it also has the approach and introduces me to **enterprise-level structure**. Its core feature gives an Opportunity to develop it into a modern real world app. It gives me that feels like: **practical, grounded, and developer-focused**

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
├── base/
│ ├── appX.js
│ ├── tourRoutesX.js
│ └── userRoutesX.js
├── config/
│ └── db.js
├── dev-data/
│ ├── data/
│ │ ├── reviews.json
│ │ ├── tour5.js
│ │ ├── tours-simple.json
│ │ ├── tours.json
│ │ └── users.json
│ ├── img/
│ │ ├── arrav.jpg
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

[Back to the top](#natours-2025)
