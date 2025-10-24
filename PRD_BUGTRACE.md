# BugTrace – Issue Tracking & QA Portal

---

## 1. Project Overview

**Project Name:** BugTrace  
**Type:** Full Stack Web Application  

**Tech Stack:**
- **Frontend:** React.js + Tailwind CSS + Zustand/Redux + React Query  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB Atlas (Mongoose ODM)  
- **Authentication:** JWT + bcrypt  
- **Deployment:**  
  - Frontend → Vercel  
  - Backend → Render / Railway  
- **Version Control:** Git + GitHub  

**Description:**  
BugTrace is a **modern bug and issue tracking platform** designed for software teams to efficiently manage, prioritize, and resolve software bugs.  
It allows Admins, Developers, and Testers to collaborate through structured workflows, ensuring transparency and accountability throughout the bug resolution lifecycle.

---

## 2. Objectives

- Provide a centralized platform for managing software issues.  
- Enable collaboration among team members with distinct roles.  
- Maintain visibility into bug status, history, and performance metrics.  
- Ensure secure authentication and data management.  
- Offer a responsive and intuitive UI/UX for real-world usability.

---

## 3. User Roles & Permissions

| Role       | Description                 | Key Permissions                                   |
|------------|-----------------------------|--------------------------------------------------|
| Admin      | Project owner or manager    | Create/delete projects, assign users, manage roles, full access |
| Developer  | Fixes bugs assigned to them | View assigned issues, change status, add comments |
| Tester     | Reports bugs and verifies fixes | Create issues, update test status, comment on issues |

---

## 4. Core Functionalities

### 4.1 Issue Management
- CRUD for issues  
- Issue attributes:  
  - Title  
  - Description  
  - Status (`Open`, `In Progress`, `Resolved`, `Closed`)  
  - Severity (`Low`, `Medium`, `High`, `Critical`)  
  - Priority (`P1`, `P2`, `P3`)  
  - Reporter (Tester ID)  
  - Assignee (Developer ID)  
  - Attachments (screenshots, logs)  
  - Created/Updated timestamps  

### 4.2 Project Management
- Admins can create projects  
- Project attributes:  
  - Name, description, tags  
  - Team members (with roles)  
  - Issue list (linked via Project ID)  

### 4.3 Comment System
- Add comments to issues  
- Comment attributes: author, text, timestamp  

### 4.4 Authentication & Authorization
- JWT-based authentication  
- Passwords hashed with bcrypt  
- Role-based access control (RBAC) via middleware  

### 4.5 Analytics Dashboard
- Issue statistics (Open vs Closed)  
- Developer performance metrics (average resolution time)  
- Severity distribution charts  
- Project activity logs  

### 4.6 File Management
- File uploads for issue attachments (Multer + Cloudinary)  

### 4.7 Notifications (Optional)
- Email notifications for:  
  - New issue assigned  
  - Issue status changed  
  - Comment added  

---

## 5. System Architecture

### Frontend Flow
```text
React → Zustand/Redux (state) → React Query (server cache) → REST API → Express Backend → MongoDB

Backend Architecture
/server
├── server.js
├── config/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js
│   ├── issueController.js
│   ├── projectController.js
│   └── commentController.js
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Issue.js
│   └── Comment.js
├── routes/
│   ├── authRoutes.js
│   ├── issueRoutes.js
│   ├── projectRoutes.js
│   └── commentRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
└── utils/
    ├── sendEmail.js
    └── logger.js

6. Database Schema Design (Mongoose)
User Schema
{
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'developer', 'tester'], default: 'tester' },
  assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: Date
}

Project Schema
{
  name: String,
  description: String,
  tags: [String],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
  createdAt: Date
}

Issue Schema
{
  title: String,
  description: String,
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  priority: { type: String, enum: ['P1', 'P2', 'P3'] },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  attachments: [String],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: Date,
  updatedAt: Date
}

Comment Schema
{
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: Date
}

7. REST API Endpoints
Auth

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register user       |
| POST   | `/api/auth/login`    | Login & receive JWT |

Projects
| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/api/projects`     | Get all projects                |
| POST   | `/api/projects`     | Create new project (Admin only) |
| GET    | `/api/projects/:id` | Get single project              |
| PUT    | `/api/projects/:id` | Update project                  |
| DELETE | `/api/projects/:id` | Delete project                  |

Issues
| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/api/issues`     | Get all issues                  |
| POST   | `/api/issues`     | Create issue (Tester only)      |
| GET    | `/api/issues/:id` | Get issue details               |
| PUT    | `/api/issues/:id` | Update issue (status, assignee) |
| DELETE | `/api/issues/:id` | Delete issue (Admin only)       |

Comments
| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| POST   | `/api/issues/:id/comments` | Add comment            |
| GET    | `/api/issues/:id/comments` | Get comments for issue |

8. Frontend Architecture
/client
├── src/
│   ├── api/
│   │   ├── authAPI.js
│   │   ├── issueAPI.js
│   │   └── projectAPI.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── IssueCard.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── CommentBox.jsx
│   │   └── DashboardCharts.jsx
│   ├── context/ or store/
│   │   └── useAuthStore.js (Zustand)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── Issues.jsx
│   │   ├── IssueDetails.jsx
│   │   ├── CreateIssue.jsx
│   │   └── Profile.jsx
│   ├── utils/
│   │   └── formatDate.js
│   ├── App.jsx
│   └── main.jsx

9. Dashboard Metrics

Total issues by status

Average resolution time

Most active users

Issues by severity

Project activity heatmap

11. Success Criteria

Fully deployed on Render/Vercel

Secure authentication & role-based access

Clean, responsive UI

Fully documented API endpoints

Demo data:

≥2 projects

≥5 issues

Multiple users with different roles

12. Deliverables

GitHub Repo (frontend + backend)

Deployment Links:

Frontend (Vercel)

Backend (Render / Railway)

README.md with setup, tech stack, features, screenshots, and demo credentials