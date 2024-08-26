const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    classCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cellPhone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Student', studentSchema)