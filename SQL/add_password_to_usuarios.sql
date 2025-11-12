-- Agregar columna de contraseña a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password TEXT;

-- Agregar columna para identificar superusuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;

-- Crear índice para búsquedas por email (usado en login)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Insertar superusuario por defecto
-- Email: admin@fluxicloud.com
-- Contraseña: Fluxi2025!
-- IMPORTANTE: Esta es una contraseña temporal. Se recomienda cambiarla después del primer login.
INSERT INTO usuarios (nombre, email, telefono, rol, estado, password, is_superuser, created_at)
VALUES (
    'Superadministrador Fluxi',
    'admin@fluxicloud.com',
    '+573001234567',
    'administrador',
    'activo',
    'Fluxi2025!',
    TRUE,
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Comentarios para documentación
COMMENT ON COLUMN usuarios.password IS 'Contraseña del usuario para acceder a la aplicación';
COMMENT ON COLUMN usuarios.is_superuser IS 'Indica si el usuario tiene privilegios de superadministrador';

-- Nota: En un entorno de producción, las contraseñas deberían estar hasheadas.
-- Por simplicidad en este sistema, se almacenan en texto plano, pero se recomienda
-- implementar hashing (bcrypt, argon2, etc.) para mayor seguridad.
