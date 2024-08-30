const express = require('express');
const { 
    pickUpItem,
    removeItem,
    returnItem,
    createGlobalItem,
    createSingleItem, 
    getSingleItemsByClassCode, 
    purchaseSingleItem, 
    returnSingleItem, 
    createBundleItem, 
    getBundleItemsByClassCode, 
    purchaseBundleItem, 
    returnBundleItem 
} = require('../controllers/itemController');

const router = express.Router();

// Route to create global items in the equipment checkout center
router.post('/item', createGlobalItem); 

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

module.exports = router;
