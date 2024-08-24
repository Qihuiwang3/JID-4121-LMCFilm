const asyncHandler = require("express-async-handler");
const Student = require('../models/Student');

// @desc Get all students
// @route GET /students
// @access Private
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find();
    res.status(200).json(students);
});

// @desc Create new student
// @route POST /students
// @access Private
const createStudent = asyncHandler(async (req, res) => {
    const { name, role } = req.body;

    const newStudent = new Student({
        name,
        role
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
});

module.exports = { getStudents, createStudent };
