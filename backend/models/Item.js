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
    }],
});

module.exports = mongoose.model('Item', itemSchema);
