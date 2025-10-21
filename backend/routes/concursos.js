const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Modelo Concurso
const Concurso = mongoose.model('Concurso', new mongoose.Schema({
    titulo: { type: String, required: true },
    resumen: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFinal: { type: Date, required: true },
    autorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ganador: { type: String, default: '' },
}, { timestamps: true }));

// Crear concurso
router.post('/', async (req, res) => {
    try {
        const { titulo, resumen, fechaInicio, fechaFinal, autorId } = req.body;
        if (!titulo || !resumen || !fechaInicio || !fechaFinal || !autorId) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const concurso = new Concurso({ titulo, resumen, fechaInicio, fechaFinal, autorId });
        await concurso.save();
        res.status(201).json(concurso);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear concurso', details: err.message });
    }
});

// Obtener concursos (últimos 10)
router.get('/', async (req, res) => {
    try {
        const concursos = await Concurso.find().sort({ createdAt: -1 }).limit(10).populate('autorId', 'username name');
        res.json(concursos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener concursos', details: err.message });
    }
});

// Definir ganador
router.post('/:id/ganador', async (req, res) => {
    try {
        const { ganador } = req.body;
        const concurso = await Concurso.findByIdAndUpdate(req.params.id, { ganador }, { new: true });
        if (!concurso) return res.status(404).json({ error: 'Concurso no encontrado' });
        res.json(concurso);
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar ganador', details: err.message });
    }
});

module.exports = router;
