-- migracion_mensajes.sql
CREATE TABLE IF NOT EXISTS mensajes (
    id SERIAL PRIMARY KEY,
    texto TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    archivo_url TEXT,
    archivo_tipo TEXT
);

CREATE INDEX IF NOT EXISTS idx_mensajes_emisor_receptor ON mensajes(emisor_id, receptor_id);
