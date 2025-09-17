// Función para crear notificaciones
async function crearNotificacion(usuario_id, tipo, mensaje) {
    await pool.query(
        'INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES ($1, $2, $3)',
        [usuario_id, tipo, mensaje]
    );
}

// Consultar notificaciones del usuario autenticado
app.get('/notificaciones', autenticarToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM notificaciones WHERE usuario_id = $1 ORDER BY fecha DESC',
            [req.usuario.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Marcar notificación como leída
app.put('/notificaciones/:id/leida', autenticarToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            'UPDATE notificaciones SET leida = TRUE WHERE id = $1 AND usuario_id = $2',
            [id, req.usuario.id]
        );
        res.json({ mensaje: 'Notificación marcada como leída' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Feed personalizado: publicaciones de usuarios seguidos
app.get('/feed', autenticarToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.* FROM posts p
            JOIN seguidores s ON p.usuario_id = s.seguido_id
            WHERE s.seguidor_id = $1
            ORDER BY p.fecha DESC
        `, [req.usuario.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Ver perfil del usuario autenticado
app.get('/usuarios/perfil', autenticarToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, email, imagen_perfil FROM usuarios WHERE id = $1', [req.usuario.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Editar perfil del usuario autenticado
app.put('/usuarios/perfil', autenticarToken, async (req, res) => {
    const { nombre, email } = req.body;
    if (!nombre && !email) {
        return res.status(400).json({ error: 'Debes enviar al menos un campo para actualizar' });
    }
    try {
        let query = 'UPDATE usuarios SET ';
        const params = [];
        if (nombre) {
            query += 'nombre = $1';
            params.push(nombre);
        }
        if (email) {
            if (params.length > 0) query += ', ';
            query += 'email = $' + (params.length + 1);
            params.push(email);
        }
        query += ' WHERE id = $' + (params.length + 1) + ' RETURNING id, nombre, email, imagen_perfil';
        params.push(req.usuario.id);
        const result = await pool.query(query, params);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const path = require('path');
const multer = require('multer');

// Configuración de almacenamiento para imágenes de perfil
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, 'perfil_' + req.usuario.id + ext);
    }
});
const upload = multer({ storage });

// Crear carpeta uploads si no existe
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Endpoint para subir imagen de perfil
app.post('/usuarios/perfil/imagen', autenticarToken, upload.single('imagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    const imagenPath = '/uploads/' + req.file.filename;
    try {
        await pool.query('UPDATE usuarios SET imagen_perfil = $1 WHERE id = $2', [imagenPath, req.usuario.id]);
        res.json({ mensaje: 'Imagen de perfil actualizada', imagen_perfil: imagenPath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Servir imágenes de perfil
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Seguir a un usuario
app.post('/usuarios/:id/seguir', autenticarToken, async (req, res) => {
    const seguido_id = req.params.id;
    const seguidor_id = req.usuario.id;
    if (parseInt(seguido_id) === seguidor_id) {
        return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
    }
    try {
        await pool.query(
            'INSERT INTO seguidores (seguidor_id, seguido_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [seguidor_id, seguido_id]
        );
        // Notificar al usuario seguido
        await crearNotificacion(seguido_id, 'nuevo_seguidor', `Tienes un nuevo seguidor.`);
        res.json({ mensaje: 'Ahora sigues a este usuario' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Dejar de seguir a un usuario
app.delete('/usuarios/:id/seguir', autenticarToken, async (req, res) => {
    const seguido_id = req.params.id;
    const seguidor_id = req.usuario.id;
    try {
        await pool.query(
            'DELETE FROM seguidores WHERE seguidor_id = $1 AND seguido_id = $2',
            [seguidor_id, seguido_id]
        );
        res.json({ mensaje: 'Has dejado de seguir a este usuario' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar seguidores de un usuario
app.get('/usuarios/:id/seguidores', async (req, res) => {
    const seguido_id = req.params.id;
    try {
        const result = await pool.query(
            'SELECT u.id, u.nombre, u.email FROM seguidores s JOIN usuarios u ON s.seguidor_id = u.id WHERE s.seguido_id = $1',
            [seguido_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar seguidos de un usuario
app.get('/usuarios/:id/seguidos', async (req, res) => {
    const seguidor_id = req.params.id;
    try {
        const result = await pool.query(
            'SELECT u.id, u.nombre, u.email FROM seguidores s JOIN usuarios u ON s.seguido_id = u.id WHERE s.seguidor_id = $1',
            [seguidor_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Dar like a una publicación
app.post('/posts/:postId/like', autenticarToken, async (req, res) => {
    const { postId } = req.params;
    const usuario_id = req.usuario.id;
    try {
        await pool.query(
            'INSERT INTO likes (usuario_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [usuario_id, postId]
        );
        // Notificar al autor del post
        const post = await pool.query('SELECT usuario_id FROM posts WHERE id = $1', [postId]);
        if (post.rows.length > 0 && post.rows[0].usuario_id !== usuario_id) {
            await crearNotificacion(post.rows[0].usuario_id, 'like', `Tu publicación recibió un me gusta.`);
        }
        res.json({ mensaje: 'Like agregado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Quitar like a una publicación
app.delete('/posts/:postId/like', autenticarToken, async (req, res) => {
    const { postId } = req.params;
    const usuario_id = req.usuario.id;
    try {
        await pool.query(
            'DELETE FROM likes WHERE usuario_id = $1 AND post_id = $2',
            [usuario_id, postId]
        );
        res.json({ mensaje: 'Like eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener el conteo de likes de una publicación
app.get('/posts/:postId/likes', async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await pool.query(
            'SELECT COUNT(*) FROM likes WHERE post_id = $1',
            [postId]
        );
        res.json({ likes: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.get('/', (req, res) => {
    res.send('API de StoryUp.es funcionando');
});

// Middleware para verificar JWT
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.usuario = usuario;
        next();
    });
}

// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Registrar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
            [nombre, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login de usuario
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        const usuario = result.rows[0];
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
        // Generar token JWT
        const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ mensaje: 'Login exitoso', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todas las publicaciones
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY fecha DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una nueva publicación
app.post('/posts', autenticarToken, async (req, res) => {
    const { contenido } = req.body;
    const usuario_id = req.usuario.id;
    if (!usuario_id || !contenido) {
        return res.status(400).json({ error: 'usuario_id y contenido son obligatorios' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO posts (usuario_id, contenido) VALUES ($1, $2) RETURNING *',
            [usuario_id, contenido]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener comentarios de un post
app.get('/posts/:postId/comentarios', async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM comentarios WHERE post_id = $1 ORDER BY fecha ASC', [postId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear un comentario en un post
app.post('/posts/:postId/comentarios', autenticarToken, async (req, res) => {
    const { postId } = req.params;
    const { contenido } = req.body;
    const usuario_id = req.usuario.id;
    if (!usuario_id || !contenido) {
        return res.status(400).json({ error: 'usuario_id y contenido son obligatorios' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO comentarios (post_id, usuario_id, contenido) VALUES ($1, $2, $3) RETURNING *',
            [postId, usuario_id, contenido]
        );
        // Notificar al autor del post
        const post = await pool.query('SELECT usuario_id FROM posts WHERE id = $1', [postId]);
        if (post.rows.length > 0 && post.rows[0].usuario_id !== usuario_id) {
            await crearNotificacion(post.rows[0].usuario_id, 'comentario', `Tu publicación recibió un nuevo comentario.`);
        }
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
