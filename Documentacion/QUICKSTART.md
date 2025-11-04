# 🚀 Guía de Inicio Rápido - Fluxi

## Configuración Inicial (5 minutos)

### 1. Verificar Archivos del Proyecto

Asegúrate de tener esta estructura:
```
fluxi-project/
├── index.html                      # ✅ Panel Admin
├── app-domiciliarios.html          # ✅ App Móvil
├── index-original.html             # 📦 Backup monolítico
├── app-domiciliarios-original.html # 📦 Backup monolítico
├── css/
│   ├── common.css                  # ✅ Estilos compartidos
│   ├── admin.css                   # ✅ Estilos admin
│   └── mobile.css                  # ✅ Estilos móvil
├── js/
│   ├── config.js                   # ✅ Configuración
│   ├── admin/                      # 📂 Módulos admin
│   └── mobile/                     # 📂 Módulos móvil
│       ├── location.js             # ✅ GPS tracking
│       └── orders.js               # ✅ Gestión pedidos
└── README.md                       # ✅ Documentación
```

### 2. Configurar Supabase

1. **Abrir `js/config.js`**
2. **Actualizar credenciales** (si son diferentes):
   ```javascript
   const SUPABASE_URL = 'https://kpqcqjhhqwezwvnzwnnb.supabase.co';
   const SUPABASE_KEY = 'eyJhbGci...';
   ```

### 3. Probar Localmente

#### Opción A: Python Simple Server
```bash
cd fluxi-project
python -m http.server 8000
```

#### Opción B: PHP
```bash
cd fluxi-project
php -S localhost:8000
```

#### Opción C: Node.js http-server
```bash
npm install -g http-server
cd fluxi-project
http-server -p 8000
```

Luego abre:
- **Admin**: http://localhost:8000/index.html
- **Mobile**: http://localhost:8000/app-domiciliarios.html

## Uso de Archivos Originales vs Modulares

### 📦 Archivos Originales (Funcionan ahora)
- `index-original.html` - Panel admin completo (todo inline)
- `app-domiciliarios-original.html` - App móvil completa (todo inline)

**Ventajas**: 
- ✅ Funciona inmediatamente sin cambios
- ✅ Todo el código en un solo archivo
- ✅ No requiere servidor HTTP local

**Desventajas**:
- ❌ Difícil de mantener
- ❌ Archivos muy grandes (2500+ líneas)
- ❌ No reutiliza código

### 🔧 Archivos Modulares (Nueva arquitectura)
- `index.html` - Panel admin (carga módulos)
- `app-domiciliarios.html` - App móvil (carga módulos)

**Ventajas**:
- ✅ Código organizado y mantenible
- ✅ Reutilización de código
- ✅ Fácil de escalar
- ✅ Mejor para trabajo en equipo

**Desventajas**:
- ⚠️ Requiere servidor HTTP (por seguridad CORS)
- ⚠️ Necesita cargar múltiples archivos

## Migración Gradual

### Recomendación para Producción Actual:

**USAR LOS ARCHIVOS ORIGINALES** hasta completar la migración:

1. **Hoy**: Usa `index-original.html` y `app-domiciliarios-original.html`
2. **Desarrollo**: Trabaja en la versión modular paralelamente
3. **Testing**: Prueba módulo por módulo
4. **Migración**: Cambia a versión modular cuando esté lista

## Checklist de Implementación Modular

Para completar la modularización, necesitas:

### Panel Admin (index.html)
- [ ] Extraer todo el JavaScript a módulos en `js/admin/`
- [ ] Crear `dashboard.js` para KPIs y gráficos
- [ ] Crear `orders.js` para gestión de pedidos
- [ ] Crear `deliveries.js` para gestión de domiciliarios
- [ ] Crear `customers.js` para gestión de clientes
- [ ] Actualizar `index.html` para cargar módulos

### App Móvil (app-domiciliarios.html)
- [x] ✅ Módulo `location.js` creado
- [x] ✅ Módulo `orders.js` creado
- [ ] Crear `auth.js` para login
- [ ] Crear `realtime.js` para notificaciones
- [ ] Actualizar `app-domiciliarios.html` para cargar módulos

### Testing
- [ ] Probar todos los módulos individualmente
- [ ] Verificar compatibilidad entre navegadores
- [ ] Probar en dispositivos móviles reales
- [ ] Validar tracking GPS en condiciones reales

## Flujo de Trabajo Recomendado

### Día a Día (Corto Plazo)
```
1. Usar archivos originales (-original.html) para operación diaria
2. Trabajar en módulos JS cuando tengas tiempo
3. Probar cada módulo individualmente
4. No cambiar a producción hasta estar 100% probado
```

### Desarrollo (Mediano Plazo)
```
1. Completar todos los módulos JS
2. Actualizar archivos HTML principales
3. Testing exhaustivo en local
4. Deploy en ambiente de staging
5. Testing con usuarios reales
6. Migración a producción
```

## Scripts Útiles

### Validar Estructura
```bash
cd fluxi-project
ls -R
```

### Verificar Dependencias (archivos HTML originales)
```bash
# Ver si tienes Supabase configurado
grep -r "supabase.createClient" index-original.html

# Ver versión de Leaflet
grep -r "leaflet" index-original.html
```

### Backup Rápido
```bash
# Crear backup con timestamp
tar -czf fluxi-backup-$(date +%Y%m%d).tar.gz fluxi-project/
```

## Solución Rápida de Problemas

### ❌ "No se cargan los módulos JS"
**Causa**: No estás usando servidor HTTP
**Solución**: Usa `python -m http.server 8000` o similar

### ❌ "GPS no funciona"
**Causa**: Necesitas HTTPS para geolocation API
**Solución**: En producción, usa HTTPS. En local, usa localhost (permitido)

### ❌ "Supabase error: Invalid API key"
**Causa**: Credenciales incorrectas
**Solución**: Verifica `SUPABASE_URL` y `SUPABASE_KEY` en `config.js`

### ❌ "Real-time no actualiza"
**Causa**: No hay suscripción activa
**Solución**: Verifica que `realtime` esté habilitado en Supabase

## Próximos Pasos

1. ✅ **Verificar** que los archivos originales funcionen
2. 🔄 **Revisar** la estructura modular creada
3. 📝 **Completar** módulos JS faltantes (según checklist)
4. 🧪 **Probar** cada módulo individualmente
5. 🚀 **Migrar** gradualmente a versión modular

## Contacto y Soporte

- 📖 **Documentación completa**: Ver README.md
- 🏗️ **Arquitectura**: Ver docs/ARCHITECTURE.md
- 🐛 **Reportar problemas**: Crear issue en repositorio

---

**¿Listo para empezar?** 

**Paso 1**: Abre los archivos originales y verifica que funcionan
**Paso 2**: Revisa la estructura modular
**Paso 3**: Decide tu estrategia de migración

¡Éxito con tu proyecto Fluxi! 🚀
