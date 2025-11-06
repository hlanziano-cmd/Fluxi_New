-- Agregar 'rappi' como método de pago válido
-- Este script actualiza el constraint CHECK para incluir 'rappi' además de 'efectivo' y 'datafono'

-- 1. Eliminar el constraint existente
ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_metodo_pago_check;

-- 2. Crear nuevo constraint que incluye 'rappi'
ALTER TABLE pedidos
ADD CONSTRAINT pedidos_metodo_pago_check
CHECK (metodo_pago IN ('efectivo', 'datafono', 'rappi'));

-- 3. Verificar que el constraint se creó correctamente
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'pedidos'::regclass
  AND conname = 'pedidos_metodo_pago_check';

-- 4. Verificar los métodos de pago actualmente en uso
SELECT
    metodo_pago,
    COUNT(*) as cantidad
FROM pedidos
GROUP BY metodo_pago
ORDER BY metodo_pago;
