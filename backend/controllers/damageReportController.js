const asyncHandler = require('express-async-handler');
const DamageReport = require('../models/damageReport');

// @desc Create a new damage report
// @route POST /damage-reports
// @access Private (Admin)
const createDamageReport = asyncHandler(async (req, res) => {
    const { reporter, orderNumber, studentEmail, itemName, itemId, description, images } = req.body;

    if (!reporter || !orderNumber || !studentEmail || !itemName || !itemId || !description) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const newReport = new DamageReport({
        reporter,
        orderNumber,
        studentEmail,
        itemName,
        itemId,
        description,
        images: images || [],
    });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
});

// @desc Get all damage reports
// @route GET /damage-reports
// @access Private (Admin)
const getAllDamageReports = asyncHandler(async (req, res) => {
    const reports = await DamageReport.find();
    res.status(200).json(reports);
});

// @desc Get a single damage report by ID
// @route GET /damage-reports/:id
// @access Private (Admin)
const getSingleDamageReport = asyncHandler(async (req, res) => {
    const report = await DamageReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Damage report not found');
    }

    res.status(200).json(report);
});


// @desc Delete a damage report by _id
// @route DELETE /damage-reports/:id
// @access Private (Admin)
const deleteDamageReport = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const report = await DamageReport.findById(id);

    if (!report) {
        res.status(404);
        throw new Error('Damage report not found.');
    }

    await DamageReport.deleteOne({ _id: id });
    res.status(200).json({ message: 'Damage report deleted successfully.' });
});

// @desc Update a damage report's description and images
// @route PUT /damage-reports/:id
// @access Private (Admin)
const updateDamageReport = asyncHandler(async (req, res) => {
    const { reporter, orderNumber, studentEmail, itemName, itemId, description, images } = req.body;

    const report = await DamageReport.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Damage report not found');
    }
    report.description = description;
    if (images && Array.isArray(images)) {
        report.images = images[0];
    } else if (images && typeof images === 'string') {
        report.images = [images];
    }

    const updatedReport = await report.save();
    res.status(200).json(updatedReport);
});

module.exports = {
    createDamageReport,
    getAllDamageReports,
    getSingleDamageReport,
    deleteDamageReport,
    updateDamageReport,
};
