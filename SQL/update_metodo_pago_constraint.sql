-- Actualizar constraint de metodo_pago para incluir 'datafono'
-- Este script modifica la restricción CHECK existente

-- 1. PRIMERO: Actualizar pedidos existentes que tengan 'tarjeta' a 'datafono'
--    (Esto debe hacerse ANTES de eliminar la restricción antigua)
UPDATE pedidos
SET metodo_pago = 'datafono'
WHERE metodo_pago = 'tarjeta';

-- 2. Verificar que no quedan pedidos con 'tarjeta'
SELECT
    metodo_pago,
    COUNT(*) as cantidad
FROM pedidos
GROUP BY metodo_pago
ORDER BY metodo_pago;

-- 3. Eliminar la restricción antigua
ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_metodo_pago_check;

-- 4. Crear nueva restricción que incluye 'datafono' en lugar de 'tarjeta'
ALTER TABLE pedidos
ADD CONSTRAINT pedidos_metodo_pago_check
CHECK (metodo_pago IN ('efectivo', 'datafono'));

-- 5. Verificar que la restricción se actualizó correctamente
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'pedidos'::regclass
  AND conname = 'pedidos_metodo_pago_check';
