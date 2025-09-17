CREATE TABLE IF NOT EXISTS seguidores (
  id SERIAL PRIMARY KEY,
  seguidor_id INTEGER REFERENCES usuarios(id),
  seguido_id INTEGER REFERENCES usuarios(id),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(seguidor_id, seguido_id)
);
