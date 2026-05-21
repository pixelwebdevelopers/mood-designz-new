/**
 * Mood Designz Custom JavaScript
 * Handles the injection of the pill-shaped header and mobile menu.
 */

(function () {
    const logoSrc = 'mood-designs-img/logo.png';

    const headerHTML = `
    <header id="mood-header">
        <div class="logo">
            <a href="index.html">
                <img src="${logoSrc}" alt="Mood Designz Logo">
            </a>
        </div>
        <nav class="nav-links">
            <a href="index.html">Home</a>
            <a href="about-us.html">About</a>
            <a href="portfolio.html">Portfolio</a>
            <a href="#services">Services</a>
            <a href="contact.html">Contact</a>
        </nav>
        <div class="nav-actions">
            <a href="contact.html" class="cta-btn">Get in Touch</a>
            <button class="menu-toggle" aria-label="Open Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <div id="mood-overlay"></div>
    <nav id="mood-menu-panel">
        <button class="close-menu" aria-label="Close Menu">&times;</button>
        <a href="index.html">Home</a>
        <a href="about-us.html">About</a>
        <a href="portfolio.html">Portfolio</a>
        <a href="contact.html">Contact</a>
    </nav>

    <a href="https://wa.me/923029850812" class="mood-whatsapp-float" target="_blank">
        <div class="mood-whatsapp-content">
            <span class="mood-whatsapp-text">Say Hello!</span>
            <div class="mood-whatsapp-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.3 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.834-.973zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </div>
        </div>
    </a>
    `;

    const injectHeader = () => {
        // 1. Inject our custom pill-shaped header
        if (!document.getElementById('mood-header')) {
            document.body.insertAdjacentHTML('beforeend', headerHTML);
        }

        // 2. Replace template's original logo and text with responsive theme-aware images
        const templateLogo = document.querySelector('.mxd-logo');
        if (templateLogo) {
            templateLogo.innerHTML = `
            <div class="mood-header-logo-container-main">
                <img src="mood-designs-img/Header Black.webp" class="mood-header-logo-img theme-light" alt="Mood Designz">
                <img src="mood-designs-img/Header White.webp" class="mood-header-logo-img theme-dark" alt="Mood Designz">
            </div>
            `;
        }

        // 2.5 Remove template's original "Say Hello" button
        const templateSayHello = document.querySelector('header .btn[aria-label="Say Hello"]');
        if (templateSayHello) {
            templateSayHello.remove();
        }

        // 3. Replace footer SVG with Mood Designz picture logo (both light & dark mode)
        const footerSvg = document.querySelector('.mxd-footer__svg-v2');
        if (footerSvg) {
            const footerLogoHTML = `
            <div class="mood-footer-logo-container">
                <img src="mood-designs-img/Footer Black.webp" class="mood-footer-logo-img theme-light" alt="Mood Designz">
                <img src="mood-designs-img/Footer Whiter.webp" class="mood-footer-logo-img theme-dark" alt="Mood Designz">
            </div>
            `;
            footerSvg.outerHTML = footerLogoHTML;
        }

        // 4. Initialize Hero Stats CountUp if elements exist
        const heroStat1 = document.getElementById('hero-stat-counter-1');
        const heroStat2 = document.getElementById('hero-stat-counter-2');

        if (heroStat1 && heroStat2 && typeof countUp !== 'undefined') {
            const optionsPlus = {
                suffix: '+',
                enableScrollSpy: false // trigger immediately on load
            };
            const statsCounter1 = new countUp.CountUp("hero-stat-counter-1", 10, optionsPlus);
            const statsCounter2 = new countUp.CountUp("hero-stat-counter-2", 1500, optionsPlus);

            // Start after a slight delay to allow page loader to complete (usually 2-3s)
            setTimeout(() => {
                statsCounter1.start();
                statsCounter2.start();
            }, 2500);
        }

        initEvents();
    };

    const initEvents = () => {
        const header = document.getElementById('mood-header');
        const menuToggle = header.querySelector('.menu-toggle');
        const closeMenu = document.querySelector('.close-menu');
        const menuPanel = document.getElementById('mood-menu-panel');
        const overlay = document.getElementById('mood-overlay');
        const whatsappFloat = document.querySelector('.mood-whatsapp-float');

        const openMenu = () => {
            menuPanel.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('menu-open');
        };

        const closeMenuFunc = () => {
            menuPanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        };

        menuToggle.addEventListener('click', openMenu);
        closeMenu.addEventListener('click', closeMenuFunc);
        overlay.addEventListener('click', closeMenuFunc);

        // Handle scroll effect — hide on scroll down, show on scroll up
        let lastScrollY = window.scrollY;
        let ticking = false;
        const scrollThreshold = 5; // px of scroll before triggering hide/show

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY;

            // Apply compact style when scrolled past 50px
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show based on scroll direction (only after scrolling past 80px)
            if (currentScrollY > 80) {
                if (delta > scrollThreshold) {
                    // Scrolling DOWN — hide the header
                    header.classList.add('header-hidden');
                } else if (delta < -scrollThreshold) {
                    // Scrolling UP — show the header
                    header.classList.remove('header-hidden');
                }
            } else {
                // Near top — always show
                header.classList.remove('header-hidden');
            }

            // Show/Hide WhatsApp Float after 100vh
            if (currentScrollY > window.innerHeight) {
                whatsappFloat.classList.add('active');
            } else {
                whatsappFloat.classList.remove('active');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    };

    // Run injection
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
})();
