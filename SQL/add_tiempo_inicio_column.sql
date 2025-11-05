-- Agregar columnas de tiempo a la tabla pedidos
-- Estas columnas almacenan timestamps del ciclo de vida del pedido

-- 1. tiempo_aceptacion: Cuando el domiciliario acepta el pedido
ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS tiempo_aceptacion BIGINT;

COMMENT ON COLUMN pedidos.tiempo_aceptacion IS 'Timestamp en milisegundos cuando el domiciliario acepta el pedido';

-- 2. tiempo_inicio: Cuando el domiciliario inicia la entrega
ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS tiempo_inicio BIGINT;

COMMENT ON COLUMN pedidos.tiempo_inicio IS 'Timestamp en milisegundos cuando el domiciliario inicia la entrega (estado cambia a en_camino)';

-- 3. tiempo_entrega: Cuando el domiciliario completa la entrega
ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS tiempo_entrega BIGINT;

COMMENT ON COLUMN pedidos.tiempo_entrega IS 'Timestamp en milisegundos cuando el domiciliario completa la entrega';

-- Verificar que las columnas se crearon correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos'
  AND column_name IN ('tiempo_aceptacion', 'tiempo_inicio', 'tiempo_entrega')
ORDER BY column_name;
