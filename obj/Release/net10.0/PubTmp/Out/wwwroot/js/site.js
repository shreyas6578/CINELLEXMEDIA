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


/* ============================================================
   GALLERY — Auto Slideshow + Filter Buttons
   ============================================================ */
(function () {

    var track = document.getElementById('galleryTrack');
    var dotsWrap = document.getElementById('galleryDots');
    var prevBtn = document.getElementById('galPrev');
    var nextBtn = document.getElementById('galNext');
    var autoBtn = document.getElementById('galAutoplay');
    var autoIcon = document.getElementById('galAutoIcon');
    var autoText = document.getElementById('galAutoText');
    var filterBtns = document.querySelectorAll('.gal-btn');

    if (!track) return; // not on gallery page

    var allSlides = Array.from(track.querySelectorAll('.gallery-slide'));
    var current = 0;
    var autoInterval = null;
    var isPlaying = true;
    var DELAY = 3500; // ms between slides
    var activeFilter = 'all';

    /* ── Build visible slides list based on active filter ── */
    function getVisible() {
        return allSlides.filter(function (s) {
            return activeFilter === 'all' || s.dataset.category === activeFilter;
        });
    }

    /* ── Render dot indicators ── */
    function buildDots(visible) {
        dotsWrap.innerHTML = '';
        visible.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.className = 'gallery-dot' + (i === current ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            dot.addEventListener('click', function () { goTo(i); });
            dotsWrap.appendChild(dot);
        });
    }

    /* ── Update active dot ── */
    function updateDots() {
        var dots = dotsWrap.querySelectorAll('.gallery-dot');
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === current);
        });
    }

    /* ── Show/hide slides and move track ── */
    function applyFilter() {
        var visible = getVisible();
        // Hide non-matching, show matching
        allSlides.forEach(function (s) {
            s.classList.add('hidden');
        });
        visible.forEach(function (s) {
            s.classList.remove('hidden');
        });
        // Reset current index
        current = 0;
        buildDots(visible);
        moveTrack(visible);
    }

    function moveTrack(visible) {
        if (!visible) visible = getVisible();
        // Re-order DOM: put visible slides first in track so translateX works
        visible.forEach(function (s) { track.appendChild(s); });
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        // Restore transition after a frame
        requestAnimationFrame(function () {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        updateDots();
    }

    function goTo(index) {
        var visible = getVisible();
        if (visible.length === 0) return;
        current = (index + visible.length) % visible.length;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        updateDots();
    }

    /* ── Autoplay ── */
    function startAuto() {
        stopAuto();
        autoInterval = setInterval(function () {
            goTo(current + 1);
        }, DELAY);
        isPlaying = true;
        autoIcon.className = 'fas fa-pause';
        autoText.textContent = 'Pause Autoplay';
    }

    function stopAuto() {
        clearInterval(autoInterval);
        isPlaying = false;
        autoIcon.className = 'fas fa-play';
        autoText.textContent = 'Resume Autoplay';
    }

    /* ── Arrow buttons ── */
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    /* ── Autoplay toggle ── */
    if (autoBtn) {
        autoBtn.addEventListener('click', function () {
            if (isPlaying) { stopAuto(); } else { startAuto(); }
        });
    }

    /* ── Filter buttons ── */
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilter();
            // Restart autoplay on filter change
            if (isPlaying) startAuto();
        });
    });

    /* ── Touch / swipe support ── */
    var touchStartX = 0;
    var slideshow = document.getElementById('gallerySlideshow');
    if (slideshow) {
        slideshow.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        slideshow.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                goTo(diff > 0 ? current + 1 : current - 1);
            }
        }, { passive: true });
    }

    /* ── Init ── */
    applyFilter();
    startAuto();

})();

    document.addEventListener("DOMContentLoaded", function () {

        const modal = document.getElementById("galleryModal");
    const modalImg = document.getElementById("galleryModalImg");
    const closeBtn = document.querySelector(".gallery-close");

        document.querySelectorAll(".gallery-image").forEach(img => {

        img.style.cursor = "pointer";

    img.addEventListener("click", function () {
        modal.classList.add("show");
    modalImg.src = this.src;
    modalImg.alt = this.alt;
            });
        });

        closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        });

    modal.addEventListener("click", function (e) {
            if (e.target === modal) {
        modal.classList.remove("show");
            }
        });

    document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
        modal.classList.remove("show");
            }
        });

    });

function selectPackage(packageName) {
    setTimeout(function () {
        const radios = document.querySelectorAll('input[name="package"]');
        radios.forEach(function (radio) {
            if (radio.value === packageName) {
                radio.checked = true;
                // trigger visual highlight on the label
                radio.dispatchEvent(new Event('change'));
            }
        });
    }, 400); // slight delay to let scroll finish
}