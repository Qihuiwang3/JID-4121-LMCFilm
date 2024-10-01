const express = require('express');
const router = express.Router();
const {
    createDamageReport,
    getAllDamageReports,
    getSingleDamageReport,
    deleteDamageReport,
    updateDamageReport,
} = require('../controllers/damageReportController');
const limiter = require('../middleware/rateLimiter');

// Routes
router.post('/', limiter, createDamageReport);
router.get('/', limiter, getAllDamageReports);
router.get('/:id', limiter, getSingleDamageReport);
router.delete('/:id', limiter, deleteDamageReport);
router.put('/:id', limiter, updateDamageReport);

module.exports = router;
