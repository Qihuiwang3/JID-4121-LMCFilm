const express = require('express');
const {
    pickUpItem,
    removeItem,
    removeSingularItem,
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
    toggleHideStatus,
    updateBundleItem,
    getRepairStatus,
    isItemIdExist,
    updateItem
} = require('../controllers/itemController');

const router = express.Router();

// Route to create global items in the equipment checkout center
router.post('/item', createGlobalItem);

// Route to get all global equipment
router.get('/items', getAllGlobalEquipment);

// Route to get a specific item by item name
router.post('/get-item', getItemByName);
// Routes for picking up and returning items
router.post('/pickup-item/:itemName/:itemId', pickUpItem);
router.post('/return-item/:itemName/:itemId', returnItem);

// Route to remove an item from the database
router.delete('/item/:itemName', removeItem);
router.delete('/deleteItemId/:itemId', removeSingularItem);

// Routes for single items
router.post('/single-item', createSingleItem);
router.get('/single-items/:classCode', getSingleItemsByClassCode);
router.post('/purchase-single/:itemName', purchaseSingleItem);
router.post('/return-single/:itemName', returnSingleItem);

// Routes for bundle items
router.post('/bundle-item', createBundleItem);
router.get('/bundle-items/:classCode', getBundleItemsByClassCode);

router.put('/bundle-items/:bundleId', updateBundleItem)
router.post('/purchase-bundle/:bundleId', purchaseBundleItem);
router.post('/return-bundle/:bundleId', returnBundleItem);

// Toggle repair status of item
router.patch('/item/itemId/:itemId/repair', toggleRepairStatus);

// Toggle hide status of item
router.patch('/item/itemId/:itemId/hide', toggleHideStatus);

router.post('/item/repair-status', getRepairStatus);

router.get('/item/itemName/itemId/:itemName/:itemId/existence', isItemIdExist);
router.put('/item/update', updateItem);

module.exports = router;
