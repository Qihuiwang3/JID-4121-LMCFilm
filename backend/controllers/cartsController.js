const asyncHandler = require("express-async-handler");
const Cart = require('../models/Cart');

// @desc Get all carts
// @route GET /carts
// @access Private
const getCart = asyncHandler(async (req, res) => {
    const carts = await Cart.find();
    res.status(200).json(carts);
});

// @desc Create new cart
// @route POST /carts
// @access Private
const createCart = asyncHandler(async (req, res) => {
    const { itemId, price, quantity } = req.body;

    const newCart = new Cart({
        itemId,
        price,
        quantity
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
});

const deleteCart = asyncHandler(async (req, res) => {
    const { itemID } = req.params;


    const deleteCart = await Cart.findByIdAndDelete(itemID);


    res.status(200).json({ message: 'Cart deleted successfully' });
   
});


const updateCart = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { price, quantity } = req.body;


    const updatedCart = await Cart.findOneAndUpdate(
        { itemId },
        { price, quantity },
        { new: true, runValidators: true }
    );


    res.status(200).json(updatedCart);
});


module.exports = { getCart, createCart, deleteCart, updateCart };
