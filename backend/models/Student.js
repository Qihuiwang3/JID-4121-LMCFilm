const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    classCodes: [{ 
        type: String, 
    }],
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['Student', 'Admin', 'Professor', 'SA'], 
        default: 'Student', 
    },
    password: {
        type: String,
        required: true,
    },
    orderNumbers: [{ 
        type: String,  
    }],
});

module.exports = mongoose.model('Student', studentSchema);
