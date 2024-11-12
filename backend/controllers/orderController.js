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

// @desc Get order by ID
// @route GET /order/id/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ error: `Order with ID ${req.params.id} not found.` });
    }
    res.status(200).json(order);
});

// @desc Create new order
// @route POST /order
// @access Private
const createOrder = asyncHandler(async (req, res) => {
    const { orderNumber, email, checkin, checkout, studentName, equipment } = req.body;

    if (!orderNumber || !email || !checkin || !checkout || !studentName || equipment.length === 0) {
        return res.status(400).json({ error: "All fields are required, including equipment." });
    }

    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
        return res.status(400).json({ error: `Order with number ${orderNumber} already exists.` });
    }

    const formattedEquipment = equipment.map(e => ({
        itemName: e.name,
        itemId: e.itemId,
    }));

    const newOrder = new Order({
        orderNumber,
        email,
        checkin: new Date(checkin),
        checkout: new Date(checkout),
        checkedinStatus: false, // Explicitly set these to false initially
        checkedoutStatus: false, // Explicitly set these to false initially
        studentName,
        equipment: formattedEquipment
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
    const { equipment, checkedoutStatus, checkedinStatus, checkedout, checkedin, checkout, beenExtended } = req.body; // Expect equipment and checkout status

    if (!equipment || equipment.length === 0) {
        return res.status(400).json({ error: "Equipment and item IDs are required." });
    }

    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
        return res.status(404).json({ error: `Order with number ${req.params.orderNumber} not found.` });
    }

    order.equipment = equipment;

    if (checkedoutStatus) {
        order.checkedoutStatus = checkedoutStatus;
    }

    if (checkedinStatus) {
        order.checkedinStatus = checkedinStatus;
    }

    if (checkedin) {
        order.checkedin = checkedin;
    }
    if (checkedout) {
        order.checkedout = checkedout;
    }
    if (checkout) {
        order.checkout = checkout;
    }
    if (beenExtended) {
        order.beenExtended = beenExtended
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
});


module.exports = {
    getAllOrders,
    getOrderByOrderNumber,
    getOrderById,
    getOrderByEmail,
    createOrder,
    deleteOrder,
    updateOrderByOrderNumber
};
