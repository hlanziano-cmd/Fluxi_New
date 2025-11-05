-- Script paso a paso para corregir el constraint de metodo_pago
-- Ejecuta cada sección por separado y verifica el resultado

-- ========================================
-- PASO 1: Ver la restricción actual
-- ========================================
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'pedidos'::regclass
  AND conname LIKE '%metodo_pago%';

-- Después de ejecutar esto, verás qué restricción existe actualmente
-- Copia el nombre EXACTO de la restricción y úsalo en el siguiente paso


-- ========================================
-- PASO 2: Eliminar la restricción (usa el nombre exacto que viste arriba)
-- ========================================
-- Si el nombre es diferente, cámbialo aquí:
ALTER TABLE pedidos DROP CONSTRAINT pedidos_metodo_pago_check;

-- Si da error de que no existe, prueba con estos nombres:
-- ALTER TABLE pedidos DROP CONSTRAINT pedidos_check;
-- ALTER TABLE pedidos DROP CONSTRAINT check_metodo_pago;


-- ========================================
-- PASO 3: Actualizar todos los pedidos existentes
-- ========================================
UPDATE pedidos
SET metodo_pago = 'datafono'
WHERE metodo_pago = 'tarjeta';

-- Ver el resultado:
SELECT
    metodo_pago,
    COUNT(*) as cantidad
FROM pedidos
GROUP BY metodo_pago
ORDER BY metodo_pago;


-- ========================================
-- PASO 4: Crear la nueva restricción
-- ========================================
ALTER TABLE pedidos
ADD CONSTRAINT pedidos_metodo_pago_check
CHECK (metodo_pago IN ('efectivo', 'datafono'));


-- ========================================
-- PASO 5: Verificar que todo funcionó
-- ========================================
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'pedidos'::regclass
  AND conname = 'pedidos_metodo_pago_check';
