const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
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
    },
    bundleId: {
        type: String,
        required: false,
    }
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
