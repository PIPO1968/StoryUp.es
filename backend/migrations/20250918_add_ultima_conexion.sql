-- Añadir columna ultima_conexion a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ultima_conexion TIMESTAMP;
