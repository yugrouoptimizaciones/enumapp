/* ============================================================
   ENUMAPP · Helpers de UI
   Toasts, confirmaciones, modales, tooltips de charts.
   ============================================================ */

window.ENUMAPP_UI = {

    /* ===== TOASTS ===== */
    /**
     * Muestra una notificación tipo toast.
     * @param {string} message - Texto a mostrar
     * @param {string} type - 'info' | 'success' | 'warning' | 'danger'
     * @param {number} duration - Milisegundos antes de ocultarse (default 3000)
     */
    toast(message, type = 'info', duration = 3000) {
     // Eliminar toasts anteriores antes de mostrar uno nuevo
        document.querySelectorAll('.enumapp-toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'enumapp-toast' + (type !== 'info' ? ' ' + type : '');
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /* ===== CONFIRMACIONES ===== */
    /**
     * Confirmación simple (wrapper de confirm nativo).
     */
    confirm(message) {
        return window.confirm(message);
    },

    /* ===== MODALES ===== */
    /**
     * Abre un modal por ID.
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    },

    /**
     * Cierra un modal por ID.
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    /* ===== CHART HELPERS ===== */
    /**
     * Devuelve un color según el valor (positivo/negativo).
     */
    chartColor(value, positive = '#2ecc71', negative = '#e74c3c') {
        return value >= 0 ? positive : negative;
    },

    /**
     * Callback estándar para formatear tooltips de Chart.js con moneda.
     */
    tooltipMoney(context) {
        const value = context.parsed.y ?? context.parsed.r ?? context.parsed;
        return `$ ${Math.round(value).toLocaleString('es-AR')}`;
    },

    /**
     * Callback estándar para formatear tooltips con porcentaje.
     */
    tooltipPercent(context) {
        const value = context.parsed.y ?? context.parsed.r ?? context.parsed;
        return `${Number(value).toFixed(1)}%`;
    },

    /**
     * Callback para formatear eje Y con abreviación de miles/millones.
     */
    axisMoney(value) {
        if (value >= 1e6) return '$' + (value / 1e6).toFixed(1) + 'M';
        if (value >= 1e3) return '$' + (value / 1e3).toFixed(0) + 'k';
        return '$' + value;
    },

    /**
     * Callback para formatear eje Y con porcentaje.
     */
    axisPercent(value) {
        return value + '%';
    },

    /* ===== BACK TOP ===== */
    /**
     * Inicializa el botón "volver arriba" si existe en la página.
     */
    initBackTop() {
        const btn = document.getElementById('backTop');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) btn.classList.add('visible');
            else btn.classList.remove('visible');
        });
    },

    /* ===== MODAL OVERLAY CLOSE ===== */
    /**
     * Permite cerrar modales haciendo clic fuera.
     */
    initModalOverlayClose() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) overlay.classList.remove('active');
            });
        });
    }
};

/* ===== ATAJOS GLOBALES ===== */
document.addEventListener('keydown', function(e) {
    // ESC cierra modales abiertos
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
});

console.log('🎨 ENUMAPP · UI helpers cargados');