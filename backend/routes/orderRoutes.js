const express = require('express');
const { 
    getAllOrders, 
    getOrderByOrderNumber, 
    createOrder, 
    deleteOrder 
} = require('../controllers/orderController');

const router = express.Router();

// Route to get all orders
// @route GET /api/orders
// @access Private
router.get('/orders', getAllOrders);

// Route to get a specific order by order number
// @route GET /api/order/:orderNumber
// @access Private
router.get('/order/:orderNumber', getOrderByOrderNumber);

// Route to create a new order
// @route POST /api/order
// @access Private
router.post('/order', createOrder);

// Route to delete an order by order number
// @route DELETE /api/order/:orderNumber
// @access Private
router.delete('/order/:orderNumber', deleteOrder);

module.exports = router;
