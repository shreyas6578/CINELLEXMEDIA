/* ============================================================
   site.js — Cinellex Media
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ── 1. AUTO-SCROLL TO HASH ON PAGE LOAD ─────────────────
       Handles arriving from another page with #hash in URL.
    ─────────────────────────────────────────────────────────── */
    if (window.location.hash) {
        var target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(function () {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
    }

    /* ── 2. NAVBAR SCROLL EFFECTS ────────────────────────────
       - Adds shadow on scroll
       - Highlights active nav link
    ─────────────────────────────────────────────────────────── */
    var navbar = document.getElementById('mainNav');
    var navLinks = document.querySelectorAll('.navbar .nav-link');
    var sections = document.querySelectorAll('section[id]');

    function onScroll() {
        var scrollY = window.scrollY || window.pageYOffset;

        // Shadow effect
        if (navbar) {
            if (scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active nav highlight
        var currentId = '';
        sections.forEach(function (sec) {
            if (scrollY >= sec.offsetTop - 90) {
                currentId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active-link');
            var href = link.getAttribute('href') || '';
            if (href === '#' + currentId) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // run once on load


    /* ── 3. SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────
       Ensures all href="#section" links scroll smoothly,
       accounting for the sticky navbar offset.
    ─────────────────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });

            // Close mobile navbar if open
            var navCollapse = document.querySelector('.navbar-collapse');
            if (navCollapse && navCollapse.classList.contains('show')) {
                var toggler = document.querySelector('.navbar-toggler');
                if (toggler) toggler.click();
            }
        });
    });


    /* ── 4. SCROLL-IN ANIMATION ─────────────────────────────
       Fades in sections and cards as they enter the viewport.
    ─────────────────────────────────────────────────────────── */
    var animateTargets = document.querySelectorAll(
        '.service-card, .client-card, .why-card, .pricing-card, .process-step'
    );

    // Set initial hidden state
    animateTargets.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
                setTimeout(function () {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateTargets.forEach(function (el) {
        observer.observe(el);
    });

});
