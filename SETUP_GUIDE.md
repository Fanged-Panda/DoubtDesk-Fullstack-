# DoubtDesk - Full Stack Setup Guide

## Quick Start

### Option 1: Run Everything with One Command (Recommended)
```bash
npm run dev
```
This will start both backend and frontend servers concurrently.

**Expected Output:**
- Backend: `Server running on port 3001`
- Frontend: `VITE ready on http://localhost:5173`

### Option 2: Run Servers Separately

**Backend Only:**
```bash
npm run dev:backend
```
Backend will run on `http://localhost:3001`

**Frontend Only:**
```bash
npm run dev:frontend
```
Frontend will run on `http://localhost:5173`

## Initial Setup

### First Time Setup
```bash
npm run setup
```
This installs all dependencies for both frontend and backend.

### Manual Setup
```bash
npm install                    # Install root dependencies
npm --prefix DoubtDeskBackend install   # Install backend deps
npm --prefix ddfrontend/my-project install  # Install frontend deps
```

## Project Structure

```
DoubtDesk-Fullstack/
├── DoubtDeskBackend/           # Node.js/Express backend
│   ├── .env                    # Backend configuration (auto-created)
│   ├── server.js              # Express server entry point
│   ├── config/                # Configuration files
│   ├── models/                # Sequelize database models
│   ├── routes/                # API routes
│   ├── services/              # Business logic services
│   └── database/              # SQLite database file
├── ddfrontend/my-project/      # React/Vite frontend
│   ├── .env                    # Frontend configuration (auto-created)
│   ├── src/                    # React source files
│   │   ├── components/         # React components
│   │   ├── context/           # React context
│   │   └── services/          # API service
│   └── vite.config.js         # Vite configuration
└── package.json               # Root package with shared scripts
```

## Architecture

### Backend (Port 3001)
- **Framework:** Express.js
- **Database:** SQLite (local file: `database/doubtdesk.db`)
- **API Base:** `http://localhost:3001/api`
- **Key Routes:**
  - `/api/auth` - Authentication (register, login, password reset)
  - `/api/students` - Student operations
  - `/api/teachers` - Teacher operations
  - `/api/questions` - Question management
  - `/api/courses` - Course management
  - `/api/payments` - Payment processing
  - `/api/admin` - Admin operations
  - `/api/files` - File uploads

### Frontend (Port 5173)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Router:** React Router v7
- **API Proxy:** Configured to forward `/api/*` to `http://localhost:3001`

## Available Scripts

### Root Level
| Script | Description |
|--------|-------------|
| `npm run dev` | Run both backend and frontend concurrently |
| `npm run dev:backend` | Run only the backend server |
| `npm run dev:frontend` | Run only the frontend dev server |
| `npm run build` | Build frontend for production |
| `npm run setup` | First-time setup (install all dependencies) |
| `npm run start` | Alias for `npm run dev` |
| `npm run install:all` | Reinstall all dependencies |

### Backend Only
```bash
cd DoubtDeskBackend
npm run dev      # Run with nodemon (auto-reload)
npm start        # Run with node (no auto-reload)
npm run db:sync  # Sync database schema
```

### Frontend Only
```bash
cd ddfrontend/my-project
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Configuration Files

### Backend (.env)
Located at: `DoubtDeskBackend/.env`
- `NODE_ENV` - Environment (development/production)
- `PORT` - Backend server port (default: 3001)
- `DB_PATH` - SQLite database location
- `EMAIL_USER` / `EMAIL_PASS` - Gmail SMTP credentials
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URLs` - CORS allowed origins

### Frontend (.env)
Located at: `ddfrontend/my-project/.env`
- `VITE_API_URL` - Backend API base URL (default: `/api/` for proxy)

## Testing

Run the test flow script to validate the application:
```bash
chmod +x test_flow.sh
./test_flow.sh
```

This will test:
1. Course creation
2. Student/Teacher registration
3. Student enrollment
4. Question creation
5. Question solving
6. Status tracking

## Development Workflow

1. **Start Development:**
   ```bash
   npm run dev
   ```

2. **Open in Browser:**
   - Frontend: `http://localhost:5173`
   - Backend Health Check: `http://localhost:3001/health`

3. **Hot Reload:**
   - Frontend: Changes auto-reload in browser
   - Backend: Watched with nodemon, restarts on changes

4. **API Testing:**
   - Use the test script: `./test_flow.sh`
   - Or use Postman/curl to test endpoints

## Troubleshooting

### Ports Already in Use
- Backend port 3001 in use: Change `PORT` in `DoubtDeskBackend/.env`
- Frontend port 5173 in use: Vite will auto-increment the port

### Database Issues
- Delete `DoubtDeskBackend/database/doubtdesk.db` to reset
- Run `npm run dev:backend` again to reinitialize

### CORS Errors
- Ensure frontend URL matches `FRONTEND_URLs` in `DoubtDeskBackend/.env`
- Default is `http://localhost:5173` and `http://localhost:3000`

### Missing Dependencies
```bash
npm run setup
```

### Frontend Shows "Cannot GET /"
- Ensure backend is running on port 3001
- Check proxy configuration in `vite.config.js`

## Deployment

### Build Frontend
```bash
npm run build
```
Output: `ddfrontend/my-project/dist/`

### Environment Variables for Production
Update `.env` files with production values:
- Real database connection
- Strong `JWT_SECRET`
- Production email credentials
- Production frontend URLs for CORS

## Support

For issues or questions, check the project documentation files:
- `IMPLEMENTATION_SUMMARY.md` - Feature implementation details
- `MIGRATION_NOTES.md` - Database migration notes
- `PENDING_QUESTIONS_FEATURE.md` - Feature status
- `QUICK_REFERENCE.md` - Quick API reference
