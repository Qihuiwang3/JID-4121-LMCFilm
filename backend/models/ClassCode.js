const mongoose = require('mongoose');

const classCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
});

const ClassCode = mongoose.model('ClassCode', classCodeSchema);

module.exports = ClassCode;