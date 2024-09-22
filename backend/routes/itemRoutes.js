const express = require('express');
const { 
    pickUpItem,
    removeItem,
    returnItem,
    createGlobalItem,
    getAllGlobalEquipment,
    getItemByName,
    createSingleItem, 
    getSingleItemsByClassCode, 
    purchaseSingleItem, 
    returnSingleItem, 
    createBundleItem, 
    getBundleItemsByClassCode, 
    purchaseBundleItem, 
    returnBundleItem,
    toggleRepairStatus,
    toggleHideStatus
} = require('../controllers/itemController');

const router = express.Router();

// Route to create global items in the equipment checkout center
router.post('/item', createGlobalItem); 

// Route to get all global equipment
router.get('/items', getAllGlobalEquipment);

// Route to get a specific item by item name
router.get('/item/:itemName', getItemByName); 

// Routes for picking up and returning items
router.post('/pickup-item/:itemName/:itemId', pickUpItem);
router.post('/return-item/:itemName/:itemId', returnItem);

// Route to remove an item from the database
router.delete('/item/:itemName', removeItem); 

// Routes for single items
router.post('/single-item', createSingleItem);
router.get('/single-items/:classCode', getSingleItemsByClassCode);
router.post('/purchase-single/:itemName', purchaseSingleItem);
router.post('/return-single/:itemName', returnSingleItem);

// Routes for bundle items
router.post('/bundle-item', createBundleItem);
router.get('/bundle-items/:classCode', getBundleItemsByClassCode);
router.post('/purchase-bundle/:bundleId', purchaseBundleItem);
router.post('/return-bundle/:bundleId', returnBundleItem);

// Route to toggle repair status by itemId
// @route PATCH /item/:itemId/repair
router.patch('/item/:itemId/repair', toggleRepairStatus);

// Route to toggle hide status by itemId
// @route PATCH /item/:itemId/hide
router.patch('/item/:itemId/hide', toggleHideStatus);

module.exports = router;
