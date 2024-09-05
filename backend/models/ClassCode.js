const mongoose = require('mongoose');

const classCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('ClassCode', classCodeSchema);