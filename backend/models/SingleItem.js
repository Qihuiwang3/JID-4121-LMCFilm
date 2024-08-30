const mongoose = require('mongoose');

const singleItemSchema = new mongoose.Schema({
    classCode: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    }
});

const SingleItem = mongoose.model('SingleItem', singleItemSchema);

module.exports = SingleItem;
