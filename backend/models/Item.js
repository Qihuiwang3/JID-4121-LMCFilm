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
            default: '' 
        },
        checkout: {
            type: Date,
            default: '' 
        },
    }],
});

module.exports = mongoose.model('Item', itemSchema);
