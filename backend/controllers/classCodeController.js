const asyncHandler = require("express-async-handler");
const ClassCode = require('../models/ClassCode');
const Student = require('../models/Student');

// @desc Get a class code by code
// @route GET /class-code/:code
// @access Private
const getClassCode = asyncHandler(async (req, res) => {
    const classCode = await ClassCode.findOne({ code: req.params.code });
    if (!classCode) {
        return res.status(404).json({ error: "Class code not found" });
    }
    res.status(200).json(classCode);
});

// @desc Create new class code
// @route POST /class-code
// @access Private
const createClassCode = asyncHandler(async (req, res) => {
const { code, professor, className } = req.body;

    const existingClassCode = await ClassCode.findOne({ code });
    if (existingClassCode) {
        return res.status(400).json({ error: "Class code already exists" });
    }

    const newClassCode = new ClassCode({
        code,
        professor,
        className

    });

    const savedClassCode = await newClassCode.save();
    res.status(201).json(savedClassCode);
});

// @desc Get all class codes
// @route GET /class-codes
// @access Private
const getAllClassCodes = asyncHandler(async (req, res) => {
    const classCodes = await ClassCode.find();
    res.status(200).json(classCodes);
});

// @desc Update class code information (professor, className)
// @route PUT /class-code/:code
// @access Private
const updateClassCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const { professor, className } = req.body;
    let classCode = await ClassCode.findOne({ code });

    if (!classCode) {
        return res.status(404).json({ error: "Class code not found" });
    }
    if (professor) {
        classCode.professor = professor;
    }

    if (className) {
        classCode.className = className;
    }
    const updatedClassCode = await classCode.save();

    res.status(200).json(updatedClassCode);
});

// @desc Delete a class code by code
// @route DELETE /class-code/:code
// @access Private
const deleteClassCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const classCode = await ClassCode.findOneAndDelete({ code });

    if (!classCode) {
        return res.status(404).json({ error: "Class code not found" });
    }

    try {
        await Student.updateMany(
            { classCodes: code }, 
            { $pull: { classCodes: code } } 
        );
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to remove class code ${code} from students: ${error.message}`);
    }

    res.status(200).json({ message: `Class code ${code} deleted successfully` });
});

// @desc Clear all class codes and remove from students
// @route DELETE /class-codes/clear-all
// @access Private
const clearAllClassCodes = asyncHandler(async (req, res) => {
    try {
        // Remove all class codes
        await ClassCode.deleteMany();

        // Update all students to remove class codes
        await Student.updateMany({}, { $set: { classCodes: [] } });

        res.status(200).json({ message: 'All class codes cleared and removed from students' });
    } catch (error) {
        res.status(500);
        throw new Error('Failed to clear class codes');
    }
});

module.exports = { getClassCode, createClassCode, getAllClassCodes, updateClassCode, deleteClassCode, clearAllClassCodes };
