const mongoose = require('mongoose');

const bundleItemSchema = new mongoose.Schema({
    bundleId: {
        type: String,
        required: true,
        unique: true,
    },
    classCode: {
        type: String,
        required: true,
    },
    bundleName: {
        type: String,
        required: true,
    },
    items: [{
        itemName: String,
        quantity: Number
    }],
    price: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('BundleItem', bundleItemSchema);
