import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/storyup';

// Conexión rápida a MongoDB si no está conectada
if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

const userSchema = new mongoose.Schema({
    lastActive: Date,
}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function updateLastActiveFromRequest(req) {
    try {
        const auth = req.headers['authorization'] || req.headers['Authorization'];
        if (!auth || !auth.startsWith('Bearer ')) return;
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        if (decoded && decoded.userId) {
            await User.findByIdAndUpdate(decoded.userId, { lastActive: new Date() });
        }
    } catch (e) {
        // No romper si el token es inválido
    }
}
