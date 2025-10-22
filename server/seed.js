const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Issue = require('./models/Issue');
const Comment = require('./models/Comment');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Issue.deleteMany();
    await Comment.deleteMany();

    // Create users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@bugtrace.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
        role: 'admin',
      },
      {
        username: 'developer1',
        email: 'dev@bugtrace.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'developer',
      },
      {
        username: 'tester1',
        email: 'tester@bugtrace.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'tester',
      },
    ]);

    // Create projects
    const projects = await Project.create([
      {
        name: 'BugTrace Web App',
        description: 'Main web application for bug tracking',
        tags: ['web', 'react', 'node'],
        members: users.map(user => user._id),
      },
      {
        name: 'Mobile App',
        description: 'Mobile application for issue reporting',
        tags: ['mobile', 'react-native'],
        members: [users[0]._id, users[1]._id],
      },
    ]);

    // Create issues
    const issues = await Issue.create([
      {
        title: 'Login page not responsive',
        description: 'The login page does not display properly on mobile devices',
        status: 'Open',
        severity: 'Medium',
        priority: 'P2',
        reporter: users[2]._id,
        assignee: users[1]._id,
        project: projects[0]._id,
      },
      {
        title: 'API timeout error',
        description: 'Getting timeout errors when fetching large datasets',
        status: 'In Progress',
        severity: 'High',
        priority: 'P1',
        reporter: users[2]._id,
        assignee: users[1]._id,
        project: projects[0]._id,
      },
      {
        title: 'Dashboard charts not loading',
        description: 'Analytics charts fail to load on the dashboard',
        status: 'Resolved',
        severity: 'Medium',
        priority: 'P2',
        reporter: users[2]._id,
        assignee: users[1]._id,
        project: projects[0]._id,
      },
    ]);

    // Create comments
    await Comment.create([
      {
        issue: issues[0]._id,
        author: users[1]._id,
        text: 'I will look into this responsive issue.',
      },
      {
        issue: issues[1]._id,
        author: users[1]._id,
        text: 'Working on optimizing the API calls.',
      },
    ]);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});