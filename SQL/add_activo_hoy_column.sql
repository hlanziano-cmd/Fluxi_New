-- Agregar columna activo_hoy a la tabla configuracion_diaria
-- Esta columna determina si un domiciliario está disponible para asignar pedidos

-- 1. Agregar columna activo_hoy (boolean, default true)
ALTER TABLE configuracion_diaria
ADD COLUMN IF NOT EXISTS activo_hoy BOOLEAN DEFAULT true;

-- 2. Agregar comentario explicativo
COMMENT ON COLUMN configuracion_diaria.activo_hoy IS 'Indica si el domiciliario está activo y disponible para asignar pedidos en este día';

-- 3. Actualizar registros existentes para marcarlos como activos
-- (Asumimos que si ya existe un registro, el domiciliario estaba activo)
UPDATE configuracion_diaria
SET activo_hoy = true
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
