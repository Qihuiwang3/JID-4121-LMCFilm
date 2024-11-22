const express = require('express');

const { createClassCode, getClassCode, getAllClassCodes, updateClassCode, deleteClassCode, clearAllClassCodes } = require('../controllers/classCodeController');

const router = express.Router();

router.post('/class-code', createClassCode);
router.get('/class-code/:code', getClassCode);

// Route to get all class codes
router.get('/class-codes', getAllClassCodes);


// Add the update class code route
router.put('/class-code/:code', updateClassCode);

router.delete('/class-code/:code', deleteClassCode);
router.delete('/class-codes/clear-all', clearAllClassCodes);
module.exports = router;

