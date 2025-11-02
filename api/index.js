// Vercel Serverless Function - Main Entry Point
// Tất cả requests đến /api/* sẽ được route đến đây

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/auth/login', routes.login);
app.get('/classes', routes.getClasses);
app.post('/classes', routes.createClass);
app.get('/classes/:classId/students', routes.getStudents);
app.post('/students', routes.createStudent);
app.get('/sessions', routes.getSessions);
app.post('/sessions', routes.createSession);
app.get('/sessions/:sessionId/attendance', routes.getAttendance);
app.post('/attendance/bulk', routes.bulkAttendance);
app.get('/health', routes.health);

// Export handler for Vercel
module.exports = app;

