const express = require('express');
const { createSingleItem, getSingleItemsByClassCode, createBundleItem, getBundleItemsByClassCode, purchaseBundleItem } = require('../controllers/itemController');

const router = express.Router();

// Routes for single items
router.post('/single-item', createSingleItem);
router.get('/single-items/:classCode', getSingleItemsByClassCode);

// Routes for bundle items
router.post('/bundle-item', createBundleItem);
router.get('/bundle-items/:classCode', getBundleItemsByClassCode);
router.post('/purchase-bundle/:bundleId', purchaseBundleItem);

module.exports = router;
