# natours-2025

## Project Setup: CommonJS First, ES Modules Later

This project follows the [Natours Node.js course](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) by Jonas Schmedtmann.

To stay aligned with the course content and maximize learning, we're starting the development using **CommonJS module syntax** (`require`, `module.exports`). Here's why:

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
