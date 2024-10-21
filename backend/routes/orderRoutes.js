const express = require('express');
const { 
    getAllOrders, 
    getOrderByOrderNumber, 
    getOrderById,
    createOrder, 
    deleteOrder, 
    getOrderByEmail,
    updateOrderByOrderNumber
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

// Route to get a specific order by id
// @route GET /api/order/:id
// @access Private
router.get('/order/id/:id', getOrderById); 

// Route to get a specific order by email
// @route GET /order/email/:email
// @access Private
router.get('/order/email/:email', getOrderByEmail);

// Route to create a new order
// @route POST /api/order
// @access Private
router.post('/order', createOrder);

// Route to update an order by order number
// @route PUT /api/order/:orderNumber
router.put('/order/:orderNumber', updateOrderByOrderNumber); 

// Route to delete an order by order number
// @route DELETE /api/order/:orderNumber
// @access Private
router.delete('/order/:orderNumber', deleteOrder);

module.exports = router;
