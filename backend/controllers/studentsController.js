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
    const { classCode, name, email, role } = req.body;

    if (!classCode || !name || !email || !role) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        res.status(400);
        throw new Error('Student with this email already exists');
    }

    const newStudent = new Student({
        classCode,
        name,
        email,
        role
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
});

// @desc Delete a student
// @route DELETE /students/:id
// @access Private
const deleteStudent = asyncHandler(async (req, res) => {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    await Student.deleteOne({ _id: studentId });

    res.status(200).json({ message: `Student ${studentId} deleted` });
});

module.exports = { getStudents, createStudent, deleteStudent };