const mongoose = require('mongoose');

const damageReportSchema = new mongoose.Schema({
    reporter: {
        type: String, 
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now, 
    },
    orderNumber: { 
        type: String,
        required: true,
    },
    studentEmail: {
        type: String, 
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
        },
    ],
});

module.exports = mongoose.model('DamageReport', damageReportSchema);
