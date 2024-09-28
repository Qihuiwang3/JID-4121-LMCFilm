const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    pricePerItem: {
        type: Number,
        required: true,
    },
    itemIds: [{
        itemId: String,
        repair: {
            type: Boolean,
            default: false,
        },
        hide: {
            type: Boolean,
            default: false,
        },
        checkin: {
            type: Date,
            default: '' // Set default date to January 1, 2024
        },
        checkout: {
            type: Date,
            default: '' // Set default date to January 1, 2024
        },
    }],
});

module.exports = mongoose.model('Item', itemSchema);
