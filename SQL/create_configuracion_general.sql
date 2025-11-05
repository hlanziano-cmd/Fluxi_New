-- Crear tabla configuracion_general
-- Esta tabla almacena la configuración global del sistema

CREATE TABLE IF NOT EXISTS configuracion_general (
    id SERIAL PRIMARY KEY,
    hora_reinicio TIME NOT NULL DEFAULT '08:00:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE configuracion_general IS 'Configuración general del sistema Fluxi';
COMMENT ON COLUMN configuracion_general.hora_reinicio IS 'Hora de reinicio diario del sistema (formato HH:MM:SS)';

-- Insertar configuración por defecto (8:00 AM)
INSERT INTO configuracion_general (hora_reinicio)
VALUES ('08:00:00')
ON CONFLICT DO NOTHING;

-- Verificar que la tabla se creó correctamente
SELECT * FROM configuracion_general;
