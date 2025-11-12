-- ============================================
-- FIX: Row Level Security para Login
-- ============================================
-- Este script soluciona el error 401 (Unauthorized) al intentar hacer login

-- OPCIÓN 1: Deshabilitar RLS en la tabla usuarios (más simple, menos seguro)
-- Usar esta opción si quieres acceso completo sin restricciones
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- OPCIÓN 2: Habilitar RLS con políticas permisivas (recomendado)
-- Comentar la línea anterior y descomentar las siguientes si prefieres esta opción:

/*
-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Permitir lectura pública de usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserción pública de usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir actualización pública de usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir eliminación pública de usuarios" ON usuarios;

-- Política 1: Permitir lectura para autenticación (anon puede leer para login)
CREATE POLICY "Permitir lectura de usuarios para login"
ON usuarios FOR SELECT
TO anon, authenticated
USING (true);

-- Política 2: Permitir inserción para usuarios autenticados (crear usuarios)
CREATE POLICY "Permitir inserción de usuarios"
ON usuarios FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política 3: Permitir actualización para usuarios autenticados
CREATE POLICY "Permitir actualización de usuarios"
ON usuarios FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política 4: Permitir eliminación para usuarios autenticados
CREATE POLICY "Permitir eliminación de usuarios"
ON usuarios FOR DELETE
TO authenticated
USING (true);
*/

-- Verificar el estado actual
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'usuarios';

-- Mostrar políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'usuarios';
