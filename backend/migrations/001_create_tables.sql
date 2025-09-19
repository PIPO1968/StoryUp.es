-- Migración inicial: usuarios, grupos y mensajes

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grupos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  creado_por INT REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mensajes (
  id SERIAL PRIMARY KEY,
  grupo_id INT REFERENCES grupos(id),
  usuario_id INT REFERENCES usuarios(id),
  contenido TEXT NOT NULL,
  enviado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
