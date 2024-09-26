const express = require('express');
const { createClassCode, getClassCode, getAllClassCodes} = require('../controllers/classCodeController');

const router = express.Router();

router.post('/class-code', createClassCode);
router.get('/class-code/:code', getClassCode);

// Route to get all class codes
router.get('/class-codes', getAllClassCodes);

module.exports = router;
