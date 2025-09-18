-- migracion_mensajes.sql
CREATE TABLE IF NOT EXISTS mensajes (
    id SERIAL PRIMARY KEY,
    emisor_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    receptor_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    texto TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    archivo_url TEXT,
    archivo_tipo TEXT
);

CREATE INDEX IF NOT EXISTS idx_mensajes_emisor_receptor ON mensajes(emisor_id, receptor_id);
