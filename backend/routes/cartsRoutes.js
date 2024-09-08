const express = require("express");
const router = express.Router();
const cartsController = require("../controllers/cartsController");
const limiter = require('../middleware/rateLimiter');

router.get('/', limiter, cartsController.getCart);
router.post('/', limiter, cartsController.createCart);
router.put('/carts/:itemId', limiter, cartsController.updateCart);
router.delete('/carts/:itemId', limiter, cartsController.deleteCart);


module.exports = router;
