# 🥗 Diet — RESTful API for Meal Tracking

A backend API built with Fastify, TypeScript, Knex, and SQLite/PostgreSQL to power a meal tracking application.
This project was designed to simulate a full-featured dietary log system with user management, session authentication via cookies, and personal metrics.

   🔗 This backend has a React Native sibling project, built to replicate a similar structure and logic on mobile.
    The mobile frontend, however, was intentionally not connected to this API, as it was developed primarily to practice local storage management on real devices.
    While both projects share logic and naming, their integration was not the focus — instead, the idea was to build parallel frontend/backend projects for learning purposes.

## 📘 Documentation

The full API is documented using Swagger and available publicly:
🔗 [Swagger Docs](https://diet-pilo.onrender.com/docs)

All routes, parameters, expected inputs and outputs are described in English.
⚠️ However, API responses are in Portuguese, as this backend was designed for a Portuguese-speaking application.

## ✅ Features

  ✅ User creation with password hashing

  ✅ Cookie-based session for request authentication

  ✅ Meal creation with:

   title, description, date, time, and dietary status (yes or no)

  ✅ Only authenticated users can manage their own meals

  ✅ Edit and delete meals

  ✅ View a specific meal

  ✅ View all meals for a user

  ✅ Summary route with:

  * Total meals

  * Total inside/outside diet

  * Longest sequence inside diet

  ✅ Input validation with zod

  ✅ API tested with vitest and supertest

  ✅ .env schema validation

  ✅ Database switching (SQLite or PostgreSQL)
 
  ✅ Swagger API Documentation



  ## 🧠 What I Practiced

* Session-based authentication using cookies and Fastify middleware

* Password hashing and secure user identification

* Building RESTful APIs with Fastify and Knex

* Creating and managing database schemas and migrations

* Writing and organizing integration tests with Vitest and Supertest

* Validating environment variables using Zod

* Designing summary and metric routes with business logic

* Structuring a backend project that simulates production behavior

* Building parallel frontend/backend projects with distinct learning goals (e.g., local storage vs. full API integration)
  
* Using Swagger to document and expose backend routes


## 🛠 Tech Stack

  * Fastify — lightweight Node.js framework

  * Knex — SQL query builder

  * SQLite (or PostgreSQL)

 *  Zod — validation

  * Vitest + Supertest — testing

  * TypeScript

  * TSX — for development and loading

  * Tsup — for build bundling

## 🚀 Getting Started

#### 🔧 Clone the repository
```bash
git clone https://github.com/ithauront/diet.git
# Navigate to repository folder
cd diet
```
#### 📦 Install dependencies
``` bash
npm install
```
#### ⚙️ Setup environment

Create two environment files in the project root: `.env` and `.env.test`.  
You can follow the structure provided in `.env.example` and `.env.test.example`.

For development:
```env
DATABASE_URL="./db/app.db"
NODE_ENV="development"
DATABASE_CLIENT="sqlite"
API_KEY=dev_dummy_key
```

For tests:
```env
DATABASE_URL="./db/test.db"
DATABASE_CLIENT="sqlite"
NODE_ENV="test"
```

ℹ️ If your project does not require an external API, API_KEY can be set to any dummy value during development.
In production, replace it with a valid key provided by your service.



#### 🧱 Run migrations
```bash
npm run knex migrate:latest
```

#### 💻 Start development server
```bash
npm run dev
```

## 📡 Live API

The Diet API is deployed and live on Render:

🔗 https://diet-pilo.onrender.com

 ⚠️ This API does not expose a public / route and will return a 404 if accessed directly without a defined path.

📘 Swagger Documentation:

🔗 https://diet-pilo.onrender.com/docs

This deployment uses a PostgreSQL database hosted on Render's managed database service. All routes are protected and require proper session authentication via cookies.

To test the API, you can use tools like Insomnia or Postman.
The first step is to create a user via the /users route and use the returned userId to authenticate.


#### ☁️ Deployment Notes

This project was initially developed using SQLite for simplicity during local development.
When preparing for production deployment, it was refactored to support PostgreSQL on Render, a cloud platform that automates server hosting.
🔄 Migration Steps from SQLite to PostgreSQL:

* Updated the environment schema to include DATABASE_CLIENT with support for sqlite and pg.

* Adjusted the database connection logic in database.ts to switch between SQLite and PostgreSQL depending on DATABASE_CLIENT.

* Installed the PostgreSQL driver (pg) as a production dependency.

* Added host: '0.0.0.0' in the server listener to allow external connections from Render.

* Converted the PORT variable to use z.coerce.number() so it could parse the string passed by Render.

* Created a build script using tsup for bundling the TypeScript code before deploying.

* Added a start script to run node dist/server.js after the build.

* Added a .eslintignore and .gitignore entry for dist, node_modules, and .db files.

* Configured Render’s deployment pipeline to:

     Install dependencies (npm install)

     Run latest migrations (npm run knex -- migrate:latest)

     Build the project (npm run build)

     Start the app


## 🧪 Running Tests

To run the Vitest test suite:
```bash
npm run test
```
This will run integration tests that validate user authentication, meal creation, retrieval, and metrics logic.

## 🔗 Related Projects

#### 🧭 Frontend Sibling (React Native)
The mobile version of this project was developed in parallel, using React Native.
It replicates the meal-tracking flow and data model using AsyncStorage instead of a backend.
This approach was intentional to focus on local persistence and mobile-first architecture.
No integration between frontend and backend was made.



