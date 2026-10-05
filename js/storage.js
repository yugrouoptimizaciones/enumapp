/* ============================================================
   ENUMAPP · Storage wrapper unificado
   Centraliza todas las claves de localStorage con namespace
   y migra automáticamente desde versiones anteriores.
   ============================================================ */

window.ENUMAPP_STORAGE = {

    PREFIX: 'enumapp_v1_',

    KEYS: {
        REGISTRO: 'enumapp_v1_registro',
        PREMIUM: 'enumapp_v1_premium',
        KPIS: 'enumapp_v1_kpis',
        CASHFLOW: 'enumapp_v1_cashflow',
        EQUILIBRIO: 'enumapp_v1_equilibrio',
        RENTABILIDAD: 'enumapp_v1_rentabilidad',
        PRECIOS: 'enumapp_v1_precios',
        ESTACIONALIDAD: 'enumapp_v1_estacionalidad',
        KANBAN: 'enumapp_v1_kanban',
        SOPS: 'enumapp_v1_sops',
        INVENTARIO: 'enumapp_v1_inventario',
        PROVEEDORES: 'enumapp_v1_proveedores',
        CINCO_PORQUES: 'enumapp_v1_cinco_porques',
        AJUSTE_MERCADO: 'enumapp_v1_ajuste_mercado',
        PROPUESTA_VALOR: 'enumapp_v1_propuesta_valor',
        DELEGACION: 'enumapp_v1_delegacion',
        FISCAL: 'enumapp_v1_fiscal',
        IMPORTACION: 'enumapp_v1_importacion',
        YOUTUBE_METRICS: 'enumapp_v1_youtube_metrics',
        EMAIL_METRICS: 'enumapp_v1_email_metrics',
        USO_HERRAMIENTAS: 'enumapp_v1_uso_herramientas',
	OKR: 'enumapp_v1_okr'
    },

    MIGRACIONES: {
        'suitepyme_registrado': 'enumapp_v1_registro',
        'suitepyme_premium': 'enumapp_v1_premium',
        'kpi_data': 'enumapp_v1_kpis',
        'estacionalidad_data': 'enumapp_v1_estacionalidad',
        'fiscal_data': 'enumapp_v1_fiscal',
        'inventario_data': 'enumapp_v1_inventario',
        'kanban_tareas': 'enumapp_v1_kanban',
        'tool_usage_data': 'enumapp_v1_uso_herramientas',
        'youtube_metrics_data': 'enumapp_v1_youtube_metrics',
        'email_metrics_data': 'enumapp_v1_email_metrics',
	'okr_data': 'enumapp_v1_okr'
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('⚠️ Error al guardar en localStorage:', e);
            return false;
        }
    },

    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('⚠️ Error al leer de localStorage:', e);
            return fallback;
        }
    },

    getRaw(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? raw : fallback;
        } catch (e) {
            return fallback;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    has(key) {
        return localStorage.getItem(key) !== null;
    },

    clearAll() {
        Object.values(this.KEYS).forEach(k => {
            try { localStorage.removeItem(k); } catch (e) {}
        });
    },

    migrarClaves() {
        let migradas = 0;
        Object.entries(this.MIGRACIONES).forEach(([vieja, nueva]) => {
            const datoViejo = localStorage.getItem(vieja);
            const datoNuevo = localStorage.getItem(nueva);
            if (datoViejo && !datoNuevo) {
                try {
                    localStorage.setItem(nueva, datoViejo);
                    migradas++;
                } catch (e) {}
            }
        });
        if (migradas > 0) {
            console.log(`🔄 ENUMAPP_STORAGE: ${migradas} clave(s) migrada(s).`);
        }
        return migradas;
    },

    stats() {
        const stats = {};
        Object.entries(this.KEYS).forEach(([nombre, key]) => {
            const raw = localStorage.getItem(key);
            if (raw !== null) {
                stats[nombre] = { key, size: raw.length };
            }
        });
        return stats;
    }
};

// Migración automática al cargar
ENUMAPP_STORAGE.migrarClaves();

// Helpers de auth (compatibilidad)
window.ENUMAPP_AUTH = {
    isRegistrado() { return ENUMAPP_STORAGE.has(ENUMAPP_STORAGE.KEYS.REGISTRO); },
    isPremium() {
        const raw = ENUMAPP_STORAGE.getRaw(ENUMAPP_STORAGE.KEYS.PREMIUM);
        if (raw === 'true') return true;
        return ENUMAPP_STORAGE.get(ENUMAPP_STORAGE.KEYS.PREMIUM) === true;
    },
    getUsuario() { return ENUMAPP_STORAGE.get(ENUMAPP_STORAGE.KEYS.REGISTRO); },
    registrar(nombre, email, negocio) {
        ENUMAPP_STORAGE.set(ENUMAPP_STORAGE.KEYS.REGISTRO, {
            nombre, email, negocio,
            fechaRegistro: new Date().toISOString()
        });
    },
    cerrarSesion() {
        ENUMAPP_STORAGE.remove(ENUMAPP_STORAGE.KEYS.REGISTRO);
        window.location.href = 'index.html';
    }
};

console.log('💾 ENUMAPP · Storage unificado cargado');