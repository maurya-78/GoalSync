# 🚀 GoalSync Backend

A scalable and enterprise-grade backend API for the GoalSync platform built using **Node.js, Express.js, MongoDB, and JWT Authentication**.

🌐 **Frontend Live Demo:**  
https://goal-sync-ruby.vercel.app

📦 **Backend Repository:**  
https://github.com/maurya-78/GoalSync/tree/main/Backend

---

# ✨ Overview

GoalSync Backend powers the complete enterprise goal management platform with secure authentication, goal management APIs, analytics handling, notifications, and admin operations.

The backend is designed using modern REST API architecture with scalable folder structure and production-ready middleware.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Nodemailer | Email Services |
| dotenv | Environment Variables |
| CORS | Cross-Origin Requests |
| Helmet | Security Headers |
| Morgan | API Logging |
| Cookie Parser | Cookie Handling |
| Nodemon | Development Server |

---

# 🌟 Features

## 🔐 Authentication System

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing
- Forgot Password
- Reset Password
- Protected Routes

---

## 🎯 Goal Management APIs

- Create Goal
- Update Goal
- Delete Goal
- Goal Progress Tracking
- Goal Reviews
- Goal Analytics

---

## 👨‍💼 Admin APIs

- Manage Users
- Manage Teams
- Manage Departments
- Manage Goal Cycles
- Admin Dashboard Data

---

## 🔔 Notification System

- Real-time Notification APIs
- User Notifications
- Team Notifications

---

## 🛡️ Security Features

- Password Encryption
- JWT Authorization
- Protected Middleware
- Secure Headers using Helmet
- Environment Variable Protection

---

# 📂 Project Structure

```bash
Backend/
│
├── src/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   │
│   ├── routes/
│   ├── utils/
│   └── server.js
├── app.js

```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/maurya-78/GoalSync.git
```

---

## 2️⃣ Move to Backend Folder

```bash
cd GoalSync/Backend
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Create `.env` File

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

CLIENT_URL=http://localhost:3000
```

---

## 5️⃣ Start Development Server

```bash
npm run dev
```

---

# 🌐 Backend Running URL

```bash
http://localhost:5000
```

---

# ❤️ Health Check API

```bash
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "GoalSync API is running 🚀"
}
```

---

# 🔐 Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/logout | Logout User |
| GET | /api/auth/me | Current User |
| POST | /api/auth/forgot-password | Forgot Password |
| PUT | /api/auth/reset-password/:token | Reset Password |

---

# 🎯 Goal APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/goals | Get Goals |
| POST | /api/goals | Create Goal |
| PUT | /api/goals/:id | Update Goal |
| DELETE | /api/goals/:id | Delete Goal |

---

# 👨‍💼 Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/users | Get Users |
| GET | /api/admin/teams | Get Teams |
| GET | /api/admin/departments | Get Departments |

---

# 📦 Available Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start Development Server |
| npm start | Start Production Server |

---

# 🛡️ Middleware Used

- Authentication Middleware
- Error Handling Middleware
- JWT Protection Middleware
- Async Error Wrapper

---

# 🧠 Database Design

MongoDB collections:

- Users
- Goals
- Teams
- Departments
- Notifications

---

# 🔒 Authentication Flow

```text
Register → Password Hash → JWT Token → Protected APIs
```

---

# 🚀 Deployment

## Recommended Platforms

- Render
- Railway
- Cyclic
- VPS Hosting

---

# 🌐 Example Deployment URL

```bash
https://your-backend-url.onrender.com
```

---

# 📬 Email Services

Nodemailer used for:

- Forgot Password Emails
- Verification Emails
- Notification Emails

---

# 🚀 Performance Features

- Modular Architecture
- RESTful API Structure
- Optimized Middleware
- Centralized Error Handling
- Secure Authentication Flow

---

# 🤝 Contributing

Contributions are welcome.

```bash
1. Fork Repository
2. Create Feature Branch
3. Commit Changes
4. Push Changes
5. Open Pull Request
```

---

# 👨‍💻 Developer

## Rahul Kumar Maurya

- MERN Stack Learner
- B.Tech CSE Student

---

# 📄 License

This project is for educational and portfolio purposes only.

---

# ⭐ GoalSync Backend

> Enterprise-grade backend architecture for modern goal management systems.