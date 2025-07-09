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
