# Instrucciones para Habilitar Descargas de Caja

## ¿Qué es la Descarga de Caja?

La funcionalidad de **Descarga de Caja** permite registrar cuando un domiciliario entrega efectivo durante el día. Esto es útil para:

- Llevar un control del efectivo que el domiciliario tiene en su poder
- Registrar entregas parciales de efectivo durante el turno
- Calcular correctamente el efectivo disponible: `Total Efectivo = Valor Arranque + Efectivo Pedidos - Descargas`

## Pasos para Habilitar la Funcionalidad

### 1. Crear la Tabla en Supabase

1. Accede a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega el contenido del archivo `create_descargas_caja.sql`
5. Ejecuta la query (botón **RUN** o Ctrl+Enter)

### 2. Verificar la Tabla

Para verificar que la tabla se creó correctamente:

```sql
SELECT * FROM descargas_caja LIMIT 5;
```

Deberías ver una tabla vacía con las columnas:
- `id` (UUID)
- `domiciliario_id` (UUID)
- `fecha` (DATE)
- `monto` (DECIMAL)
- `created_at` (TIMESTAMPTZ)
- `notas` (TEXT)

### 3. Configurar Permisos (Row Level Security)

Si tienes Row Level Security (RLS) habilitado, necesitas crear políticas para la tabla:

```sql
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Permitir lectura de descargas"
ON descargas_caja FOR SELECT
TO authenticated
USING (true);

-- Permitir inserción a usuarios autenticados
CREATE POLICY "Permitir registro de descargas"
ON descargas_caja FOR INSERT
TO authenticated
WITH CHECK (true);
```

## Cómo Usar la Funcionalidad

### Registrar una Descarga

1. Ve al módulo **Cuadre de Caja**
2. Selecciona una fecha y calcula el cuadre
3. Haz clic en el botón **💸 Registrar Descarga de Caja**
4. Completa el formulario:
   - **Domiciliario:** Selecciona el domiciliario que realiza la descarga
   - **Monto:** Ingresa el monto en pesos que se descargará
   - **Notas:** (Opcional) Agrega comentarios adicionales
5. Haz clic en **💾 Registrar Descarga**

### Ver las Descargas

En la tabla del Cuadre de Caja, verás una columna **Descargas** que muestra:
- El consecutivo de descargas (Descarga 1, Descarga 2, etc.)
- La hora de cada descarga
- El monto de cada descarga

Ejemplo:
```
Descarga 1 (10:30): $50,000
Descarga 2 (14:15): $30,000
```

### Cálculo del Total Efectivo

El **Total Efectivo** se calcula automáticamente como:
```
Total Efectivo = Valor Arranque + Efectivo Pedidos - Total Descargas
```

**Ejemplo:**
- Valor Arranque: $100,000
- Efectivo Pedidos: $250,000
- Descargas: $50,000 + $30,000 = $80,000
- **Total Efectivo: $100,000 + $250,000 - $80,000 = $270,000**

## Estructura de la Tabla

```sql
CREATE TABLE descargas_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domiciliario_id UUID NOT NULL REFERENCES domiciliarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notas TEXT
);
```

### Índices para Rendimiento

La tabla incluye índices para mejorar el rendimiento:
- `idx_descargas_caja_domiciliario`: Para consultas por domiciliario
- `idx_descargas_caja_fecha`: Para consultas por fecha
- `idx_descargas_caja_domiciliario_fecha`: Para consultas combinadas

## Consultas Útiles

### Ver todas las descargas de un día
```sql
SELECT
    d.nombre as domiciliario,
    dc.monto,
    dc.created_at,
    dc.notas
FROM descargas_caja dc
JOIN domiciliarios d ON dc.domiciliario_id = d.id
WHERE dc.fecha = '2025-11-12'
ORDER BY dc.created_at;
```

### Total descargado por domiciliario en un día
```sql
SELECT
    d.nombre as domiciliario,
    SUM(dc.monto) as total_descargado
FROM descargas_caja dc
JOIN domiciliarios d ON dc.domiciliario_id = d.id
WHERE dc.fecha = '2025-11-12'
GROUP BY d.nombre;
```

### Historial de descargas de un domiciliario
```sql
SELECT
    dc.fecha,
    dc.monto,
    dc.created_at,
    dc.notas
FROM descargas_caja dc
WHERE dc.domiciliario_id = 'uuid-del-domiciliario'
ORDER BY dc.fecha DESC, dc.created_at DESC;
```

## Solución de Problemas

### Error: "relation descargas_caja does not exist"
**Solución:** Ejecuta el script `create_descargas_caja.sql` en el SQL Editor de Supabase.

### Error: "permission denied for table descargas_caja"
**Solución:** Configura las políticas de RLS como se indica en la sección "Configurar Permisos".

### No aparece el botón de Descarga de Caja
**Solución:** Primero debes calcular el cuadre de caja. El botón solo aparece cuando hay un cuadre activo.

### Las descargas no se restan del total efectivo
**Solución:** Limpia el cuadre y vuelve a calcularlo. Si el problema persiste, verifica que las descargas tengan la misma fecha que el cuadre.

## Notas Importantes

1. **Las descargas solo se pueden registrar para fechas que tengan un cuadre calculado**
2. **Solo aparecen los domiciliarios que estén configurados para el día seleccionado**
3. **El monto debe ser un número positivo mayor a cero**
4. **Las descargas se registran con la hora de Colombia (America/Bogota)**
5. **Una vez registrada, una descarga no se puede editar desde la interfaz** (se debe modificar directamente en Supabase si es necesario)

## Mantenimiento

Es recomendable revisar periódicamente las descargas registradas para detectar posibles errores:

```sql
-- Descargas mayores a $500,000 (revisar si son correctas)
SELECT * FROM descargas_caja
WHERE monto > 500000
ORDER BY created_at DESC;

-- Descargas sin notas (considerar agregar contexto)
SELECT * FROM descargas_caja
WHERE notas IS NULL
ORDER BY created_at DESC
LIMIT 20;
```
