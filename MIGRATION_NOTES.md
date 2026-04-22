# DoubtDesk - Backend Migration Guide

## Java → Node.js Conversion

**Old Backend:** Spring Boot + Maven + MySQL
**New Backend:** Node.js + Express + SQLite

## Backend Setup

```bash
cd DoubtDeskBackend
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:8080`

## Frontend Setup

```bash
cd ddfrontend/my-project
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` (or `http://localhost:3000`)

## Key Changes

| Feature | Old (Java) | New (Node.js) |
|---------|-----------|---------------|
| Database | MySQL | SQLite |
| ORM | Hibernate/JPA | Sequelize |
| Framework | Spring Boot | Express.js |
| Build Tool | Maven | npm |
| File Storage | Filesystem | Filesystem |
| Email | Spring Mail | Nodemailer |

## Database

SQLite file: `DoubtDeskBackend/database/doubtdesk.db`
- Auto-created on first run
- No external DB server needed

## Email Configuration

Add to `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

For Gmail, use [App Passwords](https://support.google.com/accounts/answer/185833)

## All API Endpoints Compatible

Frontend remains unchanged. All 36 endpoints work identically:
- `/api/auth/*` - Authentication
- `/api/students/*` - Student operations
- `/api/questions/*` - Question management
- `/api/courses/*` - Courses
- `/api/admin/*` - Admin dashboard

## Testing Workflow

1. **Register**: POST `/api/auth/register/student`
2. **Login**: POST `/api/auth/login`
3. **Ask Question**: POST `/api/questions`
4. **Teacher solves**: POST `/api/questions/:id/solve`
5. **Verify**: PATCH `/api/questions/:id/status/satisfied`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 in use | `lsof -i :8080` to find process, change PORT in .env |
| Email not sending | Check SMTP credentials in .env |
| Database locked | Restart backend (SQLite single-writer) |
| npm install fails | Delete `node_modules/` and `package-lock.json`, reinstall |
