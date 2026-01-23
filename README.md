# StudyNest

StudyNest is a full-stack web application developed as part of a university Web Engineering module.  
The project demonstrates a clean separation between frontend and backend, modern tooling, and practical authentication and data handling using Firebase.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vitest

### Backend

- Node.js
- Express
- Firebase Admin SDK
- Firestore

---

## Project Structure

```
studynest/
├── frontend/   # Next.js frontend application
├── backend/    # Node.js / Express backend
```

Both frontend and backend are independent npm projects and must be installed separately.

---

## Installation & Local Development

### Prerequisites

- Node.js (version 18–20 recommended)
- npm

---

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd studynest
```

---

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The backend will run on:

```
http://localhost:4000
```

---

### 3. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```
http://localhost:3000
```

---

## Authentication & Configuration

This project uses Firebase for authentication and data storage.

Sensitive configuration files (e.g. Firebase service account credentials) are intentionally **not included** in this repository.  
To run the backend with full functionality, a valid Firebase Admin configuration must be provided locally.

---

## Security Note

`npm audit` may report moderate vulnerabilities in dev-only dependencies (e.g. Vite, Vitest).  
These do **not** affect production builds.

The Vitest API server is explicitly disabled to mitigate known RCE vectors during development.

---

## Authors

- Houssam Sakah
- Ivan Misic
- Oussama Mabchour
