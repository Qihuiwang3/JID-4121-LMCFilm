const asyncHandler = require("express-async-handler");
const SingleItem = require('../models/SingleItem');
const BundleItem = require('../models/BundleItem');

// @desc Create new single item
// @route POST /single-item
// @access Private
const createSingleItem = asyncHandler(async (req, res) => {
    const { itemId, classCode, itemName, pricePerItem, quantity } = req.body;

    const newSingleItem = new SingleItem({
        itemId,
        classCode,
        itemName,
        pricePerItem,
        quantity,
    });

    const savedSingleItem = await newSingleItem.save();
    res.status(201).json(savedSingleItem);
});

// @desc Get all single items for a specific class code
// @route GET /single-items/:classCode
// @access Private
const getSingleItemsByClassCode = asyncHandler(async (req, res) => {
    const { classCode } = req.params;
    const singleItems = await SingleItem.find({ classCode });

    if (!singleItems || singleItems.length === 0) {
        return res.status(404).json({ error: "No single items found for this class code" });
    }

    res.status(200).json(singleItems);
});

// @desc Purchase a single item and decrease its quantity
// @route POST /purchase-single/:itemName
// @access Private
const purchaseSingleItem = asyncHandler(async (req, res) => {
    const { itemName } = req.params;
    const { quantity } = req.body;  // Quantity to purchase
    const { classCode } = req.body;

    const singleItem = await SingleItem.findOne({ itemName, classCode });

    if (!singleItem) {
        return res.status(404).json({ error: `Item ${itemName} not found for class code ${classCode}.` });
    }

    if (singleItem.quantity < quantity) {
        return res.status(400).json({ error: `Not enough quantity available for ${itemName}. Available: ${singleItem.quantity}, Requested: ${quantity}` });
    }

    singleItem.quantity -= quantity;
    await singleItem.save();

    res.status(200).json({ message: `${quantity} units of ${itemName} purchased successfully. Remaining quantity: ${singleItem.quantity}` });
});

// @desc Return a single item and increase its quantity
// @route POST /return-single/:itemName
// @access Private
const returnSingleItem = asyncHandler(async (req, res) => {
    const { itemName } = req.params;
    const { quantity, classCode } = req.body;  // Quantity to return

    const singleItem = await SingleItem.findOne({ itemName, classCode });

    if (!singleItem) {
        return res.status(404).json({ error: `Item ${itemName} not found for class code ${classCode}.` });
    }

    singleItem.quantity += quantity;
    await singleItem.save();

    res.status(200).json({ message: `${quantity} units of ${itemName} returned successfully. Updated quantity: ${singleItem.quantity}` });
});

// @desc Create new bundle item
// @route POST /bundle-item
// @access Private
const createBundleItem = asyncHandler(async (req, res) => {
    const { bundleId, classCode, bundleName, items, price } = req.body;

    // Check if all items are available
    for (const item of items) {
        const singleItem = await SingleItem.findOne({ itemName: item.itemName, classCode });
        if (!singleItem || singleItem.quantity < item.quantity) {
            return res.status(400).json({ error: `Item ${item.itemName} is not available in the required quantity.` });
        }
    }

    const newBundleItem = new BundleItem({
        bundleId,
        classCode,
        bundleName,
        items,
        price,
    });

    const savedBundleItem = await newBundleItem.save();
    res.status(201).json(savedBundleItem);
});

// @desc Get all bundle items for a specific class code
// @route GET /bundle-items/:classCode
// @access Private
const getBundleItemsByClassCode = asyncHandler(async (req, res) => {
    const { classCode } = req.params;
    const bundleItems = await BundleItem.find({ classCode });

    if (!bundleItems || bundleItems.length === 0) {
        return res.status(404).json({ error: "No bundle items found for this class code" });
    }

    res.status(200).json(bundleItems);
});

// @desc Purchase a bundle item and decrease quantity of each single item in the bundle
// @route POST /purchase-bundle/:bundleId
// @access Private
const purchaseBundleItem = asyncHandler(async (req, res) => {
    const { bundleId } = req.params;
    const bundleItem = await BundleItem.findOne({ bundleId });

    if (!bundleItem) {
        return res.status(404).json({ error: "Bundle item not found" });
    }

    // Check if all items in the bundle are available
    for (const item of bundleItem.items) {
        const singleItem = await SingleItem.findOne({ itemName: item.itemName, classCode: bundleItem.classCode });
        if (!singleItem || singleItem.quantity < item.quantity) {
            return res.status(400).json({ error: `Item ${item.itemName} is not available in the required quantity.` });
        }
    }

    // Decrease the quantity of each single item
    for (const item of bundleItem.items) {
        await SingleItem.updateOne(
            { itemName: item.itemName, classCode: bundleItem.classCode },
            { $inc: { quantity: -item.quantity } }
        );
    }

    res.status(200).json({ message: "Bundle purchased successfully!" });
});

// @desc Return a bundle item and increase quantity of each single item in the bundle
// @route POST /return-bundle/:bundleId
// @access Private
const returnBundleItem = asyncHandler(async (req, res) => {
    const { bundleId } = req.params;
    const bundleItem = await BundleItem.findOne({ bundleId });

    if (!bundleItem) {
        return res.status(404).json({ error: "Bundle item not found" });
    }
    // Increase the quantity of each single item
    for (const item of bundleItem.items) {
        await SingleItem.updateOne(
            { itemName: item.itemName, classCode: bundleItem.classCode },
            { $inc: { quantity: item.quantity } }
        );
    }

    res.status(200).json({ message: "Bundle returned successfully!" });
});

module.exports = { 
    createSingleItem, 
    getSingleItemsByClassCode, 
    purchaseSingleItem, 
    returnSingleItem, 
    createBundleItem, 
    getBundleItemsByClassCode, 
    purchaseBundleItem, 
    returnBundleItem 
};
