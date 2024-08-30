const mongoose = require('mongoose');

const singleItemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        unique: true,
    },
    classCode: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    pricePerItem: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('SingleItem', singleItemSchema);
