# BugTrace - Issue Tracking & QA Portal

A modern bug and issue tracking platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Roles**: Admin, Developer, Tester with role-based access control
- **Issue Management**: Create, update, and track software issues
- **Project Management**: Organize issues within projects
- **Comment System**: Collaborate on issues with threaded comments
- **Dashboard Analytics**: Visual statistics and performance metrics
- **Authentication**: JWT-based secure authentication
- **Responsive UI**: Modern interface built with React and Tailwind CSS

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React.js with React Router
- Tailwind CSS for styling
- Zustand for state management
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bugtrace
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables

Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/bugtrace
JWT_SECRET=your_jwt_secret_here
```

5. Start the backend server
```bash
cd server
npm run dev
```

6. Start the frontend (in a new terminal)
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (Admin only)
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Issues
- `GET /api/issues` - Get all issues
- `POST /api/issues` - Create issue (Tester only)
- `GET /api/issues/:id` - Get issue details
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue (Admin only)
- `GET /api/issues/:id/comments` - Get comments for issue
- `POST /api/issues/:id/comments` - Add comment

## User Roles & Permissions

| Role       | Permissions |
|------------|-------------|
| Admin      | Full access, manage projects and users |
| Developer  | View and update assigned issues |
| Tester     | Create issues, update test status |

## Demo Credentials

- **Admin**: admin@bugtrace.com / password123
- **Developer**: dev@bugtrace.com / password123
- **Tester**: tester@bugtrace.com / password123

## Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.