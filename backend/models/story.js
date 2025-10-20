const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const StorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['Real', 'Ficticia', 'Ficción'], required: true },
    theme: { type: String, enum: ['Aventura', 'Fantasía', 'Corazón', 'Terror', 'Educativa', 'CONCURSO', 'Familiar'], required: true },
    anonimo: { type: Boolean, default: false },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);