# DoubtDesk Backend - Node.js + Express

Node.js + Express backend with SQLite database for the DoubtDesk application.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
- `EMAIL_USER`, `EMAIL_PASS`: Gmail SMTP credentials (optional for dev)
- `PORT`: Server port (default: 3001)

4. Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Database

SQLite with Sequelize ORM. Database auto-created in `database/doubtdesk.db` on first run.

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register/student` | Register student |
| POST | `/api/auth/login` | Login (all roles) |
| POST | `/api/auth/forgot-password` | Password reset request |
| GET | `/api/students/profile?email=...` | Get student profile |
| GET | `/api/teachers/profile?email=...` | Get teacher profile |
| POST | `/api/questions` | Create question |
| GET | `/api/questions/by-student?email=...` | Student's questions |
| GET | `/api/questions/pending?email=...` | Pending questions |
| POST | `/api/questions/:id/solve` | Submit solution |
| GET | `/api/courses` | All courses |
| POST | `/api/courses` | Create course |
| POST | `/api/payments` | Enroll in course |
| GET | `/api/admin/students` | All students (admin) |
| GET | `/api/admin/questions` | All questions (admin) |
| POST | `/api/files/upload` | Upload file |
