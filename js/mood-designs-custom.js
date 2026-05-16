/**
 * Mood Designz Custom JavaScript
 * Handles the injection of the pill-shaped header and mobile menu.
 */

(function() {
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
            <a href="works-simple.html">Portfolio</a>
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
        <a href="works-simple.html">Portfolio</a>
        <a href="contact.html">Contact</a>
    </nav>
    `;

    const injectHeader = () => {
        // 1. Inject our custom pill-shaped header
        if (!document.getElementById('mood-header')) {
            document.body.insertAdjacentHTML('beforeend', headerHTML);
        }
        
        // 2. Replace template's original logo and text
        const templateLogo = document.querySelector('.mxd-logo');
        if (templateLogo) {
            const logoImg = templateLogo.querySelector('.mxd-logo__image');
            const logoText = templateLogo.querySelector('.mxd-logo__text');
            
            if (logoImg) {
                // Replace SVG with our image
                logoImg.outerHTML = `<img src="${logoSrc}" alt="Mood Designz" style="height: 40px; width: auto;">`;
            }
            
            if (logoText) {
                logoText.innerHTML = 'MoodDesignz';
                logoText.style.fontSize = '14px';
                logoText.style.fontWeight = '700';
                logoText.style.textTransform = 'none';
            }
        }
        
        // 3. Replace footer SVG with Mood Designz text logo
        const footerSvg = document.querySelector('.mxd-footer__svg-v2');
        if (footerSvg) {
            const footerLogoHTML = `
            <div class="mood-footer-logo">
                M<img src="${logoSrc}" alt="o" class="footer-oo-logo">dDesignz
            </div>
            `;
            footerSvg.outerHTML = footerLogoHTML;
        }
        
        initEvents();
    };

    const initEvents = () => {
        const header = document.getElementById('mood-header');
        const menuToggle = header.querySelector('.menu-toggle');
        const closeMenu = document.querySelector('.close-menu');
        const menuPanel = document.getElementById('mood-menu-panel');
        const overlay = document.getElementById('mood-overlay');
        
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
        
        // Handle scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
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
