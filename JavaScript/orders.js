/**
 * Módulo de Gestión de Pedidos - App Móvil
 * Maneja pedidos asignados al domiciliario
 */

const OrderManager = (() => {
    let currentOrders = [];
    let activeOrder = null;
    let timerInterval = null;
    let startTime = null;

    /**
     * Cargar pedidos asignados al domiciliario
     */
    const loadOrders = async (deliveryId) => {
        try {
            console.log('📦 Cargando pedidos para domiciliario:', deliveryId);

            const { data, error } = await window.fluxiConfig.supabase
                .from('pedidos')
                .select('*')
                .eq('domiciliario_id', deliveryId)
                .in('estado', ['asignado', 'en_camino'])
                .order('created_at', { ascending: false });

            if (error) throw error;

            currentOrders = data || [];
            console.log(`✅ ${currentOrders.length} pedido(s) cargado(s)`);

            // Si hay un pedido en_camino, es el activo
            activeOrder = currentOrders.find(o => o.estado === 'en_camino');

            // Si hay orden activa y tiene tiempo de aceptación, iniciar timer
            if (activeOrder && activeOrder.tiempo_aceptacion) {
                startTimer(activeOrder.tiempo_aceptacion);
            }

            return currentOrders;
        } catch (error) {
            console.error('❌ Error al cargar pedidos:', error);
            throw error;
        }
    };

    /**
     * Aceptar un pedido
     */
    const acceptOrder = async (orderId, deliveryId) => {
        try {
            console.log('✅ Aceptando pedido:', orderId);

            const acceptTime = Date.now();

            const { data, error } = await window.fluxiConfig.supabase
                .from('pedidos')
                .update({
                    estado: 'asignado',
                    tiempo_aceptacion: acceptTime,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            // Actualizar estado del domiciliario
            await window.fluxiConfig.supabase
                .from('domiciliarios')
                .update({ estado: 'ocupado' })
                .eq('id', deliveryId);

            console.log('✅ Pedido aceptado exitosamente');
            return data;
        } catch (error) {
            console.error('❌ Error al aceptar pedido:', error);
            throw error;
        }
    };

    /**
     * Iniciar entrega
     */
    const startDelivery = async (orderId, deliveryId) => {
        try {
            console.log('🚀 Iniciando entrega:', orderId);

            // Verificar que el GPS esté activo
            if (!window.LocationTracker.isTrackingActive()) {
                throw new Error('Debes activar el GPS antes de iniciar la entrega');
            }

            // Actualizar ubicación antes de iniciar
            await window.LocationTracker.forceUpdate();

            const startTime = Date.now();

            const { data, error } = await window.fluxiConfig.supabase
                .from('pedidos')
                .update({
                    estado: 'en_camino',
                    tiempo_inicio: startTime,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            activeOrder = data;
            startTimer(startTime);

            console.log('✅ Entrega iniciada exitosamente');
            return data;
        } catch (error) {
            console.error('❌ Error al iniciar entrega:', error);
            throw error;
        }
    };

    /**
     * Completar entrega
     */
    const completeDelivery = async (orderId, deliveryId) => {
        try {
            console.log('✅ Completando entrega:', orderId);

            // Actualizar ubicación final
            if (window.LocationTracker.isTrackingActive()) {
                await window.LocationTracker.forceUpdate();
            }

            const deliveryTime = Date.now();

            const { data, error } = await window.fluxiConfig.supabase
                .from('pedidos')
                .update({
                    estado: 'entregado',
                    tiempo_entrega: deliveryTime,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            // Actualizar estado del domiciliario a disponible
            await window.fluxiConfig.supabase
                .from('domiciliarios')
                .update({ estado: 'disponible' })
                .eq('id', deliveryId);

            stopTimer();
            activeOrder = null;

            console.log('✅ Entrega completada exitosamente');
            return data;
        } catch (error) {
            console.error('❌ Error al completar entrega:', error);
            throw error;
        }
    };

    /**
     * Cancelar pedido
     */
    const cancelOrder = async (orderId, deliveryId) => {
        try {
            console.log('❌ Cancelando pedido:', orderId);

            const { data, error } = await window.fluxiConfig.supabase
                .from('pedidos')
                .update({
                    estado: 'cancelado',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            // Actualizar estado del domiciliario a disponible
            await window.fluxiConfig.supabase
                .from('domiciliarios')
                .update({ estado: 'disponible' })
                .eq('id', deliveryId);

            stopTimer();
            
            if (activeOrder && activeOrder.id === orderId) {
                activeOrder = null;
            }

            console.log('✅ Pedido cancelado');
            return data;
        } catch (error) {
            console.error('❌ Error al cancelar pedido:', error);
            throw error;
        }
    };

    /**
     * Iniciar temporizador
     */
    const startTimer = (timestamp) => {
        startTime = timestamp;
        stopTimer(); // Limpiar timer anterior si existe

        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            // Emitir evento con tiempo actualizado
            const event = new CustomEvent('timerUpdate', {
                detail: {
                    minutes,
                    seconds,
                    elapsed,
                    formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`
                }
            });
            window.dispatchEvent(event);
        }, 1000);
    };

    /**
     * Detener temporizador
     */
    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        startTime = null;
    };

    /**
     * Obtener pedido activo
     */
    const getActiveOrder = () => {
        return activeOrder;
    };

    /**
     * Obtener todos los pedidos
     */
    const getAllOrders = () => {
        return currentOrders;
    };

    /**
     * Calcular tiempo transcurrido
     */
    const getElapsedTime = (timestamp) => {
        if (!timestamp) return null;
        
        const elapsed = Date.now() - timestamp;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        return {
            minutes,
            seconds,
            elapsed,
            formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`
        };
    };

    /**
     * Generar enlace de WhatsApp
     */
    const getWhatsAppLink = (order) => {
        if (!order || !order.telefono_cliente) {
            return null;
        }

        const phone = window.fluxiConfig.utils.formatPhoneNumber(order.telefono_cliente);
        const message = encodeURIComponent(
            `Hola! Soy tu domiciliario de Fluxi. Estoy en camino con tu pedido #${order.id.substring(0, 8)}. ¿Alguna indicación especial para la entrega?`
        );

        return `https://wa.me/${phone.replace('+', '')}?text=${message}`;
    };

    // API Pública
    return {
        loadOrders,
        acceptOrder,
        startDelivery,
        completeDelivery,
        cancelOrder,
        getActiveOrder,
        getAllOrders,
        getElapsedTime,
        getWhatsAppLink
    };
})();

// Hacer disponible globalmente
window.OrderManager = OrderManager;
