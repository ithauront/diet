# 🥗 Diet — RESTful API for Meal Tracking

A backend API built with Fastify, TypeScript, Knex, and SQLite/PostgreSQL to power a meal tracking application.
This project was designed to simulate a full-featured dietary log system with user management, session authentication via cookies, and personal metrics.

   🔗 This backend has a React Native sibling project, built to replicate a similar structure and logic on mobile.
    The mobile frontend, however, was intentionally not connected to this API, as it was developed primarily to practice local storage management on real devices.
    While both projects share logic and naming, their integration was not the focus — instead, the idea was to build parallel frontend/backend projects for learning purposes.

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

## ☁️ Deployment Notes

This project was initially developed using SQLite for ease of local development and testing. However, when preparing the application for production deployment, it was adapted to work with PostgreSQL, hosted via Render.

This change involved:

  * Updating the .env schema to support both sqlite and pg drivers.

  * Making the database connection conditional based on DATABASE_CLIENT.

  * Installing the pg package for PostgreSQL support.

  * Modifying the PORT parsing logic using z.coerce.number() to handle string values from the Render platform.

  * Adding host: '0.0.0.0' to the server config for compatibility with external hosts.

  * Building the TypeScript source with tsup before deployment.

  * Adding production environment variables via the Render dashboard.


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



