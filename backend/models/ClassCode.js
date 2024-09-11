const mongoose = require('mongoose');

const classCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    professor: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model('ClassCode', classCodeSchema);