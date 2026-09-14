/* ============================================================
   KHANEIL CAMPBELL — shared behaviour
   ------------------------------------------------------------
   Loaded with `defer` from <head>. Progressive throughout: if
   this file never arrives, .reveal elements stay visible, the
   menu links still navigate, and every filter row stays shown.
   No inline handlers, so the CSP can keep script-src to 'self'.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  /* Arm the scroll-reveal styles. Without this class the CSS
     leaves .reveal fully visible, which is the no-JS state. */
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── MOBILE MENU ─── */
  (function () {
    var burger = document.getElementById('navBurger');
    var menu   = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    function setOpen(open) {
      burger.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'mobileMenu');

    burger.addEventListener('click', function () {
      setOpen(!menu.classList.contains('open'));
    });

    Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setOpen(false);
        burger.focus();
      }
    });

    var wide = window.matchMedia('(min-width: 1081px)');
    var onWide = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) { wide.addEventListener('change', onWide); }
    else if (wide.addListener) { wide.addListener(onWide); }
  })();

  /* ─── SCROLL RULE (right edge) ─── */
  (function () {
    var rail = document.querySelector('.progress-rail span');
    if (!rail) return;

    var queued = false;
    function sync() {
      queued = false;
      var max = root.scrollHeight - root.clientHeight;
      var pct = max > 0 ? window.scrollY / max : 0;
      rail.style.transform = 'scaleY(' + Math.min(Math.max(pct, 0), 1) + ')';
    }
    function request() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(sync);
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    sync();
  })();

  /* ─── ROW / SECTION FILTER ─── */
  (function () {
    var group = document.querySelector('[data-filter-group]');
    if (!group) return;

    var tabs    = group.querySelectorAll('[data-filter]');
    var targets = document.querySelectorAll('[data-cat]');
    if (!tabs.length || !targets.length) return;

    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        var want = tab.getAttribute('data-filter');

        Array.prototype.forEach.call(tabs, function (t) {
          var on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        Array.prototype.forEach.call(targets, function (el) {
          var cats = (el.getAttribute('data-cat') || '').split(/\s+/);
          var show = want === 'all' || cats.indexOf(want) !== -1;
          el.classList.toggle('is-hidden', !show);
        });
      });
    });
  })();

  /* ─── PORTRAIT FALLBACK ─── */
  (function () {
    Array.prototype.forEach.call(document.querySelectorAll('.portrait img'), function (img) {
      img.addEventListener('error', function () {
        var wrap = img.parentNode;
        img.remove();
        if (wrap && !wrap.querySelector('.portrait-fallback')) {
          var mark = document.createElement('span');
          mark.className = 'portrait-fallback';
          mark.setAttribute('aria-hidden', 'true');
          mark.textContent = wrap.getAttribute('data-initials') || 'KC';
          wrap.appendChild(mark);
        }
      });
    });
  })();

  /* ─── REVEAL ON SCROLL ─── */
  (function () {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    function showAll() {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
    }

    if (reduced || !('IntersectionObserver' in window)) { showAll(); return; }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(targets, function (el) { obs.observe(el); });
  })();
})();
