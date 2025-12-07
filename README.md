# Healthcare Messaging Platform

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A secure doctor-patient messaging platform built with NestJS (backend) and React (frontend), featuring encrypted messaging, appointment notes, and file attachments.

## 📸 Screenshots & Demo

### Application Screenshots

**Login Screen**
![Login Screen](./screenshots/login.png)
*Secure authentication with demo credentials for both doctor and patient roles*

**Messaging Interface**
![Messaging Interface](./screenshots/messaging.png)
*Real-time doctor-patient messaging with conversation history and message threading*

**Appointment Booking**
![Appointment Booking](./screenshots/booking.png)
*Interactive appointment scheduling with date/time selection and appointment type options*

**Appointments Dashboard**
![Appointments Dashboard](./screenshots/appointments.png)
*Comprehensive view of upcoming, past, and current appointments with status indicators*

### Demo Video

📹 **[Watch 2-minute demo video](https://github.com/user-attachments/assets/4fe27a1b-e083-4584-bb4f-8cc7fc24d3eb)**

The demo showcases:
- Patient and doctor authentication flows
- Secure messaging between healthcare providers and patients
- Appointment booking and management
- Role-based access control and navigation
- Responsive design across different screen sizes

## 🏗️ Architecture

This is a monorepo project using pnpm workspaces:

```
healthcare-messaging-platform/
├── server/          # NestJS API backend
├── client/          # React SPA frontend (Vite + TypeScript)
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## 🚀 Features

- **Authentication**: JWT-based auth with role-based access control
- **Roles**: Doctor, Patient, and Admin roles
- **Messaging**: Real-time messaging between doctors and patients
- **File Attachments**: Upload and share PDF, JPG, PNG files
- **Audit Logging**: Track all user actions for compliance
- **Responsive UI**: Modern, mobile-friendly design with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Docker & Docker Compose (optional, for containerized setup)

## 🛠️ Quick Start

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000/api
```

### Local Development

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   # Server
   cp server/.env.example server/.env
   # Edit server/.env with your database credentials
   ```

3. **Setup database**
   ```bash
   # Run migrations
   pnpm db:migrate

   # Seed sample data
   pnpm db:seed
   ```

4. **Start development servers**
   ```bash
   # Start both server and client
   pnpm dev

   # Or start individually
   pnpm server:dev  # Backend: http://localhost:3000
   pnpm client:dev  # Frontend: http://localhost:5173
   ```

## 🔐 Demo Credentials

After running the seed script, you can use these credentials:

| Role    | Email                     | Password    |
|---------|---------------------------|-------------|
| Admin   | admin@healthcare.com      | password123 |
| Doctor  | dr.smith@healthcare.com   | password123 |
| Doctor  | dr.johnson@healthcare.com | password123 |
| Patient | patient1@example.com      | password123 |
| Patient | patient2@example.com      | password123 |

## 📚 API Documentation

### Authentication

| Method | Endpoint         | Description           | Auth |
|--------|------------------|-----------------------|------|
| POST   | /api/auth/register | Register new patient | No   |
| POST   | /api/auth/login    | Login                | No   |
| GET    | /api/auth/me       | Get current user     | Yes  |

### Users

| Method | Endpoint           | Description      | Auth    |
|--------|-------------------|------------------|---------|
| GET    | /api/users/doctors | List all doctors | Yes     |
| GET    | /api/users/patients | List all patients | Doctor/Admin |

### Conversations

| Method | Endpoint                      | Description              | Auth |
|--------|-------------------------------|--------------------------|------|
| POST   | /api/conversations            | Create conversation      | Yes  |
| GET    | /api/conversations            | List user's conversations | Yes  |
| GET    | /api/conversations/:id        | Get conversation details | Yes  |
| PATCH  | /api/conversations/:id/status | Update status           | Yes  |

### Messages

| Method | Endpoint                                          | Description           | Auth |
|--------|---------------------------------------------------|-----------------------|------|
| GET    | /api/conversations/:id/messages                   | Get messages          | Yes  |
| POST   | /api/conversations/:id/messages                   | Send message          | Yes  |
| POST   | /api/conversations/:id/messages/with-attachment   | Send with attachment  | Yes  |
| PATCH  | /api/conversations/:id/messages/:msgId/read       | Mark as read          | Yes  |
| POST   | /api/conversations/:id/messages/mark-read         | Mark all as read      | Yes  |

### Query Parameters

- `limit` - Number of results (default: 50, max: 100)
- `before` - Pagination: ISO timestamp for messages before this date

## 🗄️ Database Schema

### Models

- **User**: Base user with email, password hash, and role
- **PatientProfile**: Patient-specific info (name, DOB, contact)
- **DoctorProfile**: Doctor-specific info (name, specialty, hospital)
- **Conversation**: Links doctor and patient
- **Message**: Text and attachment messages
- **AuditLog**: Action tracking for compliance

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run server tests
pnpm server:test

# Run client tests
pnpm client:test

# Run E2E tests (requires database)
cd server && pnpm test:e2e
```

## 🐳 Docker

### Build Images

```bash
# Build all services
docker-compose build

# Build individual services
docker-compose build server
docker-compose build client
```

### Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Environment Variables

| Variable      | Default                                    | Description      |
|---------------|-------------------------------------------|------------------|
| DATABASE_URL  | postgresql://postgres:postgres@localhost:5432/healthcare_messaging | PostgreSQL connection string |
| JWT_SECRET    | healthcare-secret-key-change-in-production | JWT signing key  |
| PORT          | 3000                                       | Server port      |
| FRONTEND_URL  | http://localhost:5173                      | CORS origin      |

## 🏗️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database
- **Passport** - Authentication
- **JWT** - Token-based auth
- **bcrypt** - Password hashing
- **Multer** - File uploads

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## 📁 Project Structure

```
server/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # Users module
│   ├── conversations/  # Conversations module
│   ├── messages/       # Messages module
│   ├── audit/          # Audit logging module
│   ├── prisma/         # Database service
│   └── common/         # Shared utilities
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── seed.ts         # Seed script
└── test/               # E2E tests

client/
├── src/
│   ├── api/            # API client
│   ├── components/     # Reusable components
│   ├── context/        # React context
│   ├── pages/          # Page components
│   ├── types/          # TypeScript types
│   └── test/           # Tests
└── public/             # Static assets
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Conversation access guards
- File type and size validation
- Audit logging for compliance
- CORS protection

## 📄 License

MIT
