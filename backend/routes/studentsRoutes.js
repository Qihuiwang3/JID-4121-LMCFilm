const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentsController");
const limiter = require('../middleware/rateLimiter');

// Get all students
router.get('/', limiter, studentsController.getStudents);

// Get student by email
router.get('/:email', limiter, studentsController.getStudentClassCodeByEmail);

// Create new student
router.post('/', limiter, studentsController.createStudent);

// Login student route
router.post('/login', limiter, studentsController.loginStudent);

// Delete student by email
router.delete('/:email', limiter, studentsController.deleteStudentByEmail);

// Update student's role by email
router.put('/:email/role', limiter, studentsController.updateStudentRole);

// Update student's name by email
router.put('/:email', limiter, studentsController.updateStudentInfo);

// Add class code to a student by email
router.put('/:email/add-classcode', limiter, studentsController.addClassCode);

// route for removing class code
router.put('/students/:email/remove-classcode', studentsController.removeClassCode); 

module.exports = router;
