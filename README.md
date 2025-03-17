# Appointment Calendar with Google Calendar Integration

This project provides a calendar application with Google Calendar integration. It allows users to create, view, update, and delete appointments, which can be synced with their Google Calendar.

## Project Structure

The project is organized into several modules:

- **migrations/appointment-calendar**: Contains database migrations using Knex.js
- **db-repositories/appointment-calendar**: Contains database repositories using Prisma
- **apis/appointment-calendar**: Contains the API server using Express.js
- **apps/appointment-calendar**: Contains the frontend application using React

## Technologies Used

### Backend
- Node.js (v20.x)
- TypeScript
- Express.js
- Prisma (ORM)
- PostgreSQL
- Inversify (Dependency Injection)
- Knex.js (Migrations)
- Google Calendar API

### Frontend
- React.js (v18)
- TypeScript
- Zustand (State Management)
- React Query (Data Fetching)
- React Big Calendar
- Shadcn UI Components
- Tailwind CSS

## Setup and Installation

### Prerequisites
- Node.js (v20.x)
- PostgreSQL
- Google Cloud Platform account (for Google Calendar API)

### Database Setup
1. Create a PostgreSQL database named `calendar_spike`
2. Update the connection details in `db-repositories/appointment-calendar/.env` and `migrations/appointment-calendar/knexfile.js`

### Google Calendar API Setup
1. Create a project in Google Cloud Platform
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Add the redirect URI (e.g., `http://localhost:3002`)
5. Update the credentials in `apis/appointment-calendar/.env`

### Installation and Running

1. Install dependencies:
   ```
   npm install
   ```

2. Run database migrations:
   ```
   cd migrations/appointment-calendar
   npm run migrate:latest
   ```

3. Generate Prisma client:
   ```
   cd db-repositories/appointment-calendar
   npm run prisma:generate
   ```

4. Start the API server:
   ```
   cd apis/appointment-calendar
   npm run dev
   ```

5. Start the frontend application:
   ```
   cd apps/appointment-calendar
   npm run dev
   ```

## Features

- User authentication (email-based)
- Week view calendar
- Create, view, update, and delete appointments
- Google Calendar integration
- Automatic sync of appointments with Google Calendar
- Check availability in Google Calendar

## API Endpoints

### Users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `GET /api/users/google/auth-url` - Get Google OAuth URL
- `POST /api/users/:id/google/connect` - Connect Google Calendar

### Appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/user/:userId` - Get appointments by user
- `GET /api/appointments/user/:userId/range` - Get appointments by date range
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment
- `GET /api/appointments/user/:userId/google-events` - Get Google Calendar events
- `GET /api/appointments/user/:userId/check-availability` - Check availability

### Availability
- `GET /api/availability/:id` - Get availability by ID
- `GET /api/availability/user/:userId` - Get availability by user
- `GET /api/availability/user/:userId/day/:dayOfWeek` - Get availability by day
- `POST /api/availability` - Create availability
- `POST /api/availability/bulk` - Create multiple availability entries
- `PUT /api/availability/:id` - Update availability
- `DELETE /api/availability/:id` - Delete availability
- `DELETE /api/availability/user/:userId` - Delete all availability for a user
