-- Migración para grupos de chat y mensajes de grupo

CREATE TABLE IF NOT EXISTS grupos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    imagen_url TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grupo_miembros (
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    miembro_id INTEGER,
    es_admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (grupo_id, miembro_id)
);

CREATE TABLE IF NOT EXISTS grupo_mensajes (
    id SERIAL PRIMARY KEY,
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    emisor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    texto TEXT,
    archivo_url TEXT,
    archivo_tipo VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
