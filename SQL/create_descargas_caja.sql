-- Crear tabla para registrar descargas de caja de domiciliarios
CREATE TABLE IF NOT EXISTS descargas_caja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domiciliario_id UUID NOT NULL REFERENCES domiciliarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notas TEXT
);

-- Índices para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_descargas_caja_domiciliario ON descargas_caja(domiciliario_id);
CREATE INDEX IF NOT EXISTS idx_descargas_caja_fecha ON descargas_caja(fecha);
CREATE INDEX IF NOT EXISTS idx_descargas_caja_domiciliario_fecha ON descargas_caja(domiciliario_id, fecha);

-- Comentarios para documentación
COMMENT ON TABLE descargas_caja IS 'Registra las descargas de efectivo realizadas por los domiciliarios durante el día';
COMMENT ON COLUMN descargas_caja.domiciliario_id IS 'ID del domiciliario que realiza la descarga';
COMMENT ON COLUMN descargas_caja.fecha IS 'Fecha en que se realiza la descarga';
COMMENT ON COLUMN descargas_caja.monto IS 'Monto de efectivo descargado';
COMMENT ON COLUMN descargas_caja.notas IS 'Notas o comentarios adicionales sobre la descarga';
