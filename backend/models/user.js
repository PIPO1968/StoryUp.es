const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    realName: { type: String },
    userType: { type: String, default: 'Usuario' },
    centroTipo: { type: String, default: '' },
    centroNombre: { type: String, default: '' },
    course: { type: String, default: '' },
    avatar: { type: String, default: '' }, // base64 o URL
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);
