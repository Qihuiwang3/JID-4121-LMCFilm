const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Cart', studentSchema)