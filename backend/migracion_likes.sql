CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  post_id INTEGER REFERENCES posts(id),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, post_id)
);
