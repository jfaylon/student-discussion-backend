# Student Discussion Backend

A Node.js + TypeScript backend for the Student Discussion LMS system, built with Express, Sequelize (PostgreSQL), and Docker support.


## 📥 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jfaylon/student-discussion-backend.git
cd student-discussion-backend
```

### 2. Choose how to run the application:

- [Run with Docker](#option-a-run-with-docker) – preferred and isolated
- [Run locally (dev mode)](#option-b-run-locally-dev-mode) – for development

---

---

## ⚙️ Tech Stack

| Layer         | Technology            |
|---------------|------------------------|
| Language      | TypeScript (Node.js 22)|
| Framework     | Express.js             |
| ORM           | Sequelize              |
| Database      | PostgreSQL             |
| Auth          | Passport.js + JWT      |
| Environment   | dotenv                 |
| Dockerization | Docker + Dockerfile    |
| Dev Tools     | ts-node, nodemon       |
| API Client    | Axios (frontend)       |

---

## Features

- RESTful API using Express
- PostgreSQL database via Sequelize ORM
- Authentication using Passport (local strategy + JWT)
- Environment-based configuration (`.env`, `.env.docker`)
- Dockerized with runtime seeding support
- TypeScript development with `ts-node` or compiled output

---

## ▶️ Running the Application

There are **two ways** to run the backend:

---

### ✅ Option A: Run with Docker

This is the preferred method if you want an isolated environment.

#### 1. Copy the Docker environment file

```bash
cp .env.docker.example .env.docker
```

> You can edit `.env.docker` to configure ports, DB settings, or enable seeding.

#### 2. Build the Docker image

```bash
docker build -t lms-backend --build-arg ENV=docker .
```

#### 3. Run the containers

```bash
# (Once) create Docker network
docker network create lms-network

# Run PostgreSQL
docker run -d --name lms-postgres \
  --network lms-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=lmsdb \
  -p 5432:5432 \
  postgres:15

# Run backend
docker run --rm --name backend \
  --network lms-network \
  -p 8000:8000 \
  lms-backend

# Run the seed script
docker exec -it backend npm run seed
```

---

### Option B: Run Locally (Dev Mode)

This is ideal for development using `ts-node` and `nodemon`.

#### 🔧 Requirements

- Install **Node.js v22** or later
- Install **PostgreSQL** locally (or connect to Docker container)

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure your environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

> You can edit `.env.local` to configure your local DB connection, port, or JWT secret.

#### 3. Run the app in dev mode

```bash
npm run dev
```

You can also manually seed the database. If you want to reset the seeds. The ENV RESET_SEED should be true.

```bash
npm run seed
```

---


## 📁 Project Structure

```
backend/
├── src/                # Source code (Express app, routes, db, etc.)
├── scripts/            # Optional: DB setup or helper scripts
├── .env                # Local development env
├── .env.docker         # Docker-specific env
├── Dockerfile
├── tsconfig.json
└── package.json
```

---

## 🔧 Environment Variables

Environment values are loaded using `dotenv`.

### Example `.env.docker`

```
PORT=8000
DB_HOST=lms-postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=lmsdb
JWT_SECRET=supersecret
RESET_SEED=true
SEED_ADMIN_PASSWORD=
SEED_INSTRUCTOR_PASSWORD=
CORS_ORIGIN=http://localhost:3000
```

---

## 📜 Available Scripts

| Script           | Description                                 |
|------------------|---------------------------------------------|
| `npm run dev`    | Run in dev mode using `ts-node` + `nodemon` |
| `npm run build`  | Compile TypeScript to `dist/`               |
| `npm start`      | Run compiled app from `dist/`               |
| `npm run seed`   | Run seed script manually                    |


## Assumptions
- I found in the data that a user has been deleted but is still active/enrolled in a course. The user id is 47263. Thus, it maybe the case if the business rule permits it.
- The admin account has a special role status in the database to differentiate a system role from a course role.
- Since there are no passwords in the seed files, I have created a "Credential" table that contains the identity and the password.

## Notes
- As per the requirement, only 2 accounts are created. Instructor account: x14gpx0a
Admin account: admin
- The accounts are created via seeding then it can be accessed.
