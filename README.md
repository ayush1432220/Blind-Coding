# Blind Coding

A full-stack coding platform with a Node.js/Express/MongoDB backend and a React (Vite) frontend, featuring authentication, coding questions, an admin area, and background job processing.

## Overview

Blind Coding exposes a REST API for authentication, coding questions, code submissions, security, and admin management, backed by MongoDB. A background worker and Redis-based queue (BullMQ) handle asynchronous processing, and the backend is deployable via PM2.

## Features

- JWT-based authentication (`/api/auth`)
- Coding questions and code submission handling (`/api/code`, `/api/questions`)
- Admin routes (`/api/admin`)
- Security-related routes (`/api/security`)
- Request rate limiting and secure HTTP headers (Helmet)
- Background job processing with BullMQ and Redis
- Data export to CSV (json2csv)
- PM2 process management for production

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, jwt-decode

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Helmet, express-rate-limit, express-validator, sanitize-html, BullMQ, Redis (ioredis), PM2

## Project Structure

```text
Blind-Coding/
├── backend/   # Express API, auth, questions, admin, worker
└── frontend/  # React (Vite) client
```

## Installation

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

```env
PORT=
MONGO_URI=
```

## API / Usage

```text
/api/auth/...
/api/code/...
/api/admin/...
/api/questions/...
/api/security/...
```

## Screenshots / Demo

Live demo: [blind-coding-eosin.vercel.app](https://blind-coding-eosin.vercel.app)

## Learning / Purpose

Demonstrates a production-style Express REST API with authentication, admin management, rate limiting, and a Redis-backed background job queue.
