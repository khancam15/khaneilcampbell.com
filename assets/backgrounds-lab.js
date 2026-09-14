/* ============================================================
   Background prototype harness (PROTOTYPE ONLY)
   ------------------------------------------------------------
   Switches one .bg-* class on <html>, and injects the two
   treatments that need measurement:
     · spine ticks     positioned at each section's offset
     · ghost numerals  one outlined index per section
   Neither injection is destructive — turning a treatment off
   leaves the markup inert and hidden by CSS.
   ============================================================ */
(function () {
  'use strict';

  var root    = document.documentElement;
  var MODES   = ['margins', 'spine', 'numerals', 'registration', 'grain'];
  var STORAGE = 'kc-bg-mode';

  /* ─── sections we treat as page divisions ─── */
  function sections() {
    var main = document.querySelector('main');
    if (!main) return [];
    return Array.prototype.filter.call(main.children, function (el) {
      return el.tagName === 'SECTION' || el.tagName === 'HEADER';
    });
  }

  /* ─── spine ticks ─── */
  var marks = document.querySelector('.spine-marks');

  function layoutSpine() {
    if (!marks) return;
    marks.textContent = '';
    var navH = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 72;

    sections().forEach(function (el, i) {
      /* Align the tick with the section's own eyebrow label rather than
         its box top, so the mark reads as part of the heading block.
         Clamped below the fixed nav so the first one stays visible. */
      var anchor = el.querySelector('.eyebrow') || el;
      var box    = anchor.getBoundingClientRect();
      var top    = box.top + window.scrollY + box.height / 2;
      var tick   = document.createElement('div');
      tick.className = 'spine-tick';
      tick.style.top = Math.round(Math.max(top, navH + 38)) + 'px';
      var label = document.createElement('span');
      label.textContent = String(i + 1).padStart(2, '0');
      tick.appendChild(label);
      marks.appendChild(tick);
    });
  }

  /* ─── ghost numerals ─── */
  function buildNumerals() {
    sections().forEach(function (el, i) {
      if (el.querySelector(':scope > .ghost-num')) return;
      var n = document.createElement('div');
      n.className = 'ghost-num';
      n.setAttribute('aria-hidden', 'true');
      n.textContent = String(i + 1).padStart(2, '0');
      el.insertBefore(n, el.firstChild);
    });
  }

  /* ─── mode switching ─── */
  function setMode(mode) {
    MODES.forEach(function (m) { root.classList.remove('bg-' + m); });
    if (mode && mode !== 'none') root.classList.add('bg-' + mode);

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-bg]'),
      function (btn) {
        var on = btn.getAttribute('data-bg') === mode;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    );

    try { localStorage.setItem(STORAGE, mode); } catch (e) { /* private mode */ }
    if (mode === 'spine') layoutSpine();
  }

  buildNumerals();

  var saved = 'none';
  try { saved = localStorage.getItem(STORAGE) || 'none'; } catch (e) { /* ignore */ }
  setMode(saved);

  Array.prototype.forEach.call(
    document.querySelectorAll('[data-bg]'),
    function (btn) {
      btn.addEventListener('click', function () {
        setMode(btn.getAttribute('data-bg'));
      });
    }
  );

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (root.classList.contains('bg-spine')) layoutSpine();
    }, 150);
  });

  window.addEventListener('load', function () {
    if (root.classList.contains('bg-spine')) layoutSpine();
  });
})();
