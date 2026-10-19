# Personal Pinboard - Full-Stack Architecture

This repository contains the complete full-stack **Personal Pinboard** application, featuring a modern React frontend and a comprehensive Express.js REST API backend connected side-by-side.

---

## 📁 Full Project Structure Overview

```text
personal-pinboard/
├── frontend/                     # React + Vite + Mantine UI + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Reusable UI components (PinForm, Masonry, Cards)
│   │   ├── context/              # React Context (AuthContext, ThemeContext, etc.)
│   │   ├── pages/                # Pages (Feed, Create, Profile, Admin Dashboard)
│   │   ├── services/             # Axios API services connected to backend
│   │   └── utils/constants.js    # API_BASE_URL (http://localhost:5000/api)
│   ├── .env                      # VITE_API_URL=http://localhost:5000/api
│   └── package.json
│
├── backend/                      # Node.js + Express + Database (REST API)
│   ├── config/
│   │   ├── db.js                 # Connects to MongoDB with fallback local persistent engine
│   │   └── seedData.js           # Initial seed data for users, pins, boards, categories
│   │
│   ├── models/                   # Database schemas and data models
│   │   ├── User.js               # User accounts, hashed passwords, roles, bio
│   │   ├── Pin.js                # Pin images, titles, descriptions, likes, tags, privacy
│   │   ├── Board.js              # Moodboard collections, secret/public status
│   │   ├── Category.js           # Visual categories (Architecture, Tech, Art)
│   │   ├── Comment.js            # Comments and star ratings on pins
│   │   ├── Report.js             # Content violation reports sent to admin
│   │   ├── Setting.js            # Platform-wide settings
│   │   └── AuditLog.js           # History logs of admin actions
│   │
│   ├── middleware/               # Security and processing guards
│   │   ├── authMiddleware.js     # JWT token authentication & req.user extraction
│   │   ├── adminMiddleware.js    # Checks req.user.role === 'admin'
│   │   ├── uploadMiddleware.js   # Multer storage for image file uploads
│   │   └── errorMiddleware.js    # Friendly JSON error handler
│   │
│   ├── controllers/              # Controller business logic
│   │   ├── authController.js     # Register, login, me, forgot/reset password, Google, OTP
│   │   ├── pinController.js      # Feed, create, like, rate, edit, delete, comments
│   │   ├── boardController.js    # User boards, create board, save/remove pin
│   │   ├── categoryController.js # Categories CRUD and collaborator members
│   │   ├── userController.js     # Profile view, edit profile, follow, avatar upload
│   │   └── adminController.js    # Admin stats, user moderation, reports, settings
│   │
│   ├── routes/                   # API endpoint URL definitions
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── pinRoutes.js          # /api/pins
│   │   ├── boardRoutes.js        # /api/boards
│   │   ├── categoryRoutes.js     # /api/categories
│   │   ├── userRoutes.js         # /api/users
│   │   ├── adminRoutes.js        # /api/admin
│   │   └── index.js              # Combines all route files together
│   │
│   ├── utils/                    # Helper tools
│   │   ├── generateToken.js      # JWT token generator
│   │   └── topicDetector.js      # Server-side tag and category helper
│   │
│   ├── uploads/                  # Stores uploaded image files
│   │   ├── pins/                 # Uploaded pin images
│   │   └── avatars/              # Uploaded profile avatars
│   │
│   ├── .env                      # PORT=5000, JWT_SECRET, MONGO_URI
│   ├── package.json              # Express, cors, jsonwebtoken, bcryptjs, multer, mongoose
│   └── server.js                 # Main Express server entry point
│
└── package.json                  # Root runner script
```

---

## 🚀 How to Run the Application

### 1. Start the Backend API Server
Open a terminal in the project directory:
```bash
cd backend
npm install
npm start
```
The backend starts on **http://localhost:5000**:
- API endpoints: `http://localhost:5000/api`
- Static uploads: `http://localhost:5000/uploads`
- Health check: `http://localhost:5000/api/health`

### 2. Start the Frontend React App
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on **http://localhost:5173** and communicates directly with the backend at `http://localhost:5000/api`.

---

## 🔑 Default Accounts (Pre-seeded)

| Role | Username | Password | Email | Description |
|---|---|---|---|---|
| **Admin** | `admin` | `password123` | `admin@pinboard.dev` | Platform Administrator & Tech Lead |
| **User** | `user` | `password123` | `user@pinboard.dev` | Sarah Jenkins (Curator & Creator) |

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with email/username & password
- `GET /api/auth/me` - Get authenticated user profile (`Bearer <token>`)
- `POST /api/auth/forgot-password` - Dispatch password reset code
- `POST /api/auth/reset-password` - Reset account password
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/otp-login` - Verified Email OTP login

### Pins (`/api/pins`)
- `GET /api/pins` - Feed with filters (`search`, `type`, `categoryId`, `boardId`, `privacy`, `sort`)
- `GET /api/pins/:id` - Get pin details & increment view count
- `POST /api/pins` - Create new pin
- `PUT /api/pins/:id` - Update pin (owner/admin)
- `DELETE /api/pins/:id` - Delete pin (owner/admin)
- `POST /api/pins/:id/like` - Toggle like / unlike
- `POST /api/pins/:id/rate` - Submit star rating (1 to 5)
- `GET /api/pins/:id/comments` - Get comments for pin
- `POST /api/pins/:id/comments` - Post comment on pin
- `POST /api/pins/:id/report` - Report pin violation
- `POST /api/pins/upload` - Upload image file with Multer

### Moodboards (`/api/boards`)
- `GET /api/boards/user/:userId` - Get user's boards
- `GET /api/boards/:id` - Get board details with saved pins
- `POST /api/boards` - Create new board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board
- `POST /api/boards/:boardId/pins` - Save pin to board
- `DELETE /api/boards/:boardId/pins/:pinId` - Remove pin from board

### Categories (`/api/categories`)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID or slug
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/categories/:id/members` - Add collaborator to category
- `DELETE /api/categories/:id/members/:memberId` - Remove collaborator

### Users (`/api/users`)
- `GET /api/users/:userId` - Get user profile with pins and boards
- `PUT /api/users/profile` - Update user bio, avatar, name
- `PUT /api/users/password` - Change account password
- `POST /api/users/:userId/follow` - Follow/unfollow creator
- `POST /api/users/avatar` - Upload profile avatar image

### Admin (`/api/admin` - Admin Only)
- `GET /api/admin/stats` - Platform KPIs (users, pins, boards, reports)
- `GET /api/admin/users` - User moderation table with filtering & pagination
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:userId/role` - Promote to admin or user
- `PUT /api/admin/users/:userId/status` - Suspend or activate user
- `DELETE /api/admin/users/:userId` - Remove user
- `GET /api/admin/reports` - Content violation reports
- `PUT /api/admin/reports/:id/status` - Resolve or dismiss report
- `GET /api/admin/settings` - Platform settings
- `PUT /api/admin/settings` - Update platform settings
- `GET /api/admin/audit-logs` - View audit logs
- `POST /api/admin/reset-demo-data` - Restore demo dataset
