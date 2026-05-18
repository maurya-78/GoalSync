# 🚀 GoalSync Frontend

A modern and enterprise-grade Goal Management Frontend built using **React, Vite, Redux Toolkit, Tailwind CSS, and React Router DOM**.

🌐 **Live Demo:**  
https://goal-sync-ruby.vercel.app

📦 **Frontend Repository:**  
https://github.com/maurya-78/GoalSync/tree/main/Frontend

---

# ✨ Overview

GoalSync is a modern SaaS-style Goal Management platform designed for organizations, managers, teams, and employees to manage:

- 🎯 Goals & Objectives
- 📊 Analytics & Reports
- 👥 Team Collaboration
- 🔔 Notifications
- 🧑‍💼 Admin Operations
- 📈 Performance Tracking

The frontend is designed with a clean enterprise UI, responsive layouts, reusable components, and scalable architecture.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js | Frontend Library |
| Vite | Fast Build Tool |
| Redux Toolkit | State Management |
| React Router DOM | Routing |
| Tailwind CSS | Styling |
| Axios | API Requests |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| PostCSS | CSS Processing |

---

# 🌟 Features

## 🔐 Authentication System

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Password Reset
- Profile Management

---

## 🎯 Goal Management

- Create Goals
- Edit Goals
- Delete Goals
- Goal Progress Tracking
- Goal Review System
- Goal Analytics

---

## 👨‍💼 Admin Dashboard

- Manage Users
- Manage Teams
- Manage Departments
- Goal Cycle Management
- System Overview

---

## 👥 Team Collaboration

- Manager Dashboard
- Team Monitoring
- Team Goal Reviews
- Employee Tracking

---

## 📊 Analytics

- Performance Insights
- Goal Completion Analytics
- Dashboard Metrics
- Progress Visualization

---

## 🌙 UI/UX Features

- Dark Mode Support
- Responsive Design
- Enterprise Dashboard UI
- Toast Notifications
- Smooth Animations
- Modern Card Components

---

# 📂 Project Structure

```bash
Frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   ├── layouts/
│   │
│   ├── pages/
│   │   
│   │
│   ├── redux/
│   │   
│   │
│   ├── routes/
│   │   
│   │
│   ├── services/
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   └── main.jsx

```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/maurya-78/GoalSync.git
```

---

## 2️⃣ Move to Frontend Folder

```bash
cd GoalSync/Frontend
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Start Development Server

```bash
npm run dev
```

---

# 🌐 Local Development URL

```bash
http://localhost:3000
```

---

# 🔌 Backend Configuration

Update API URL inside:

📁 `src/services/api.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;
```

---

# 🚀 Production Build

```bash
npm run build
```

Build files will be generated inside:

```bash
dist/
```

---

# 📱 Responsive Design

GoalSync frontend is optimized for:

- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

---

# 🧠 State Management

Redux Toolkit handles:

- Authentication State
- Goals State
- Notifications
- Dashboard Data
- User Information

---

# 🔐 Authentication Flow

```text
Register → Login → JWT Token → Protected Dashboard
```

---

# 📦 Available Scripts

| Command | Description |
|---------|-------------|
| npm run dev | Start Development Server |
| npm run build | Build Production App |
| npm run preview | Preview Production Build |

---

# 🎨 Tailwind Features

Custom Tailwind setup includes:

- Primary Brand Colors
- Dark Mode
- Glow Shadows
- Custom Utilities
- Enterprise UI Components

---

# 🚀 Deployment

## Frontend Deployment (Vercel)

🌐 Live URL:

https://goal-sync-ruby.vercel.app

---

# 🛡️ Security

- JWT Authentication
- Protected Routes
- Secure API Requests
- Role-Based Access Control
- Environment Variables

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

- Full Stack Learner
- B.Tech CSE Student

---

# 📄 License

This project is for educational and portfolio purposes only.

---

# ⭐ GoalSync

> Enterprise Goal Management Platform for modern teams & organizations.