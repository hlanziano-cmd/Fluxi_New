# 📐 Arquitectura del Proyecto Fluxi

## Visión General

Fluxi está diseñado con una arquitectura modular que separa claramente las responsabilidades entre:
- **Frontend Admin**: Panel de control web
- **Frontend Mobile**: Aplicación progresiva para domiciliarios
- **Backend**: Supabase (PostgreSQL + Real-time)

## Estructura de Archivos

### Archivos Originales
Los archivos `index-original.html` y `app-domiciliarios-original.html` contienen todo el código inline (monolíticos). Estos están incluidos como referencia y para migración gradual.

### Arquitectura Modular (Nueva)

```
fluxi-project/
│
├── Entrada Principal
│   ├── index.html              # Admin dashboard (carga módulos)
│   └── app-domiciliarios.html  # App móvil (carga módulos)
│
├── Estilos (CSS)
│   ├── common.css              # Compartido entre admin y mobile
│   ├── admin.css               # Específico del panel admin
│   └── mobile.css              # Específico de app móvil
│
├── Lógica (JavaScript)
│   ├── config.js               # Configuración global y utilidades
│   │
│   ├── admin/                  # Módulos del panel administrativo
│   │   ├── dashboard.js        # KPIs y estadísticas
│   │   ├── orders.js           # CRUD de pedidos
│   │   ├── deliveries.js       # Gestión de domiciliarios
│   │   ├── customers.js        # Gestión de clientes
│   │   └── tracking.js         # Mapa de rastreo en vivo
│   │
│   └── mobile/                 # Módulos de app móvil
│       ├── auth.js             # Autenticación de domiciliarios
│       ├── orders.js           # Gestión de pedidos asignados
│       ├── location.js         # GPS tracking
│       └── realtime.js         # Actualizaciones en tiempo real
│
└── Recursos
    ├── assets/images/          # Logos, iconos
    └── docs/                   # Documentación
        ├── API.md
        └── ARCHITECTURE.md (este archivo)
```

## Flujo de Datos

### 1. Panel Administrativo
```
Usuario → index.html → Módulos Admin JS → Supabase → PostgreSQL
                                    ↓
                              Real-time Updates
                                    ↓
                              Actualiza UI
```

### 2. App Móvil
```
Domiciliario → app-domiciliarios.html → Módulos Mobile JS → Supabase
                                                      ↓
                                              GPS Tracking
                                                      ↓
                                             Actualiza Location
```

## Módulos Principales

### config.js (Compartido)
- Inicialización de Supabase client
- Utilidades comunes (formatCurrency, showAlert, etc.)
- Constantes globales

### admin/dashboard.js
- Cálculo de KPIs
- Generación de gráficos (Chart.js)
- Filtros y reportes

### admin/orders.js
- CRUD de pedidos
- Asignación de domiciliarios
- Gestión de estados

### mobile/location.js
- watchPosition API
- Actualización periódica a DB
- Cálculo de distancias

### mobile/orders.js
- Carga de pedidos asignados
- Inicio/fin de entregas
- Temporizador de entrega

## Patrones de Diseño

### 1. Module Pattern
Todos los módulos JS usan el patrón de módulo para encapsular funcionalidad:

```javascript
const ModuleName = (() => {
    // Variables privadas
    let privateVar = null;

    // Métodos privados
    const privateMethod = () => {
        // ...
    };

    // API Pública
    return {
        publicMethod: () => {
            // ...
        }
    };
})();
```

### 2. Event-Driven
La app móvil usa eventos personalizados para comunicación entre módulos:

```javascript
// Emisor
const event = new CustomEvent('timerUpdate', {
    detail: { minutes, seconds }
});
window.dispatchEvent(event);

// Receptor
window.addEventListener('timerUpdate', (e) => {
    console.log(e.detail);
});
```

### 3. Singleton para Supabase Client
Un único cliente de Supabase compartido en `config.js`:

```javascript
const supabase = window.supabase.createClient(URL, KEY);
window.fluxiConfig = { supabase, utils };
```

## Base de Datos (Supabase)

### Tablas Principales

#### usuarios
```sql
- id: uuid (PK)
- nombre: text
- email: text (unique)
- rol: enum('admin', 'supervisor', 'usuario')
- estado: enum('activo', 'inactivo')
- created_at: timestamp
```

#### domiciliarios
```sql
- id: uuid (PK)
- nombre: text
- telefono: text (unique)
- estado: enum('disponible', 'ocupado', 'inactivo')
- ultima_latitud: decimal
- ultima_longitud: decimal
- ultima_actualizacion: timestamp
- tipo: enum('propio', 'rappi')
```

#### pedidos
```sql
- id: uuid (PK)
- cliente: text
- telefono_cliente: text
- direccion: text
- valor_pedido: decimal
- valor_domicilio: decimal
- domiciliario_id: uuid (FK)
- domiciliario_nombre: text (denormalizado)
- numero_datafono: text
- metodo_pago: enum('efectivo', 'tarjeta')
- estado: enum('pendiente', 'asignado', 'en_camino', 'entregado', 'cancelado')
- tiempo_aceptacion: bigint
- tiempo_inicio: bigint
- tiempo_entrega: bigint
- created_at: timestamp
- updated_at: timestamp
```

### Row Level Security (RLS)
```sql
-- Los domiciliarios solo ven sus propios pedidos
CREATE POLICY "Domiciliarios ven sus pedidos" ON pedidos
    FOR SELECT
    USING (domiciliario_id = auth.uid());

-- Los admins ven todo
CREATE POLICY "Admins ven todo" ON pedidos
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');
```

### Real-time Subscriptions
```javascript
// Escuchar cambios en pedidos
supabase
    .channel('pedidos-changes')
    .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedidos'
    }, (payload) => {
        console.log('Cambio en pedido:', payload);
    })
    .subscribe();
```

## Seguridad

### 1. Validación en Cliente
- Formato de teléfonos (Colombia +57)
- Rangos de valores monetarios
- Estados válidos de pedidos

### 2. Validación en Servidor (Supabase)
- Triggers para validar transiciones de estado
- Constraints en base de datos
- RLS para autorización

### 3. HTTPS Obligatorio
- Requerido para Geolocation API
- SSL/TLS en producción

## Performance

### 1. Lazy Loading
- Cargar módulos solo cuando se necesitan
- Cargar mapas bajo demanda

### 2. Caching
- localStorage para sesión de domiciliario
- Caché de ubicaciones (30 segundos)

### 3. Optimización de Queries
- Índices en campos frecuentes (estado, created_at)
- Selección de campos específicos
- Paginación en listados grandes

## Migración Gradual

Para migrar del código monolítico a modular:

1. **Mantener archivos originales** (`-original.html`)
2. **Crear módulos** en `js/admin/` y `js/mobile/`
3. **Extraer CSS** a archivos separados
4. **Actualizar HTML** para cargar módulos
5. **Probar funcionalidad** módulo por módulo
6. **Deprecar originales** una vez probado

## Testing

### Tests Manuales Requeridos
- [ ] Login de domiciliario
- [ ] Activación de GPS
- [ ] Inicio de entrega
- [ ] Actualización de ubicación
- [ ] Completar entrega
- [ ] Crear pedido desde admin
- [ ] Asignar domiciliario
- [ ] Ver mapa en tiempo real
- [ ] Filtros de dashboard
- [ ] Exportar reportes

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos Móviles
- iOS 13+
- Android 8+

## Deployment

### Producción
```bash
# 1. Minificar CSS y JS
# 2. Optimizar imágenes
# 3. Configurar HTTPS
# 4. Configurar variables de entorno
# 5. Desplegar en servidor web (Netlify, Vercel, etc.)
```

### Variables de Entorno
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
GOOGLE_MAPS_KEY=AIzaxxx...
```

## Monitoreo

### Logs Importantes
- Errores de GPS
- Fallos en actualización de ubicación
- Errores de Supabase
- Tiempos de entrega

### Métricas a Rastrear
- Tiempo promedio de entrega
- Precisión de GPS
- Tasa de cancelación
- Pedidos por domiciliario

---

**Actualizado**: Noviembre 2025
