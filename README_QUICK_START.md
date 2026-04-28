# DoubtDesk - Full Stack Application

## 🚀 Quick Start (One Command!)

### Start Everything
```bash
npm run dev
```

That's it! This will start:
- **Backend API**: `http://localhost:3001`
- **Frontend**: `http://localhost:5173`

Both servers run simultaneously with hot-reload enabled.

---

## 📋 What Was Fixed

✅ **Created `.env` files** with proper configuration
- Backend: `DoubtDeskBackend/.env`
- Frontend: `ddfrontend/my-project/.env`

✅ **Added `concurrently` package** to run both servers at once

✅ **Updated root `package.json`** with unified npm scripts:
- `npm run dev` - Run both servers together
- `npm run dev:backend` - Backend only
- `npm run dev:frontend` - Frontend only
- `npm run setup` - First-time setup
- `npm run build` - Build for production

✅ **Created helper scripts**:
- `start.sh` - Bash script for easy launching
- `SETUP_GUIDE.md` - Complete setup documentation

✅ **Verified everything works**:
- ✓ Backend syncs database on startup
- ✓ Frontend connects to backend via proxy
- ✓ Hot module reloading enabled
- ✓ All routes accessible

---

## 🎯 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start full-stack (both servers) |
| `npm run dev:backend` | Backend API only (port 3001) |
| `npm run dev:frontend` | Frontend only (port 5173) |
| `npm run build` | Build frontend for production |
| `npm run setup` | Install all dependencies |
| `npm run install:all` | Reinstall all packages |

---

## 🔧 Project Structure

```
DoubtDesk-Fullstack/
├── DoubtDeskBackend/           # Express.js API server
│   ├── .env                    # Backend config (auto-created)
│   ├── server.js              # Entry point
│   ├── config/                # Database configuration
│   ├── models/                # Sequelize ORM models
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   └── database/              # SQLite database (auto-created)
│
├── ddfrontend/my-project/      # React + Vite frontend
│   ├── .env                    # Frontend config (auto-created)
│   ├── vite.config.js         # Vite configuration with proxy
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/api.js    # Axios API client
│   │   └── context/           # React context
│   └── package.json
│
└── package.json               # Root scripts for unified control
```

---

## 🖥️ Architecture

### Backend (Port 3001)
- **Framework**: Express.js
- **Database**: SQLite (local file)
- **ORM**: Sequelize
- **Authentication**: JWT tokens
- **API Prefix**: `/api/`

**Main Routes:**
- `/api/auth` - Login, registration, password reset
- `/api/students` - Student profile & enrollment
- `/api/teachers` - Teacher profile & pending questions
- `/api/questions` - Question management
- `/api/courses` - Course catalog
- `/api/payments` - Payment processing
- `/api/admin` - Admin operations
- `/api/files` - File uploads

### Frontend (Port 5173)
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **API Proxy**: `/api/*` → `http://localhost:3001/api`

---

## 🔐 Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DB_PATH=./database/doubtdesk.db
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URLs=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=/api/
```

---

## 🧪 Testing

Run the test flow script to validate all features:
```bash
chmod +x test_flow.sh
./test_flow.sh
```

This tests:
1. Course creation
2. Student/Teacher registration
3. Enrollment & payments
4. Question creation & solving
5. Status tracking

---

## 📱 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | Main application UI |
| **Backend API** | http://localhost:3001/api | API endpoints |
| **Health Check** | http://localhost:3001/health | API status |
| **Uploads** | http://localhost:3001/uploads | File storage |

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on specific port
lsof -ti:3001 | xargs kill -9   # For port 3001
lsof -ti:5173 | xargs kill -9   # For port 5173
```

### Database Issues
```bash
# Reset database
rm DoubtDeskBackend/database/doubtdesk.db
npm run dev:backend  # Reinitialize
```

### Dependencies Missing
```bash
npm run setup  # Reinstall everything
```

### Frontend Can't Connect to API
- Ensure backend is running on port 3001
- Check CORS configuration in `DoubtDeskBackend/.env`
- Verify proxy in `vite.config.js`

---

## 📦 Installation from Scratch

```bash
# Clone/navigate to project
cd DoubtDesk-Fullstack-

# Full setup (recommended first time)
npm run setup

# Start development
npm run dev
```

---

## 🚢 Production Build

```bash
# Build frontend
npm run build

# Output location: ddfrontend/my-project/dist/

# For production backend, update .env with:
# - Strong JWT_SECRET
# - Production database connection
# - Real email credentials
# - Production frontend URLs for CORS
```

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Feature details
- **[MIGRATION_NOTES.md](./MIGRATION_NOTES.md)** - Database migrations
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - API quick reference

---

## ✨ Features Included

- ✅ Student registration & login
- ✅ Teacher registration & login
- ✅ Admin dashboard
- ✅ Course management
- ✅ Question posting
- ✅ Answer submission
- ✅ Payment processing
- ✅ File uploads
- ✅ Password reset via email
- ✅ JWT authentication
- ✅ Role-based access control

---

## 🎓 Next Steps

1. **Start the app**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Register** as Student/Teacher/Admin
4. **Test features** using the application UI
5. **Run tests**: `./test_flow.sh`

---

## 📞 Support

For issues:
1. Check `.env` files are present
2. Verify ports 3001 and 5173 are free
3. Review database exists at `DoubtDeskBackend/database/doubtdesk.db`
4. Check server console output for errors

---

**Happy coding! 🚀**
