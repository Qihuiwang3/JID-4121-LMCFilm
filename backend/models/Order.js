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
    // user reserve check in date
    checkin: {
        type: Date, 
        required: true,
    },
    checkout: {
        type: Date,
        required: true,
    },
    // the real user check in date
    checkedin: {
        type: Date, 
        default: null, 
    },
    checkedout: {
        type: Date,
        default: null, 
    },
    // if user checked in already, this will be true
    checkedinStatus: {
        type: Boolean,
        default: false, 
    },
    checkedoutStatus: {
        type: Boolean,
        default: false, 
    },
    studentName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    equipment: [{ 
        itemName: { type: String, required: true }, 
        itemId: { type: String }, 
    }],
    beenExtended: {
        type: Boolean,
        default: false, 
    },
});

module.exports = mongoose.model('Order', orderSchema);
