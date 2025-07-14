# natours-2025

## Project Setup: CommonJS First, ES Modules Later

This project follows the [Natours Node.js course](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) by Jonas Schmedtmann.

---

### Table of Contents

1. [Project Setup: CommonJS First, ES Modules Later](#project-setup-commonjs-first-es-modules-later)
2. [What is an API?](#what-is-an-api)
   - [POST `/` Route Example](#post-route)
3. [REST Architecture and CRUD Operations](#rest-architecture-and-crud-operations)
   - [What is REST?](#what-is-rest)
   - [CRUD Operations in REST](#crud-operations-in-rest)
   - [Resources in REST](#resources-in-rest)
   - [Tour API Example](#example-tour-api)
   - [REST Best Practices](#rest-best-practices)
4. [What is JSON?](#what-is-json)
   - [JSON Structure](#json-structure)
   - [Example JSON](#example-json-with-an-array)
5. [What is JSend?](#what-about-jsend)
   - [JSend Structure](#basic-jsend-structure)
   - [Example Tour JSend Response](#example-using-tour-data-success-response)
   - [Why Use JSend?](#why-use-jsend)
6. [Stateless RESTful APIs](#stateless-restful-apis)
   - [What Does Stateless Mean?](#what-does-stateless-mean)
   - [Why Stateless?](#why-stateless)
   - [Example with Token Auth](#example)
   - [Summary of Stateless APIs](#important)
7. [MVC: Model – View – Controller](#mvc-model--view--controller)
   - [What Each Part Does](#what-each-part-does)
   - [MVC in API-Only Projects](#api-only-project)
   - [Suggested Project Structure](#project-structure)
8. [The Request–Response Cycle in Express](#the-requestresponse-cycle-in-express)
   - [Express Middleware Flow](#express-middleware-flow)

---

To stay aligned with the course content and maximize learning, I am starting the development using **CommonJS module syntax** (`require`, `module.exports`).

### Why CommonJS for Now?

- **Beginner-Friendly:** Easier to grasp while learning core Node.js concepts like routing, middleware, and MVC structure.
- **Matches the Course:** Staying consistent with the instructor helps avoid unnecessary friction or confusion.
- **Stable Ecosystem Support:** CommonJS is mature and well-supported across the Node.js ecosystem.

### Plan Going Forward

We’re developing in the `commonJs` branch, step-by-step with the course. After completing each section, we’ll open a pull request into `main`.

Once the course is complete, we plan to

- Gradually refactor the project into **ES Modules** (`import/export`)
- Update build tools and dependencies as needed
- Modernize the codebase for production-readines
  This approach gives us both a **solid foundation** and a **modern development path**.

## What is an API?

**API** stands for **Application Programming Interface**.

An API is a piece of software that allows different applications to **communicate with each other**. It defines a set of rules and protocols that one piece of software can use to access the features or data of another.

In web development, when we talk about APIs, we're usually referring to **web APIs**—specifically, APIs that use the **HTTP protocol** to send and receive data between a **client (like a browser or mobile app)** and a **server**.

For example, in this project:

- The `GET /` route returns a JSON message when someone accesses the root URL.
- The `POST /` route simulates how we might accept data from a client.

These routes are examples of **API endpoints**—each one performs a specific task and responds to specific types of requests.

> Simply put: An API is like a waiter in a restaurant. You (the client) tell the waiter what you want (a request), and the waiter brings it from the kitchen (the server) to you (the response).

#### POST `/` Route

This route handles **HTTP POST requests** to the root URL (`/`):

```js
app.post('/', (req, res) => {
  res.send('Sending msg using post method endpoint...');
});
```

---

[Back to the top](#natours-2025)

---

## REST Architecture and CRUD Operations

### What is REST?

**REST** stands for **Representational State Transfer**.  
It is a software architectural style used for building **web services and APIs**. REST relies on **standard HTTP methods** to enable communication between clients (like browsers, mobile apps) and servers.

RESTful APIs are:

- Stateless: each request is independent and self-contained
- Resource-based: data is treated as resources (like users, tours, products)
- Accessible via standard HTTP methods

---

### CRUD Operations in REST

REST uses HTTP methods to implement **CRUD operations**:

| Operation | Description             | HTTP Method      | Example Endpoint           |
| --------- | ----------------------- | ---------------- | -------------------------- |
| Create    | Add a new resource      | `POST`           | `POST /api/v1/tours`       |
| Read      | Retrieve one or many    | `GET`            | `GET /api/v1/tours`        |
| Read      | Retrieve a single item  | `GET`            | `GET /api/v1/tours/:id`    |
| Update    | Modify an existing item | `PATCH` or `PUT` | `PATCH /api/v1/tours/:id`  |
| Delete    | Remove a resource       | `DELETE`         | `DELETE /api/v1/tours/:id` |

---

### Resources in REST

A **resource** is any piece of data the API manages:

- `/users` → users resource
- `/tours` → tours resource
- `/bookings` → bookings resource

Resources are usually returned in **JSON format**, and identified by **URLs** (called _endpoints_).

---

### Example: Tour API

If we were building a tour-related REST API, with **HTTP Methods**. **POST-GET-PUT-PATCH-DELETE**

- `POST /api/v1/tours` → Add a new tour **C**reate
- `GET /api/v1/tours` → Get all tours **R**ead
- `GET /api/v1/tours/:id` → Get a specific tour READ:id
- `PUT /api/v1/tours` → **U**pdate a tour
- `PATCH /api/v1/tours/:id` → Update a tour
- `DELETE /api/v1/tours/:id` → **D**elete a tour

**CRUD** Operations!

---

#### REST Best Practices

- Use **nouns**, not verbs, in endpoints: `/users`, not `/getUsers`
- Use **plural names** for resources: `/tours`, not `/tour`
- Keep APIs **stateless**: No user sessions should be stored on the server
- Return proper **HTTP status codes** (e.g., 200 OK, 404 Not Found, 201 Created)

---

**REST** makes it easy to build scalable, predictable APIs that follow standard web conventions.

**JSON data format is usually used for both side the server <--> the client**

#### What is JSON?

**JSON** stands for **JavaScript Object Notation**.

It is a lightweight, human-readable format used to **store and exchange data**—especially between a **client** and a **server**.

In REST APIs, JSON is the most common format for:

- Sending data from the client to the server (e.g. via POST)
- Receiving data from the server (e.g. via GET)

#### JSON Structure:

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

##### Example JSON with an Array:

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

#### What about JSend?

**JSend** is a convention for formatting JSON responses in a clean, predictable structure. It helps clients understand what happened—whether the request was successful, failed, or errored.

#### Basic JSend Structure:

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

#### Example using tour data (Success response)

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

#### Why Use JSend?

- Encourages consistency across endpoints

- Makes error handling easier on the frontend

- Separates transport logic (status, message) from business data

---

### Stateless RESTful APIs

One of the **core principles of REST** is that it must be **stateless**.

#### What Does "Stateless" Mean?

In a **stateless API**, the **server does not store any information** about the client's previous requests.  
Each request is **independent** and must contain **all the information** the server needs to understand and respond.

> The server does **not remember** who you are between requests.

---

#### What It Looks Like:

For example:

- If a client sends a request to `GET /api/v1/tours`, it must include **everything** the server needs (like authentication, filters, etc.).
- The server processes it and sends a response, but **does not store any session data**.

---

### Why Stateless?

- **Scalability**: Easier to scale horizontally (across multiple servers)
- **Reliability**: Each request can be retried without depending on past state
- **Security**: Less risk of leaking session data

---

#### Example:

Clients often send authentication info (like a token) **with every request** instead of logging in once and keeping a session.

```http
GET /api/v1/users
Authorization: Bearer <token>
```

### IMPORTANT!

#### A stateless RESTful API:

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

| Component      | Purpose                                                                                                               | Example in this project                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Model**      | Handles **data and business logic** (e.g., reading/writing to JSON or a database)                                     | when the project moves from `tours-simple.json` to MongoDB or another DB                          |
| **View**       | Handles **UI** (what the user sees)                                                                                   | It is usually not used in current API-only setup, but would be used if the project had HTML pages |
| **Controller** | Handles **requests and responses** — all the logic to process input, interact with the model, and return the response | For example: `getAllTours`, `createTour`, etc. functions are **controllers**                      |

---

#### (API-only project):

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

#### Express Middleware Flow

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

#### Example:

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

[Back to the top](#natours-2025)
