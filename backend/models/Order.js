const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String, 
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    checkin: {
        type: Date, 
        required: true,
    },
    checkout: {
        type: Date,
        required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    }
});

module.exports = mongoose.model('Order', orderSchema);
