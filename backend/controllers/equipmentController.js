const asyncHandler = require("express-async-handler");
const Equipment = require('../models/Equipment');

// @desc Create new equipment
// @route POST /equipment
// @access Private
const createEquipment = asyncHandler(async (req, res) => {
    const { itemId, classCode, itemName, pricePerItem, quantity, bundleId, specialPrice } = req.body;

    const newEquipment = new Equipment({
        itemId,
        classCode,
        itemName,
        pricePerItem,
        quantity,
        bundleId,
        specialPrice 
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
});

// @desc Get all equipment for a specific class code
// @route GET /equipment/:classCode
// @access Private
const getEquipmentByClassCode = asyncHandler(async (req, res) => {
    const { classCode } = req.params;
    const equipment = await Equipment.find({ classCode });

    if (!equipment || equipment.length === 0) {
        return res.status(404).json({ error: "No equipment found for this class code" });
    }

    // Group equipment
    const equipmentByBundle = equipment.reduce((acc, item) => {
        if (item.bundleId) {
            if (!acc[item.bundleId]) {
                acc[item.bundleId] = [];
            }
            acc[item.bundleId].push(item);
        }
        return acc;
    }, {});

    // Modify based on special pricing details
    const response = equipment.map(item => {
        if (item.bundleId && equipmentByBundle[item.bundleId].length > 1) {
            return {
                ...item.toObject(),
                specialPrice: item.specialPrice || item.pricePerItem
            };
        }
        return item.toObject();
    });

    res.status(200).json(response);
});

module.exports = { createEquipment, getEquipmentByClassCode };
