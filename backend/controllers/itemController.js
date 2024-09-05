const asyncHandler = require("express-async-handler");
const SingleItem = require('../models/SingleItem');
const Item = require('../models/Item');
const BundleItem = require('../models/BundleItem');

// @desc Create or update a global item in the equipment checkout center
// @route POST /item
// @access Private
const createGlobalItem = asyncHandler(async (req, res) => {
    const { itemName, quantity, pricePerItem, itemIds } = req.body;
    let item = await Item.findOne({ itemName });
    if (item) {
        item.quantity += quantity;
        item.itemName = itemName;
        item.pricePerItem = pricePerItem;
        item.itemIds.push(...itemIds);
    } else {
        item = new Item({
            itemName,
            quantity,
            pricePerItem,
            itemIds, 
        });
    }
    const savedItem = await item.save();
    res.status(201).json(savedItem);
});

// @desc Get all global equipment
// @route GET /items
// @access Private
const getAllGlobalEquipment = asyncHandler(async (req, res) => {
    const items = await Item.find({});

    if (!items || items.length === 0) {
        return res.status(404).json({ error: "No items found in the equipment checkout center." });
    }

    res.status(200).json(items);
});

// @desc Get a specific item by item name
// @route GET /item/:itemName
// @access Private
const getItemByName = asyncHandler(async (req, res) => {
    const { itemName } = req.params;

    const item = await Item.findOne({ itemName });

    if (!item) {
        return res.status(404).json({ error: `Item ${itemName} not found in the equipment checkout center.` });
    }

    res.status(200).json(item);
});

// @desc Pick up an item (remove itemId from global inventory)
// @route POST /pickup-item/:itemName/:itemId
// @access Private
const pickUpItem = asyncHandler(async (req, res) => {
    const { itemName, itemId } = req.params;

    const item = await Item.findOne({ itemName });
    if (!item) {
        return res.status(404).json({ error: `Item ${itemName} not found in the equipment checkout center.` });
    }

    // Check if the itemId exists
    const itemIndex = item.itemIds.findIndex(i => i.itemId === itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ error: `Item ID ${itemId} not found for item ${itemName}.` });
    }

    // Remove the itemId from the global inventory
    item.itemIds.splice(itemIndex, 1);

    await item.save();

    res.status(200).json({ message: `Item ID ${itemId} picked up successfully.` });
});

// @desc Return an item (add itemId back to global inventory)
// @route POST /return-item/:itemName/:itemId
// @access Private
const returnItem = asyncHandler(async (req, res) => {
    const { itemName, itemId } = req.params;

    const item = await Item.findOne({ itemName });
    if (!item) {
        return res.status(404).json({ error: `Item ${itemName} not found in the equipment checkout center.` });
    }

    // Add the itemId back to the global inventory
    item.itemIds.push({ itemId });
    await item.save();

    res.status(200).json({ message: `Item ID ${itemId} returned successfully.` });
});

// @desc Remove an item from the database
// @route DELETE /item/:itemName
// @access Private
const removeItem = asyncHandler(async (req, res) => {
    const { itemName } = req.params;

    const item = await Item.findOneAndDelete({ itemName });
    if (!item) {
        return res.status(404).json({ error: `Item ${itemName} not found in the equipment checkout center.` });
    }

    // Also remove any associated SingleItem or BundleItem records
    await SingleItem.deleteMany({ itemName });
    await BundleItem.updateMany(
        { "items.itemName": itemName },
        { $pull: { items: { itemName } } }
    );

    res.status(200).json({ message: `Item ${itemName} and all associated records removed successfully.` });
});


// @desc Create new single item
// @route POST /single-item
// @access Private
const createSingleItem = asyncHandler(async (req, res) => {
    const { classCode, itemName } = req.body;
    let item = await Item.findOne({ itemName });
    if (!item) {
        return res.status(404).json({ error: "Item not found in the equipment checkout center." });
    }

    const newSingleItem = new SingleItem({
        classCode,
        itemName,
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

    const item = await Item.findOne({ itemName });

    if (!item) {
        return res.status(404).json({ error: `Item ${itemName} not found.` });
    }

    if (item.quantity < quantity) {
        return res.status(400).json({ error: `Not enough quantity available for ${itemName}. Available: ${item.quantity}, Requested: ${quantity}` });
    }

    item.quantity -= quantity;
    await item.save();

    res.status(200).json({ message: `${quantity} units of ${itemName} purchased successfully. Remaining total quantity: ${item.quantity}` });
});



// @desc Return a single item and increase its quantity
// @route POST /return-single/:itemName
// @access Private
const returnSingleItem = asyncHandler(async (req, res) => {
    const { itemName } = req.params;
    const { quantity } = req.body;  // Quantity to return

    const item = await Item.findOne({ itemName });

    if (!item) {
        return res.status(404).json({ error: `Item ${itemName} not found.` });
    }

    item.quantity += quantity;
    await item.save();

    res.status(200).json({ message: `${quantity} units of ${itemName} returned successfully. Updated total quantity: ${item.quantity}` });
});


// @desc Create new bundle item
// @route POST /bundle-item
// @access Private
const createBundleItem = asyncHandler(async (req, res) => {
    const { bundleId, classCode, bundleName, items, price } = req.body;

    // Check if all items are available in required quantity
    for (const item of items) {
        const globalItem = await Item.findOne({ itemName: item.itemName });
        if (!globalItem || globalItem.quantity < item.quantity) {
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
        const globalItem = await Item.findOne({ itemName: item.itemName });
        if (!globalItem || globalItem.quantity < item.quantity) {
            return res.status(400).json({ error: `Item ${item.itemName} is not available in the required quantity.` });
        }
    }

    // Decrease the quantity of each item in the global Item model
    for (const item of bundleItem.items) {
        await Item.updateOne(
            { itemName: item.itemName },
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

    // Increase the quantity of each item in the global Item model
    for (const item of bundleItem.items) {
        await Item.updateOne(
            { itemName: item.itemName },
            { $inc: { quantity: item.quantity } }
        );
    }
    res.status(200).json({ message: "Bundle returned successfully!" });
});



module.exports = { 
    createGlobalItem,
    getAllGlobalEquipment,
    getItemByName,
    returnItem,
    pickUpItem,
    removeItem,
    createSingleItem, 
    getSingleItemsByClassCode, 
    purchaseSingleItem, 
    returnSingleItem, 
    createBundleItem, 
    getBundleItemsByClassCode, 
    purchaseBundleItem, 
    returnBundleItem 
};