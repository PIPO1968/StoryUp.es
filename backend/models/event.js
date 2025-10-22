const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    type: { type: String, required: true },
    data: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);