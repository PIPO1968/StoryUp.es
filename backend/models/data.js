const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    type: { type: String, required: true }, // noticia, historia, mensaje, like, etc.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true }, // puede ser texto, objeto, etc.
    meta: { type: Object, default: {} }, // metadatos opcionales
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Data', dataSchema);
