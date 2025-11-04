/**
 * Configuración de Supabase para Fluxi
 * Este archivo contiene las credenciales y configuración del backend
 */

const SUPABASE_URL = 'https://kpqcqjhhqwezwvnzwnnb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcWNxamhocXdlend2bnp3bm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3NTExNTcsImV4cCI6MjA0NDMyNzE1N30.d-Fxly6Z8Xz-fAVIPL7CPb4s9hnVR8B70KZYqhHbzik';

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Funciones de utilidad compartidas
const utils = {
    formatCurrency: (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    },

    formatPhoneNumber: (phone) => {
        // Remover cualquier carácter no numérico
        const cleaned = ('' + phone).replace(/\D/g, '');
        
        // Si ya tiene +57, devolverlo tal cual
        if (phone.startsWith('+57')) {
            return phone;
        }
        
        // Si tiene 10 dígitos, agregar +57
        if (cleaned.length === 10) {
            return '+57' + cleaned;
        }
        
        // Si tiene 12 dígitos y empieza con 57, agregar +
        if (cleaned.length === 12 && cleaned.startsWith('57')) {
            return '+' + cleaned;
        }
        
        return phone; // Devolver tal cual si no coincide con ningún formato
    },

    showAlert: (message, type = 'info') => {
        // Crear elemento de alerta
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            z-index: 10000;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;
        alert.textContent = message;

        // Agregar estilos para los diferentes tipos
        const styles = {
            success: 'background: #d4edda; color: #155724; border-left: 4px solid #28a745;',
            danger: 'background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;',
            warning: 'background: #fff3cd; color: #856404; border-left: 4px solid #ffc107;',
            info: 'background: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8;'
        };
        alert.style.cssText += styles[type] || styles.info;

        document.body.appendChild(alert);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    },

    calculateElapsedTime: (timestamp) => {
        if (!timestamp) return '--';
        const elapsed = Date.now() - timestamp;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};

// Agregar animaciones CSS
if (!document.getElementById('utils-styles')) {
    const style = document.createElement('style');
    style.id = 'utils-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Exportar para uso global
window.fluxiConfig = {
    supabase,
    utils,
    SUPABASE_URL,
    SUPABASE_KEY
};
