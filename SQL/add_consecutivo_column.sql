-- Agregar columna consecutivo_dia a la tabla pedidos
-- Esta columna almacena un número secuencial que se reinicia cada día

ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS consecutivo_dia INTEGER;

COMMENT ON COLUMN pedidos.consecutivo_dia IS 'Número consecutivo del pedido en el día (se reinicia diariamente a las 8 AM)';

-- Crear índice para mejorar el rendimiento al buscar el último consecutivo
CREATE INDEX IF NOT EXISTS idx_pedidos_consecutivo_dia
ON pedidos(consecutivo_dia DESC, created_at DESC);

-- Verificar que la columna se creó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos' AND column_name = 'consecutivo_dia';
