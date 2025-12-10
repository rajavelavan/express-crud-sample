# Employee Management — Express + Angular (SSR) Starter(PoC)

A small MEAN project (Express + MongoDB backend, Angular frontend with SSR support). Quick reference to run and develop the project.

## Repository layout
- api/ — Express + Mongoose backend
  - [api/server.js](api/server.js) — main Express server
  - [`dbConnect`](api/db/mongodb-connect.js) — MongoDB connection helper
  - [`Employee`](api/models/employee.js) — Mongoose model
  - [api/routes/employeeRoutes.js](api/routes/employeeRoutes.js) — REST endpoints
- ui/ — Angular app with SSR
  - [ui/package.json](ui/package.json) — scripts & deps
  - [ui/angular.json](ui/angular.json) — Angular build/SSR config
  - [ui/src/server.ts](ui/src/server.ts) — SSR entry server
  - [ui/src/environment.ts](ui/src/environment.ts) — client env (BACKEND_URL)
  - [`EmployeeService`](ui/src/app/services/employee-service.ts) — client API layer

## Requirements
- Node.js (recommended >= 18)
- npm
- MongoDB instance (local or remote)

## Environment
- Backend: create `api/.env` with:
  - MONGO_URI=<your-mongo-uri>
- Frontend: default backend URL is in [ui/src/environment.ts](ui/src/environment.ts) (`BACKEND_URL`).

## Run (development)
Start backend:
```bash
# from project root
cd api
npm install
# ensure [.env](http://_vscodecontentref_/0) has MONGO_URI
node [server.js](http://_vscodecontentref_/1)
# server listens on port 5000 (see api/server.js)

