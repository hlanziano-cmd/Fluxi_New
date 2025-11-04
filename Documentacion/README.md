# 🚀 Fluxi - Sistema de Gestión de Domicilios

Sistema completo de gestión de entregas a domicilio para Colombia, con panel administrativo y aplicación móvil para domiciliarios.

## 📋 Descripción

Fluxi es una plataforma integral que permite:
- Gestionar pedidos en tiempo real
- Rastrear ubicación GPS de domiciliarios
- Administrar flota de domiciliarios
- Generar reportes y estadísticas
- Integración con WhatsApp para comunicación

## 🏗️ Estructura del Proyecto

```
fluxi-project/
├── index.html                  # Panel administrativo (entrada)
├── app-domiciliarios.html      # App móvil para domiciliarios
├── css/
│   ├── common.css             # Estilos compartidos
│   ├── admin.css              # Estilos del panel admin
│   └── mobile.css             # Estilos de app móvil
├── js/
│   ├── config.js              # Configuración y utilidades compartidas
│   ├── admin/                 # Módulos del panel administrativo
│   │   ├── dashboard.js       # Dashboard y estadísticas
│   │   ├── orders.js          # Gestión de pedidos
│   │   ├── deliveries.js      # Gestión de domiciliarios
│   │   └── customers.js       # Gestión de clientes
│   └── mobile/                # Módulos de app móvil
│       ├── auth.js            # Autenticación de domiciliarios
│       ├── orders.js          # Gestión de pedidos del domiciliario
│       ├── location.js        # Tracking GPS
│       └── realtime.js        # Actualizaciones en tiempo real
├── assets/
│   └── images/                # Imágenes y recursos
└── docs/
    └── API.md                 # Documentación de API

```

## 🔧 Tecnologías Utilizadas

### Frontend
- **HTML5, CSS3, JavaScript (Vanilla)** - Sin frameworks para máximo rendimiento
- **Leaflet.js** - Mapas interactivos y tracking GPS
- **Chart.js** - Gráficos y estadísticas

### Backend
- **Supabase** - Base de datos PostgreSQL y autenticación
- **Real-time subscriptions** - Actualizaciones en tiempo real

### Integraciones
- **Google Maps API** - Geocodificación y rutas
- **WhatsApp API** - Comunicación con clientes

## 🚀 Instalación

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet
- Cuenta de Supabase configurada

### Configuración

1. **Clonar o descargar el proyecto**
```bash
git clone [url-del-repo]
cd fluxi-project
```

2. **Configurar Supabase**
   - Editar `js/config.js` con tus credenciales:
   ```javascript
   const SUPABASE_URL = 'tu-url-de-supabase';
   const SUPABASE_KEY = 'tu-clave-anonima';
   ```

3. **Configurar base de datos**
   - Crear las siguientes tablas en Supabase:
     - `usuarios`
     - `domiciliarios`
     - `pedidos`
     - `clientes`
   - Configurar Row Level Security (RLS)

4. **Desplegar**
   - Subir archivos a servidor web
   - O servir localmente con:
   ```bash
   python -m http.server 8000
   # O usar cualquier servidor HTTP
   ```

## 📱 Uso

### Panel Administrativo
Acceder a `index.html` para:
- Ver dashboard con estadísticas en tiempo real
- Crear y gestionar pedidos
- Administrar domiciliarios
- Ver mapa de tracking en vivo
- Generar reportes

### App Móvil para Domiciliarios
Acceder a `app-domiciliarios.html` para:
- Iniciar sesión con número de teléfono
- Ver pedidos asignados
- Activar/desactivar tracking GPS
- Marcar inicio y fin de entregas
- Ver tiempo transcurrido

## 🔐 Seguridad

- Autenticación mediante Supabase
- Row Level Security (RLS) en base de datos
- Validaciones de datos en cliente y servidor
- HTTPS obligatorio en producción

## 🎨 Personalización

### Colores del Brand
Editar en `css/common.css`:
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--success-color: #27ae60;
--danger-color: #e74c3c;
```

### Funcionalidades Adicionales
Los módulos en `js/admin/` y `js/mobile/` pueden extenderse fácilmente.

## 📊 Características Principales

### Dashboard
- ✅ Métricas en tiempo real
- ✅ Gráficos de ingresos
- ✅ Distribución de pedidos
- ✅ Filtros por fecha, domiciliario, datáfono
- ✅ Exportación de reportes

### Gestión de Pedidos
- ✅ Creación rápida de pedidos
- ✅ Asignación automática o manual
- ✅ Estados: pendiente → asignado → en_camino → entregado
- ✅ Tracking en tiempo real
- ✅ Integración con WhatsApp

### Domiciliarios
- ✅ Gestión de flota
- ✅ Estados: disponible / ocupado / inactivo
- ✅ Tracking GPS en tiempo real
- ✅ Historial de entregas
- ✅ Estadísticas por domiciliario

### App Móvil
- ✅ Interfaz optimizada para móvil
- ✅ Modo offline (almacenamiento local)
- ✅ Notificaciones de nuevos pedidos
- ✅ Temporizador de entrega
- ✅ Compartir ubicación en tiempo real

## 🔄 Actualizaciones en Tiempo Real

El sistema utiliza Supabase Real-time para:
- Notificar nuevos pedidos a domiciliarios
- Actualizar ubicaciones en el mapa
- Sincronizar estados de pedidos
- Alertas de cambios en el sistema

## 🐛 Solución de Problemas

### Problema: Mapa no carga
- Verificar conexión a internet
- Revisar clave de Google Maps API
- Comprobar permisos de geolocalización

### Problema: No se actualizan pedidos
- Verificar conexión a Supabase
- Revisar configuración de RLS
- Comprobar suscripciones real-time

### Problema: GPS no funciona en app móvil
- Activar permisos de ubicación en navegador
- Usar HTTPS (requerido para geolocation API)
- Verificar que el dispositivo tiene GPS activo

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@fluxi.com
- Documentación: [docs/API.md](docs/API.md)

## 📝 Licencia

Proyecto propietario - Todos los derechos reservados

## 🔮 Roadmap

- [ ] App nativa Android/iOS
- [ ] Integración con datáfonos
- [ ] Sistema de calificaciones
- [ ] Panel de analíticas avanzado
- [ ] Múltiples sucursales
- [ ] API pública para integraciones

## 👨‍💻 Desarrollo

### Ambiente de Desarrollo
```bash
# Instalar servidor local
npm install -g http-server

# Ejecutar
http-server -p 8000

# Abrir en navegador
# Admin: http://localhost:8000/index.html
# Mobile: http://localhost:8000/app-domiciliarios.html
```

### Convenciones de Código
- Usar camelCase para variables y funciones
- Comentarios en español
- Modularizar código en archivos separados
- Seguir estructura de carpetas establecida

### Testing
- Probar en Chrome, Firefox, Safari
- Validar en dispositivos móviles reales
- Verificar funcionalidad offline
- Comprobar rendimiento con múltiples usuarios

---

**Desarrollado con ❤️ para optimizar entregas en Colombia** 🇨🇴
