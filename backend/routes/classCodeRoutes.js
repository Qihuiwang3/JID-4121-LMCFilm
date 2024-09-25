const express = require('express');
const { createClassCode, getClassCode, getAllClassCodes, deleteClassCode, updateClassCode} = require('../controllers/classCodeController');

const router = express.Router();

router.post('/class-code', createClassCode);
router.get('/class-code/:code', getClassCode);
router.delete('/class-code/:code', deleteClassCode);
router.put('/class-code/:code', updateClassCode);
// Route to get all class codes
router.get('/class-codes', getAllClassCodes);

module.exports = router;
