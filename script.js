/* ============================================================
   SR BAJRANG LOGISTICS — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================
     1. NAVBAR — scroll effect + active link highlight
     =================================================== */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    // Add scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on scroll position
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
      const top    = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;

      if (window.scrollY >= top && window.scrollY < bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { passive: true });


  /* ===================================================
     2. HAMBURGER / MOBILE NAV
     =================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });


  /* ===================================================
     3. SMOOTH SCROLL for all anchor links
     =================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 4;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ===================================================
     4. HERO SLIDESHOW
     =================================================== */
  const heroSlideData = [
    {
      accent: 'Forward Together',
      desc:   'SR Bajrang Logistics delivers your goods safely, on time, and with the highest level of professionalism. Decades of trust, nationwide reach, zero compromise.'
    },
    {
      accent: 'Every Destination',
      desc:   'Our vision is to be India\'s leading logistics partner — connecting businesses, markets, and communities with speed, safety, and reliability across the country.'
    },
    {
      accent: 'Smarter & Faster',
      desc:   'Redefining logistics standards through innovation, a skilled workforce, and a commitment to timely delivery — from small consignments to large industrial shipments.'
    }
  ];

  const heroSlides    = document.querySelectorAll('.hero-slide');
  const heroDots      = document.querySelectorAll('.hero-dot');
  const heroAccentEl  = document.getElementById('heroAccent');
  const heroDescEl    = document.getElementById('heroDesc');
  let   currentSlide  = 0;
  let   slideInterval;

  function goSlide(index) {
    // Remove active from current
    heroSlides[currentSlide].classList.remove('active');
    heroDots[currentSlide].classList.remove('active');

    currentSlide = index;

    // Activate new
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');

    // Update text with fade
    heroAccentEl.style.opacity = '0';
    heroDescEl.style.opacity   = '0';
    setTimeout(() => {
      heroAccentEl.textContent   = heroSlideData[currentSlide].accent;
      heroDescEl.textContent     = heroSlideData[currentSlide].desc;
      heroAccentEl.style.opacity = '1';
      heroDescEl.style.opacity   = '1';
    }, 350);
  }

  // Add CSS transition to hero text elements
  if (heroAccentEl) heroAccentEl.style.transition = 'opacity 0.4s ease';
  if (heroDescEl)   heroDescEl.style.transition   = 'opacity 0.4s ease';

  function startSlideAuto() {
    slideInterval = setInterval(() => {
      goSlide((currentSlide + 1) % heroSlides.length);
    }, 5000);
  }
  function resetSlideAuto() {
    clearInterval(slideInterval);
    startSlideAuto();
  }

  startSlideAuto();

  // Expose goSlide globally (called from HTML onclick)
  window.goSlide = (n) => {
    goSlide(n);
    resetSlideAuto();
  };

  // Pause auto-play on hover over hero
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', startSlideAuto);
  }


  /* ===================================================
     5. SCROLL REVEAL (Intersection Observer)
     =================================================== */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ===================================================
     6. VIDEO CARDS — play on hover, pause on leave
     =================================================== */
  document.querySelectorAll('.vs-card video').forEach(video => {
    const card = video.closest('.vs-card');
    card.addEventListener('mouseenter', () => {
      if (!video.autoplay) video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      if (!video.autoplay) video.pause();
    });
  });


  /* ===================================================
     7. COUNTER ANIMATION for hero stats
     =================================================== */
  function animateCounters() {
    document.querySelectorAll('.h-stat-num').forEach(el => {
      const raw = el.textContent.trim();
      // Only animate numeric values
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;

      const suffix   = raw.replace(/[0-9.]/g, '');
      const duration = 1800;
      const steps    = 60;
      const increment = num / steps;
      let current    = 0;
      let step       = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          el.textContent = raw; // restore original
          clearInterval(timer);
        } else {
          el.textContent = (Number.isInteger(num)
            ? Math.floor(current)
            : current.toFixed(1)) + suffix;
        }
      }, duration / steps);
    });
  }

  // Trigger counter once the stats bar is visible
  const statsBar = document.querySelector('.hero-stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsBar);
  }


  /* ===================================================
     8. SCROLL TO TOP on page load / refresh
     =================================================== */
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }


  /* ===================================================
     9. GALLERY — pause animation on hover (handled via CSS)
        Extra: clone row if needed for seamless loop
     =================================================== */
  // Gallery auto-scroll is pure CSS. No JS needed.


  /* ===================================================
     10. FORM — simple UX enhancement
     =================================================== */
  const form = document.querySelector('.contact-form-box form');
  if (form) {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('.form-submit');
      if (btn) {
        btn.textContent = 'Sending…';
        btn.style.opacity = '0.75';
        btn.style.pointerEvents = 'none';
      }
    });
  }

}); // end DOMContentLoaded