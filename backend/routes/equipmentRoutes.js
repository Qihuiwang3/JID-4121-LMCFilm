const express = require('express');
const { createEquipment, getEquipmentByClassCode } = require('../controllers/equipmentController');

const router = express.Router();

router.post('/equipment', createEquipment);

router.get('/equipment/:classCode', getEquipmentByClassCode);

module.exports = router;