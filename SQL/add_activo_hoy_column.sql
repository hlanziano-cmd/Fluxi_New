-- Agregar columna activo_hoy a la tabla configuracion_diaria
-- Esta columna determina si un domiciliario está disponible para asignar pedidos

-- 1. Agregar columna activo_hoy (boolean, default false - NO DISPONIBLE por defecto)
ALTER TABLE configuracion_diaria
ADD COLUMN IF NOT EXISTS activo_hoy BOOLEAN DEFAULT false;

-- 2. Agregar comentario explicativo
COMMENT ON COLUMN configuracion_diaria.activo_hoy IS 'Indica si el domiciliario está activo y disponible para asignar pedidos en este día. Por defecto false (No disponible)';

-- 3. Actualizar registros existentes
-- Los registros existentes se marcan como activos porque ya tienen valor_arranque configurado
UPDATE configuracion_diaria
SET activo_hoy = CASE
    WHEN valor_arranque > 0 THEN true
    ELSE false
END
WHERE activo_hoy IS NULL;

-- 4. Verificar que la columna se creó correctamente
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'configuracion_diaria'
  AND column_name = 'activo_hoy';

-- 5. Ver algunos registros de ejemplo
SELECT
    fecha,
    domiciliario_id,
    activo_hoy,
    valor_arranque
FROM configuracion_diaria
ORDER BY fecha DESC, domiciliario_id
LIMIT 10;
