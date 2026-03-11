/**
 * shared.js
 * Handles: custom cursor, mobile nav, header scroll, section heading reveals
 * Must be included on EVERY page after animations.js
 */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Custom cursor (identical to home page) ── */
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
  });

  (function loopRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(loopRing);
  })();

  function bindHover() {
    document.querySelectorAll(
      'a, button, .logo, .hamburger, .chip, .skill-card, ' +
      '.cert-card, .project-card, .fl-stat, .testimonial-card, ' +
      '.contact-detail-card, .btn-submit, .lang-card, .timeline-card, .tutor-card'
    ).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }
  bindHover();

  /* ── Mobile nav ── */
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (ham && nav) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  /* ── Header scroll tint ── */
  const hdr = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (!hdr) return;
    if (window.scrollY > 50) {
      hdr.style.background     = 'rgba(8,8,8,0.97)';
      hdr.style.backdropFilter = 'blur(14px)';
    } else {
      hdr.style.background     = 'linear-gradient(to bottom, rgba(8,8,8,0.97) 60%, transparent)';
      hdr.style.backdropFilter = 'none';
    }
  });

  /* ── Section heading reveal observer ── */
  const headingObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        headingObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section-heading').forEach(el => headingObserver.observe(el));

  /* ── General reveal observer (fade in AND out) ── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.classList.remove('hidden');
      } else {
        e.target.classList.remove('visible');
        e.target.classList.add('hidden');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});
