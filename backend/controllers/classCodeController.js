const ClassCode = require('../models/ClassCode');

exports.createClassCode = async (req, res) => {
    const { code } = req.body;

    try {
        const newClassCode = new ClassCode({ code });
        await newClassCode.save();
        res.status(201).json(newClassCode);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getClassCode = async (req, res) => {
    try {
        const classCode = await ClassCode.findOne({ code: req.params.code });
        if (!classCode) {
            return res.status(404).json({ error: "Class code not found" });
        }
        res.status(200).json(classCode);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};