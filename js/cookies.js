/* ============================================================
   ENUMAPP · Gestión de consentimiento de cookies
   Cumple con Ley 25.326 (Argentina) y directrices AAIP.
   ============================================================ */

(function() {
    'use strict';

    const STORAGE_KEY = 'enumapp_cookie_consent';
    const CONSENT_VERSION = '1.0';

    function getConsent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed.version !== CONSENT_VERSION) return null;
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function saveConsent(analytics, marketing) {
        const consent = {
            version: CONSENT_VERSION,
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
        return consent;
    }

    function loadScripts(consent) {
        if (!consent) return;

        // Google Analytics 4
        if (consent.analytics && !window.gtag) {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9E8M3D7SPT';
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { window.dataLayer.push(arguments); };
            window.gtag('js', new Date());
            window.gtag('config', 'G-9E8M3D7SPT', { anonymize_ip: true });
        }
    }

    function showBanner() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;
        banner.classList.add('visible');
    }

    function hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (!banner) return;
        banner.classList.remove('visible');
        setTimeout(() => { banner.style.display = 'none'; }, 400);
    }

    function showConfigModal() {
        const modal = document.getElementById('cookieConfigModal');
        if (!modal) return;
        modal.classList.add('active');

        const consent = getConsent();
        if (consent) {
            document.getElementById('cookieAnalytics').checked = consent.analytics;
            document.getElementById('cookieMarketing').checked = consent.marketing;
        }
    }

    function hideConfigModal() {
        const modal = document.getElementById('cookieConfigModal');
        if (!modal) return;
        modal.classList.remove('active');
    }

    function init() {
        const consent = getConsent();

        if (consent) {
            loadScripts(consent);
        } else {
            showBanner();
        }

        const btnAcceptAll = document.getElementById('cookieAcceptAll');
        if (btnAcceptAll) {
            btnAcceptAll.addEventListener('click', function() {
                const consent = saveConsent(true, true);
                loadScripts(consent);
                hideBanner();
            });
        }

        const btnAcceptEssential = document.getElementById('cookieAcceptEssential');
        if (btnAcceptEssential) {
            btnAcceptEssential.addEventListener('click', function() {
                const consent = saveConsent(false, false);
                loadScripts(consent);
                hideBanner();
            });
        }

        const btnConfig = document.getElementById('cookieConfig');
        if (btnConfig) {
            btnConfig.addEventListener('click', showConfigModal);
        }

        const btnSaveConfig = document.getElementById('cookieSaveConfig');
        if (btnSaveConfig) {
            btnSaveConfig.addEventListener('click', function() {
                const analytics = document.getElementById('cookieAnalytics').checked;
                const marketing = document.getElementById('cookieMarketing').checked;
                const consent = saveConsent(analytics, marketing);
                loadScripts(consent);
                hideConfigModal();
                hideBanner();
                if (window.ENUMAPP_UI && window.ENUMAPP_UI.toast) {
                    window.ENUMAPP_UI.toast('✅ Preferencias de cookies guardadas', 'success');
                }
            });
        }

        const modal = document.getElementById('cookieConfigModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) hideConfigModal();
            });
        }

        const footerLink = document.getElementById('cookieConfigLink');
        if (footerLink) {
            footerLink.addEventListener('click', function(e) {
                e.preventDefault();
                showConfigModal();
            });
        }
    }

    window.ENUMAPP_COOKIES = {
        getConsent: getConsent,
        saveConsent: saveConsent,
        resetConsent: function() {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();