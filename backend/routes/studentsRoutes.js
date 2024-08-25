const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentsController");
const limiter = require('../middleware/rateLimiter');

router.get('/', limiter, studentsController.getStudents);
router.post('/', limiter, studentsController.createStudent);

module.exports = router;
