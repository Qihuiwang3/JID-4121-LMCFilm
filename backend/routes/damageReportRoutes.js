const express = require('express');
const router = express.Router();
const {
    createDamageReport,
    getAllDamageReports,
    getSingleDamageReport,
    deleteDamageReport,
    updateDamageReport,
} = require('../controllers/damageReportController');

// Routes
router.post('/damage-reports', createDamageReport);
router.get('/damage-reports', getAllDamageReports);
router.get('/damage-reports/:id', getSingleDamageReport);
router.delete('/damage-reports/:id', deleteDamageReport);
router.put('/damage-reports/:id', updateDamageReport);

module.exports = router;
