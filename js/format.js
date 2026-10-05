/* ============================================================
   ENUMAPP · Helpers de formato
   ============================================================ */

window.ENUMAPP_FMT = {
    money: (n) => '$ ' + Math.round(n || 0).toLocaleString('es-AR'),
    number: (n) => Math.round(n || 0).toLocaleString('es-AR'),
    percent: (n) => (n || 0).toFixed(1) + '%',
    date: (d) => new Date(d).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric'
    }),
    dateShort: (d) => new Date(d).toLocaleDateString('es-AR', {
        day: '2-digit', month: 'short', year: '2-digit'
    }),
    dateTime: (d) => new Date(d).toLocaleString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }),
    now: () => new Date()
};