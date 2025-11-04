/**
 * Módulo de Tracking de Ubicación GPS
 * Gestiona la geolocalización del domiciliario en tiempo real
 */

const LocationTracker = (() => {
    let watchId = null;
    let isActive = false;
    let currentPosition = null;
    let deliveryId = null;
    let updateInterval = null;

    /**
     * Inicializar el tracker con ID del domiciliario
     */
    const init = (id) => {
        deliveryId = id;
        console.log('📍 Tracker GPS inicializado para domiciliario:', id);
    };

    /**
     * Verificar si el navegador soporta geolocalización
     */
    const isSupported = () => {
        return 'geolocation' in navigator;
    };

    /**
     * Solicitar permisos de ubicación
     */
    const requestPermissions = async () => {
        if (!isSupported()) {
            throw new Error('Tu navegador no soporta geolocalización');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('✅ Permisos de ubicación concedidos');
                    currentPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: Date.now()
                    };
                    resolve(currentPosition);
                },
                (error) => {
                    console.error('❌ Error al solicitar permisos:', error);
                    let message = 'Error al obtener ubicación';
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Debes permitir el acceso a tu ubicación';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Ubicación no disponible';
                            break;
                        case error.TIMEOUT:
                            message = 'Tiempo de espera agotado';
                            break;
                    }
                    
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };

    /**
     * Iniciar tracking continuo
     */
    const startTracking = async () => {
        if (!deliveryId) {
            throw new Error('ID de domiciliario no configurado');
        }

        if (isActive) {
            console.log('⚠️ Tracking ya está activo');
            return;
        }

        console.log('🚀 Iniciando tracking GPS...');

        // Solicitar permisos primero
        try {
            await requestPermissions();
        } catch (error) {
            throw error;
        }

        // Iniciar watch position
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                currentPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now()
                };
                
                console.log('📍 Ubicación actualizada:', currentPosition);
            },
            (error) => {
                console.error('❌ Error en tracking:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );

        isActive = true;

        // Actualizar en base de datos cada 30 segundos
        updateInterval = setInterval(async () => {
            if (currentPosition && isActive) {
                await updateLocationInDB();
            }
        }, 30000); // 30 segundos

        console.log('✅ Tracking GPS activo');
    };

    /**
     * Detener tracking
     */
    const stopTracking = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }

        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
        }

        isActive = false;
        console.log('🛑 Tracking GPS detenido');
    };

    /**
     * Actualizar ubicación en base de datos
     */
    const updateLocationInDB = async () => {
        if (!currentPosition || !deliveryId) {
            console.warn('⚠️ No hay ubicación o ID para actualizar');
            return;
        }

        try {
            const { error } = await window.fluxiConfig.supabase
                .from('domiciliarios')
                .update({
                    ultima_latitud: currentPosition.latitude,
                    ultima_longitud: currentPosition.longitude,
                    ultima_actualizacion: new Date().toISOString(),
                    ubicacion_precision: currentPosition.accuracy
                })
                .eq('id', deliveryId);

            if (error) {
                console.error('❌ Error al actualizar ubicación en DB:', error);
                throw error;
            }

            console.log('✅ Ubicación actualizada en DB');
        } catch (error) {
            console.error('Error crítico al actualizar ubicación:', error);
        }
    };

    /**
     * Forzar actualización inmediata de ubicación
     */
    const forceUpdate = async () => {
        if (!isActive) {
            throw new Error('El tracking no está activo');
        }

        // Obtener ubicación actual
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    currentPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: Date.now()
                    };

                    try {
                        await updateLocationInDB();
                        resolve(currentPosition);
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };

    /**
     * Obtener ubicación actual sin actualizar DB
     */
    const getCurrentPosition = () => {
        return currentPosition;
    };

    /**
     * Verificar si el tracking está activo
     */
    const isTrackingActive = () => {
        return isActive;
    };

    /**
     * Calcular distancia entre dos puntos (en metros)
     */
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distancia en metros
    };

    /**
     * Obtener URL de Google Maps para la ubicación actual
     */
    const getGoogleMapsUrl = () => {
        if (!currentPosition) {
            return null;
        }

        return `https://www.google.com/maps?q=${currentPosition.latitude},${currentPosition.longitude}`;
    };

    // API Pública
    return {
        init,
        isSupported,
        requestPermissions,
        startTracking,
        stopTracking,
        forceUpdate,
        getCurrentPosition,
        isTrackingActive,
        calculateDistance,
        getGoogleMapsUrl
    };
})();

// Hacer disponible globalmente
window.LocationTracker = LocationTracker;
