const express = require("express");
const router = express.Router();
const cartsController = require("../controllers/cartsController");
const limiter = require('../middleware/rateLimiter');

router.get('/', limiter, cartsController.getCart);
router.post('/', limiter, cartsController.createCart);

module.exports = router;
