const asyncHandler = require("express-async-handler");
const ClassCode = require('../models/ClassCode');

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
    const { code, professor, className, packageName } = req.body;

    const existingClassCode = await ClassCode.findOne({ code });
    if (existingClassCode) {
        return res.status(400).json({ error: "Class code already exists" });
    }

    const newClassCode = new ClassCode({
        code,
        professor,
        className, 
        packageName
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

module.exports = { getClassCode, createClassCode, getAllClassCodes };
