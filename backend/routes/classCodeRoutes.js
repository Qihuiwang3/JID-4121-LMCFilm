const express = require('express');
const { createClassCode, getClassCode } = require('../controllers/classCodeController');

const router = express.Router();

router.post('/class-code', createClassCode);
router.get('/class-code/:code', getClassCode);
module.exports = router;