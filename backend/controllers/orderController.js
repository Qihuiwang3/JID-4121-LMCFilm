const asyncHandler = require("express-async-handler");
const Order = require('../models/Order');
const Item = require('../models/Item');

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

    // Check if the order number already exists
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
        return res.status(400).json({ error: `Order with number ${orderNumber} already exists.` });
    }

    for (const equipmentItem of equipment) {
        const inventoryItem = await Item.findOne({ itemName: equipmentItem.itemName });

        if (!inventoryItem) {
            throw new Error(`Inventory item not found for ${equipmentItem.itemName}`);
        }

        if (inventoryItem.quantity <= 0) {
            throw new Error(`No stock available for ${equipmentItem.itemName}`);
        }

        inventoryItem.quantity -= 1;

        const itemIndex = inventoryItem.itemIds.findIndex(
            (itemDetail) => itemDetail.itemId === equipmentItem.itemId
        );
        if (itemIndex !== -1) {
            inventoryItem.itemIds[itemIndex].checkout = new Date(); // Set checkout time
        }

        await inventoryItem.save();
    }

    const newOrder = new Order({
        orderNumber,
        email,
        checkin: new Date(checkin),
        checkout: new Date(checkout),
        checkedinStatus: false,
        checkedoutStatus: false,
        studentName,
        equipment: equipment,
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

    // iterate through the equipment in the order and update the inventory quantity
    for (const item of order.equipment) {
        const { itemName } = item;

        const inventoryItem = await Item.findOne({ itemName });
        if (inventoryItem) {
            inventoryItem.quantity += 1;
            await inventoryItem.save();
        }
    }

    res.status(200).json({ message: `Order with number ${req.params.orderNumber} deleted successfully, and inventory updated.` });
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

    for (const item of equipment) {
        const { itemName, itemId } = item;

        const inventoryItem = await Item.findOne({ itemName });
        if (!inventoryItem) {
            return res.status(404).json({ error: `Item with name ${itemName} not found.` });
        }

        // Find the specific itemId within the item's `itemIds` array
        const itemIndex = inventoryItem.itemIds.findIndex((i) => i.itemId === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: `Item ID ${itemId} not found in item ${itemName}.` });
        }

        // Check and clear both checkin and checkout fields if both are filled
        const currentItem = inventoryItem.itemIds[itemIndex];

        // Update checkin or checkout status if provided
        if (checkedout) {
            currentItem.checkout = checkedout;
        }
        if (checkedin) {
            currentItem.checkin = checkedin;
        }

        // Save the updated inventory item
        await inventoryItem.save();

        if (currentItem.checkin && currentItem.checkout) {
            currentItem.checkin = null;
            currentItem.checkout = null;
            inventoryItem.quantity += 1; // Increase the quantity by 1
        }
        await inventoryItem.save();
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
