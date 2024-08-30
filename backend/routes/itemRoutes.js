const express = require('express');
const { 
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

