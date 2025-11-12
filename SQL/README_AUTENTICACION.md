# Sistema de Autenticación de Fluxi

## 📋 Descripción

Se ha implementado un sistema completo de autenticación con contraseñas para controlar el acceso a la aplicación Fluxi. Ahora todos los usuarios deben iniciar sesión con email y contraseña antes de poder acceder al sistema.

## 🔐 Credenciales del Superusuario

Se ha creado automáticamente un superusuario con las siguientes credenciales:

```
Email:      admin@fluxicloud.com
Contraseña: Fluxi2025!
```

**⚠️ IMPORTANTE:** Esta es una contraseña temporal. Se recomienda cambiarla inmediatamente después del primer inicio de sesión desde la sección "Gestión de Usuarios".

## 🚀 Pasos para Habilitar la Autenticación

### 1. Ejecutar el Script SQL

Primero debes ejecutar el script SQL que agrega las columnas necesarias y crea el superusuario:

1. Accede a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega el contenido del archivo `add_password_to_usuarios.sql`
5. Ejecuta la query (botón **RUN** o Ctrl+Enter)

### 2. Verificar la Tabla

Para verificar que las columnas se agregaron correctamente:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios';
```

Deberías ver las nuevas columnas:
- `password` (text)
- `is_superuser` (boolean)

### 3. Verificar el Superusuario

Para verificar que el superusuario se creó correctamente:

```sql
SELECT nombre, email, rol, is_superuser, created_at
FROM usuarios
WHERE email = 'admin@fluxicloud.com';
```

### 4. Configurar Row Level Security (Opcional)

Si tienes Row Level Security (RLS) habilitado en la tabla `usuarios`, asegúrate de tener políticas que permitan:

```sql
-- Permitir lectura para autenticación
CREATE POLICY "Permitir lectura de usuarios para login"
ON usuarios FOR SELECT
TO anon, authenticated
USING (true);
```

**Nota:** Por razones de seguridad, considera limitar el acceso a la columna `password` en producción.

## 📱 Cómo Usar el Sistema

### Iniciar Sesión

1. Accede a: `https://www.fluxicloud.com/login`
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido automáticamente a la aplicación principal

### Crear Nuevos Usuarios

1. Inicia sesión como administrador
2. Ve a **👥 Gestión de Usuarios**
3. Haz clic en **+ Nuevo Usuario**
4. Completa el formulario:
   - **Nombre Completo**
   - **Email** (se usará para login)
   - **Teléfono** (opcional)
   - **Contraseña** (mínimo 6 caracteres)
   - **Verificar Contraseña** (debe coincidir)
   - **Rol** (Administrador o Visualizador)
   - **Estado** (Activo o Inactivo)
5. Haz clic en **Guardar**

**Características del formulario:**
- 👁️ **Botón de ojito:** Permite ver/ocultar la contraseña
- ✓ **Validación en tiempo real:** Muestra si las contraseñas coinciden
- 🔒 **Mínimo 6 caracteres:** Validación de longitud de contraseña

### Editar Usuarios Existentes

Al editar un usuario:
- Los campos de contraseña son **opcionales**
- Si dejas las contraseñas vacías, se mantendrá la contraseña actual
- Si ingresas una nueva contraseña, se actualizará

### Cerrar Sesión

1. Haz clic en el botón **🚪 Cerrar Sesión** en la parte inferior del menú lateral
2. Confirma que deseas cerrar sesión
3. Serás redirigido a la página de login

### Duración de Sesión

- Las sesiones duran **24 horas**
- Después de 24 horas, deberás iniciar sesión nuevamente
- La sesión se guarda en `localStorage` del navegador

## 🎨 Interfaz de Login

La página de login incluye:
- ✨ Diseño moderno con gradiente azul de FluxiCloud
- 📱 Responsive (se adapta a móviles)
- 👁️ Toggle para ver/ocultar contraseña
- ⚠️ Mensajes de error claros
- ⏳ Indicador de carga durante el proceso
- 🎯 Focus automático en el campo de email

## 🔒 Seguridad

### Características Implementadas

✅ **Validación de contraseñas:** Mínimo 6 caracteres
✅ **Verificación de coincidencia:** Doble entrada de contraseña
✅ **Sesiones con expiración:** 24 horas de validez
✅ **Protección de rutas:** Redirección automática si no hay sesión
✅ **Estados de usuario:** Solo usuarios activos pueden iniciar sesión
✅ **Roles de usuario:** Diferenciación entre administrador y visualizador

### Recomendaciones de Seguridad

⚠️ **IMPORTANTE:** Las contraseñas actualmente se almacenan en **texto plano** en la base de datos por simplicidad. Para un entorno de producción, se recomienda:

1. **Implementar hashing de contraseñas:**
   ```javascript
   // Usar bcrypt o similar
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Usar funciones de Supabase:**
   ```javascript
   // Autenticación nativa de Supabase
   const { data, error } = await supabase.auth.signUp({
     email: email,
     password: password
   });
   ```

3. **Agregar autenticación de dos factores (2FA)**

4. **Implementar límite de intentos de login**

5. **Agregar HTTPS obligatorio**

6. **Registrar intentos de login fallidos**

## 📂 Estructura de Archivos

```
Fluxi_New/
├── login.html                          # Página de login
├── index.html                          # Aplicación principal (protegida)
├── SQL/
│   ├── add_password_to_usuarios.sql    # Script de migración
│   └── README_AUTENTICACION.md         # Este archivo
```

## 🔧 Estructura de la Base de Datos

### Tabla: usuarios

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID | Identificador único |
| nombre | TEXT | Nombre completo del usuario |
| email | TEXT | Email (usado para login) |
| password | TEXT | Contraseña del usuario |
| telefono | TEXT | Teléfono (opcional) |
| rol | TEXT | Rol (administrador/visualizador) |
| estado | TEXT | Estado (activo/inactivo) |
| is_superuser | BOOLEAN | Indica si es superusuario |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Fecha de actualización |

### Sesión en localStorage

```json
{
  "userId": "uuid-del-usuario",
  "email": "usuario@ejemplo.com",
  "nombre": "Nombre del Usuario",
  "rol": "administrador",
  "timestamp": 1705234567890
}
```

## 🐛 Solución de Problemas

### No puedo iniciar sesión con el superusuario

**Solución:**
1. Verifica que ejecutaste el script SQL correctamente
2. Confirma las credenciales:
   - Email: `admin@fluxicloud.com`
   - Contraseña: `Fluxi2025!` (distingue mayúsculas/minúsculas)
3. Verifica en Supabase:
   ```sql
   SELECT * FROM usuarios WHERE email = 'admin@fluxicloud.com';
   ```

### La sesión se cierra automáticamente

**Causas posibles:**
- La sesión expiró (24 horas)
- Limpiaste el localStorage del navegador
- Hay un error en el formato de la sesión

**Solución:** Inicia sesión nuevamente

### No aparece el botón de cerrar sesión

**Solución:**
1. Refresca la página con Ctrl+F5
2. Verifica que hay una sesión activa en localStorage
3. Revisa la consola del navegador para errores

### Error: "relation usuarios does not exist"

**Solución:** La tabla `usuarios` no existe en tu base de datos. Debes crearla primero o ejecutar las migraciones iniciales de Fluxi.

### Error: "column password does not exist"

**Solución:** No ejecutaste el script `add_password_to_usuarios.sql`. Ve a Supabase SQL Editor y ejecútalo.

### Los usuarios existentes no pueden iniciar sesión

**Problema:** Los usuarios creados antes de implementar autenticación no tienen contraseñas.

**Solución:** Edita cada usuario desde "Gestión de Usuarios" y asigna una contraseña.

O ejecuta este SQL para asignar contraseñas temporales:

```sql
-- Asignar contraseña temporal a todos los usuarios sin contraseña
UPDATE usuarios
SET password = 'Temporal123!'
WHERE password IS NULL OR password = '';
```

Luego pide a cada usuario que cambie su contraseña.

## 📊 Consultas Útiles

### Ver todos los usuarios

```sql
SELECT nombre, email, rol, estado, is_superuser, created_at
FROM usuarios
ORDER BY created_at DESC;
```

### Ver usuarios activos

```sql
SELECT nombre, email, rol
FROM usuarios
WHERE estado = 'activo'
ORDER BY nombre;
```

### Ver superusuarios

```sql
SELECT nombre, email, is_superuser
FROM usuarios
WHERE is_superuser = TRUE;
```

### Cambiar contraseña de un usuario

```sql
UPDATE usuarios
SET password = 'NuevaContraseña123', updated_at = NOW()
WHERE email = 'usuario@ejemplo.com';
```

### Activar/Desactivar usuario

```sql
-- Desactivar
UPDATE usuarios
SET estado = 'inactivo', updated_at = NOW()
WHERE email = 'usuario@ejemplo.com';

-- Activar
UPDATE usuarios
SET estado = 'activo', updated_at = NOW()
WHERE email = 'usuario@ejemplo.com';
```

### Crear un nuevo usuario manualmente

```sql
INSERT INTO usuarios (nombre, email, password, rol, estado, created_at)
VALUES (
    'Nuevo Usuario',
    'nuevo@ejemplo.com',
    'ContraseñaSegura123',
    'administrador',
    'activo',
    NOW()
);
```

## 📱 Acceso a la Aplicación

- **Página de Login:** https://www.fluxicloud.com/login
- **Aplicación Principal:** https://www.fluxicloud.com/ (redirige a login si no hay sesión)

## 🎯 Próximos Pasos

Una vez configurado el sistema de autenticación:

1. ✅ Inicia sesión con el superusuario
2. ✅ Cambia la contraseña del superusuario
3. ✅ Crea usuarios para tu equipo
4. ✅ Asigna contraseñas a usuarios existentes (si los hay)
5. ✅ Prueba el login con diferentes usuarios
6. ✅ Configura roles y permisos según necesites

## 📞 Soporte

Si encuentras problemas:
1. Revisa esta documentación
2. Verifica la consola del navegador para errores
3. Revisa los logs de Supabase
4. Contacta al administrador del sistema
