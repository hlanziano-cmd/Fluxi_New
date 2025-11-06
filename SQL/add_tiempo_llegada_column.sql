-- Agregar columna tiempo_llegada a la tabla pedidos
-- Esta columna almacena el timestamp cuando el domiciliario marca "Llegué al Sitio"

ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS tiempo_llegada BIGINT;

COMMENT ON COLUMN pedidos.tiempo_llegada IS 'Timestamp en milisegundos cuando el domiciliario marca que llegó al sitio de entrega';

-- Crear índice para mejorar consultas de tiempos
CREATE INDEX IF NOT EXISTS idx_pedidos_tiempo_llegada
ON pedidos(tiempo_llegada DESC, created_at DESC);

-- Verificar que la columna se creó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos'
  AND column_name = 'tiempo_llegada';
