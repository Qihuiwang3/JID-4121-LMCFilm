const asyncHandler = require("express-async-handler");
const Order = require('../models/Order');

// @desc Get all orders
// @route GET /orders
// @access Private
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
        return res.status(404).json({ error: "No orders found in the system." });
    }
    res.status(200).json(orders);
});

// @desc Get an order by order number
// @route GET /order/:orderNumber
// @access Private
const getOrderByOrderNumber = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
        return res.status(404).json({ error: `Order with number ${req.params.orderNumber} not found.` });
    }
    res.status(200).json(order);
});

// @desc Get orders by email
// @route GET /order/email/:email
// @access Private
const getOrderByEmail = asyncHandler(async (req, res) => {
    const orders = await Order.find({ email: req.params.email });

    if (!orders || orders.length === 0) {
        return res.status(404).json({ error: `No orders found for email ${req.params.email}.` });
    }

    res.status(200).json(orders);
});

// @desc Create new order
// @route POST /order
// @access Private
const createOrder = asyncHandler(async (req, res) => {
    const { orderNumber, email, checkin, checkout, studentName, equipment } = req.body;

    if (!orderNumber || !email || !checkin || !checkout || !studentName || equipment.length === 0) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
        return res.status(400).json({ error: `Order with number ${orderNumber} already exists.` });
    }

    const newOrder = new Order({
        orderNumber,
        email,
        checkin: new Date(checkin), 
        checkout: new Date(checkout),
        studentName,
        equipment,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
});


// @desc Delete an order by order number
// @route DELETE /order/:orderNumber
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOneAndDelete({ orderNumber: req.params.orderNumber });

    if (!order) {
        return res.status(404).json({ error: `Order with number ${req.params.orderNumber} not found.` });
    }

    res.status(200).json({ message: `Order with number ${req.params.orderNumber} deleted successfully.` });
});

// @desc Update an order by order number
// @route PUT /order/:orderNumber
// @access Private
const updateOrderByOrderNumber = asyncHandler(async (req, res) => {
    const { equipment } = req.body; // Expect an array of tuples: [{ itemName, itemId }]

    if (!equipment || equipment.length === 0) {
        return res.status(400).json({ error: "Equipment and item IDs are required." });
    }

    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    
    if (!order) {
        return res.status(404).json({ error: `Order with number ${req.params.orderNumber} not found.` });
    }

    // Update the equipment array to contain itemName and itemId tuples
    order.equipment = equipment;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
});


module.exports = { 
    getAllOrders,
    getOrderByOrderNumber,
    getOrderByEmail,
    createOrder,
    deleteOrder,
    updateOrderByOrderNumber
};
