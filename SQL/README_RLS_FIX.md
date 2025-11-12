# 🔓 Solución al Error 401 (Unauthorized)

## 🔍 Problema

Al intentar iniciar sesión en Fluxi, aparece el error:
```
GET https://lbifbexhmvbanvrjfglp.supabase.co/rest/v1/usuarios?... 401 (Unauthorized)
```

Este error ocurre porque **Row Level Security (RLS)** está habilitado en la tabla `usuarios` pero no hay políticas que permitan el acceso.

## ✅ Solución Rápida (Recomendada)

Sigue estos pasos para solucionar el problema:

### Paso 1: Acceder a Supabase

1. Ve a [Supabase](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral

### Paso 2: Ejecutar el Script

Copia y pega UNO de los siguientes scripts:

#### **Opción A: Deshabilitar RLS (Más Simple)**

```sql
-- Deshabilitar Row Level Security en la tabla usuarios
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
```

✅ **Ventajas:**
- Solución inmediata
- Acceso completo sin restricciones

⚠️ **Desventajas:**
- Menos seguro en producción
- Cualquiera con la API Key puede acceder

---

#### **Opción B: RLS con Políticas (Más Seguro)**

```sql
-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Permitir lectura de usuarios para login" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserción de usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir actualización de usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir eliminación de usuarios" ON usuarios;

-- Crear políticas nuevas
CREATE POLICY "Permitir lectura de usuarios para login"
ON usuarios FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Permitir inserción de usuarios"
ON usuarios FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir actualización de usuarios"
ON usuarios FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir eliminación de usuarios"
ON usuarios FOR DELETE
TO authenticated
USING (true);
```

✅ **Ventajas:**
- Más seguro
- Control granular de permisos

⚠️ **Nota:**
- Requiere usuarios autenticados para crear/editar

### Paso 3: Verificar la Configuración

Ejecuta este script para verificar:

```sql
-- Ver estado de RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'usuarios';

-- Ver políticas activas
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'usuarios';
```

**Resultado esperado:**

**Con Opción A (RLS Deshabilitado):**
```
tablename | rowsecurity
----------|------------
usuarios  | false
```

**Con Opción B (RLS con Políticas):**
```
tablename | policyname                           | roles                  | cmd
----------|--------------------------------------|------------------------|--------
usuarios  | Permitir lectura de usuarios...      | {anon,authenticated}   | SELECT
usuarios  | Permitir inserción de usuarios       | {authenticated}        | INSERT
usuarios  | Permitir actualización de usuarios   | {authenticated}        | UPDATE
usuarios  | Permitir eliminación de usuarios     | {authenticated}        | DELETE
```

### Paso 4: Probar el Login

1. Refresca la página de login (Ctrl + F5)
2. Ingresa:
   - **Email:** `admin@fluxicloud.com`
   - **Contraseña:** `Fluxi2025!`
3. Haz clic en "Iniciar Sesión"

## 🔐 Recomendaciones de Seguridad

### Para Desarrollo:
- ✅ Usa la **Opción A** (RLS deshabilitado) para facilidad de desarrollo

### Para Producción:
- ✅ Usa la **Opción B** (RLS con políticas)
- ✅ Implementa hashing de contraseñas
- ✅ Usa autenticación de Supabase nativa
- ✅ Implementa 2FA
- ✅ Agrega límite de intentos de login

## 🐛 Otros Problemas Comunes

### Error: "password column does not exist"

**Solución:**
Ejecuta el script `add_password_to_usuarios.sql` primero:

```sql
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT FALSE;
```

### Error: "relation usuarios does not exist"

**Solución:**
Crea la tabla `usuarios` primero. Verifica que existe ejecutando:

```sql
SELECT * FROM usuarios LIMIT 1;
```

### El superusuario no existe

**Solución:**
Ejecuta:

```sql
INSERT INTO usuarios (nombre, email, telefono, rol, estado, password, is_superuser, created_at)
VALUES (
    'Superadministrador Fluxi',
    'admin@fluxicloud.com',
    '+573001234567',
    'administrador',
    'activo',
    'Fluxi2025!',
    TRUE,
    NOW()
)
ON CONFLICT (email) DO NOTHING;
```

### Verificar que el superusuario existe

```sql
SELECT nombre, email, password, estado, is_superuser
FROM usuarios
WHERE email = 'admin@fluxicloud.com';
```

Deberías ver:
```
nombre                      | email                    | password    | estado | is_superuser
----------------------------|--------------------------|-------------|--------|-------------
Superadministrador Fluxi    | admin@fluxicloud.com     | Fluxi2025!  | activo | true
```

## 📊 Verificación Completa

Ejecuta este script completo para verificar todo:

```sql
-- 1. Verificar que la tabla existe
SELECT 'Tabla usuarios existe' as verificacion
WHERE EXISTS (SELECT FROM pg_tables WHERE tablename = 'usuarios');

-- 2. Verificar que las columnas existen
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
AND column_name IN ('password', 'is_superuser');

-- 3. Verificar RLS
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'usuarios';

-- 4. Verificar políticas
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'usuarios';

-- 5. Verificar superusuario
SELECT nombre, email, estado, is_superuser
FROM usuarios
WHERE email = 'admin@fluxicloud.com';
```

## 🎯 Resumen de Pasos

1. ✅ Ejecutar `add_password_to_usuarios.sql` (si no lo hiciste)
2. ✅ Ejecutar **Opción A** o **Opción B** de este script
3. ✅ Verificar con los scripts de verificación
4. ✅ Refrescar login.html e intentar iniciar sesión
5. ✅ Si funciona, cambiar contraseña del superusuario

## 📞 Soporte

Si después de seguir estos pasos aún tienes problemas:

1. Verifica la consola del navegador (F12)
2. Revisa los logs de Supabase (Dashboard > Logs)
3. Verifica que la URL de Supabase sea correcta
4. Confirma que ejecutaste todos los scripts en orden

## 🔗 Archivos Relacionados

- `add_password_to_usuarios.sql` - Crear columnas de autenticación
- `fix_usuarios_rls.sql` - Script completo de este README
- `README_AUTENTICACION.md` - Documentación completa del sistema de autenticación
