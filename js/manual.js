/* ============================================================
   ENUMAPP · JavaScript compartido para manuales
   Scroll suave del TOC, botón top, atajos de teclado.
   ============================================================ */

(function() {
    'use strict';

    // ===== SCROLL SUAVE PARA LOS ENLACES DEL ÍNDICE =====
    document.querySelectorAll('.toc a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== MOSTRAR/OCULTAR BOTÓN VOLVER ARRIBA =====
    const backTop = document.getElementById('backTop');
    if (backTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backTop.classList.add('visible');
            } else {
                backTop.classList.remove('visible');
            }
        });
    }

    // ===== ATAJOS DE TECLADO =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Home' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    console.log('📖 ENUMAPP · Manual cargado');
})();