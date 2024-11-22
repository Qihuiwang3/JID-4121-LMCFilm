const asyncHandler = require("express-async-handler");
const Student = require('../models/Student');
const jwt = require("jsonwebtoken");

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
    const { classCodes, name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        res.status(400);
        throw new Error('Student with this email already exists');
    }

    const newStudent = new Student({
        classCodes,
        name,
        email,
        password, // Hash the password in production!
        role: role || 'Student'
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
});

// @desc Delete student by email
// @route DELETE /students/:email
// @access Private
const deleteStudentByEmail = asyncHandler(async (req, res) => {
    const student = await Student.findOneAndDelete({ email: req.params.email });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.status(200).json({ message: `Student ${req.params.email} deleted` });
});

// @desc Update student's role by email
// @route PUT /students/:email/role
// @access Private
const updateStudentRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!role || (role !== 'Student' && role !== 'Admin' && role !== 'Professor'  && role !== 'SA')) {
        res.status(400);
        throw new Error('Invalid role');
    }

    const student = await Student.findOneAndUpdate(
        { email: req.params.email },
        { role },
        { new: true }
    );

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.status(200).json(student);
});

// @desc Update student's name by email
// @route PUT /students/:email
// @access Private
const updateStudentInfo = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const student = await Student.findOneAndUpdate(
        { email: req.params.email },
        { name },
        { new: true }
    );

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.status(200).json(student);
});

// @desc Login student
// @route POST /students/login
// @access Public
const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide both email and password');
    }

    const student = await Student.findOne({ email });

    if (!student || student.password !== password) { 
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { email: student.email, role: student.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ 
        token,
        student: {
            email: student.email,
            name: student.name,
            classCodes: student.classCodes,
            role: student.role
        }
    });
});

// @desc Add a class code to a student by email
// @route PUT /students/:email/add-classcode
// @access Private
const addClassCode = asyncHandler(async (req, res) => {
    const { classCode } = req.body;

    const student = await Student.findOne({ email: req.params.email });
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    if (student.classCodes.includes(classCode)) {
        return res.status(400).json({ error: 'Class code already exists in the student\'s class codes' });
    }

    student.classCodes.push(classCode);
    await student.save();

    res.status(200).json(student); 
});

// @desc Remove a class code from a student's classCodes list by email
// @route PUT /students/:email/remove-classcode
// @access Private
const removeClassCode = asyncHandler(async (req, res) => {
    const { classCode } = req.body;
    const student = await Student.findOne({ email: req.params.email });
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    const updatedClassCodes = student.classCodes.filter(code => code !== classCode);

    if (updatedClassCodes.length === student.classCodes.length) {
        return res.status(404).json({ error: 'Class code not found in student\'s class codes' });
    }

    student.classCodes = updatedClassCodes;
    await student.save();

    res.status(200).json(student); 
});

// @desc Get student by email. This will only return classCodes array
// @route GET /students/:email
// @access Private
const getStudentClassCodeByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;

    const student = await Student.findOne({ email }).select('classCodes');

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.status(200).json(student.classCodes);
});


module.exports = {
    getStudents,
    createStudent,
    deleteStudentByEmail,
    updateStudentRole,
    updateStudentInfo,
    addClassCode,
    loginStudent,
    removeClassCode,
    getStudentClassCodeByEmail
};
