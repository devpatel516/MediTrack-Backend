# MediTrack Backend

Backend API for MediTrack, a medical visit tracking app used by doctors and patients.

This service provides:

- user registration and login
- JWT-based authentication
- doctor-only visit creation
- patient medical history lookup
- AI-assisted transcript extraction for diagnosis and notes
- doctor visit listing for follow-ups

The Flutter frontend for this project lives in a separate repository:

- Frontend repo: https://github.com/devpatel516/MediTrack

[![Download APK](https://img.shields.io/badge/Download-APK-green.svg)](https://github.com/devpatel516/MediTrack/releases)

You can download the latest `.apk` from the [Releases page](https://github.com/devpatel516/MediTrack/releases).

## Demo Video

[Watch the Demo Video](https://drive.google.com/file/d/1UrdfOEzl_o4VXRdpN0aqSI72riuy66Oq/view?usp=drivesdk)

## Test Credentials

To quickly test the application without registering, use the following test credentials:

**DOCTOR**
- **Email:** `mohan.desai@gmail.com`
- **Password:** `doctor123`

**PATIENT**
- **Email:** `raj.patel@gmail.com`
- **Password:** `patient123`

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Google Gemini API

## Project Structure

```text
medical-backend/
|-- controllers/
|-- middleware/
|-- models/
|-- routes/
|-- .env.sample
|-- package.json
`-- server.js
```

## Prerequisites

Make sure you have these installed:

- Node.js 18 or later
- npm
- MongoDB Atlas or a local MongoDB instance

## Environment Variables

Create a `.env` file in the project root.

You can start from `.env.sample`:

```env
PORT=
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

Recommended example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/meditrack
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## Backend Setup

1. Clone this repository.
2. Install dependencies.
3. Create `.env` from `.env.sample`.
4. Add your MongoDB connection string, JWT secret, and Gemini API key.
5. Start the server.

```bash
git clone https://github.com/devpatel516/MediTrack-Backend.git
cd medical-backend
npm install
npm run dev
```

For production-style startup:

```bash
npm start
```

By default, the API runs on:

```text
http://localhost:3000
```

## API Base URL

All routes are served under:

```text
http://localhost:3000/api
```

## API Endpoints

### Auth

`POST /api/auth/register`

Request body:

```json
{
  "name": "Dr. John Doe",
  "email": "doctor@example.com",
  "password": "password123",
  "role": "doctor"
}
```

`POST /api/auth/login`

Request body:

```json
{
  "email": "doctor@example.com",
  "password": "password123"
}
```

Success response includes:

```json
{
  "token": "jwt-token",
  "role": "doctor",
  "userId": "user-id",
  "name": "Dr. John Doe"
}
```

### Visits

Protected routes require:

```text
Authorization: Bearer <jwt_token>
```

`POST /api/visits/create`

Doctor-only route to create a visit.

Request body:

```json
{
  "patientEmail": "patient@example.com",
  "notes": "Patient has mild fever and sore throat.",
  "medicines": [
    {
      "name": "Paracetamol",
      "timing": "After food",
      "schedule": "Twice a day"
    }
  ],
  "nextVisitDate": "2026-06-20T00:00:00.000Z"
}
```

`GET /api/visits/history/:patientId`

- Patients can only access their own history.
- Doctors can access patient history by patient ID.

`POST /api/visits/ai`

Uses Gemini to extract structured diagnosis and notes from a transcript.

Request body:

```json
{
  "transcript": "Patient reports sore throat for three days..."
}
```

Expected response shape:

```json
{
  "diagnosis": "Viral Pharyngitis",
  "notes": "Summary of observations and advice"
}
```

`GET /api/visits/doctor-visits`

Returns visits sorted by upcoming `nextVisitDate`.

## Frontend Setup

The frontend is a separate Flutter app:

- Repo: https://github.com/devpatel516/MediTrack

### Frontend Prerequisites

- Flutter SDK
- Dart SDK
- Android Studio or VS Code with Flutter support
- Android emulator, iOS simulator, or physical device

Check your Flutter setup:

```bash
flutter doctor
```

### Run the Frontend

1. Clone the frontend repository.
2. Install Flutter dependencies.
3. Point the frontend to your local backend.
4. Run the app.

```bash
git clone https://github.com/devpatel516/MediTrack.git
cd MediTrack
flutter pub get
flutter run
```

### Connect Frontend to This Backend

In the frontend repo, update `lib/api_service.dart`.

It currently uses a deployed API:

```dart
static const String baseUrl = 'https://meditrack-api-gxb1.onrender.com/api';
```

For local backend development, change it to:

```dart
static const String baseUrl = 'http://localhost:3000/api';
```

Use the correct host for your device:

- Android emulator: `http://10.0.2.2:3000/api`
- iOS simulator: `http://localhost:3000/api`
- Physical device: `http://<your-computer-local-ip>:3000/api`

### Suggested Full Local Flow

Terminal 1:

```bash
cd medical-backend
npm run dev
```

Terminal 2:

```bash
cd MediTrack
flutter pub get
flutter run
```

## Notes

- The backend enables CORS globally.
- MongoDB must be reachable before the server can connect successfully.
- `GEMINI_API_KEY` is required for `/api/visits/ai`.
- There are currently no automated tests configured in this backend project.
