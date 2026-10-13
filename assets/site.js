/* ============================================================
   KHANEIL CAMPBELL — progressive enhancement
   ------------------------------------------------------------
   The only script on the site. Every page is complete without it;
   this file adds the motion layer on top:

     · cinematic loader     first homepage visit of a session
     · animated typography  the hero name, letter by letter
     · particle field       a rotating 3D constellation in the hero
     · scroll reveals       sections rise in as they enter
     · magnetic hover       buttons and nav lean toward the pointer
     · 3D tilt, spotlight   work panels respond to the pointer
     · floating nav         tightens once the page is scrolled

   It is loaded in <head> without defer, so the classes it sets on
   <html> land before first paint and nothing flashes. Everything
   that touches the body waits for DOMContentLoaded.

   No dependencies, no network calls, no inline code: the CSP allows
   script-src 'self' and nothing more.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('js');

  /* ─── Loader: decided now, before the body exists ─── */
  var path = location.pathname;
  var isHome = path === '/' || /\/index\.html$/.test(path) || /\/$/.test(path);
  var seen = false;
  try { seen = sessionStorage.getItem('kc-intro') === '1'; sessionStorage.setItem('kc-intro', '1'); } catch (e) { seen = true; }
  var loading = isHome && !seen && !reduced;
  if (loading) root.classList.add('is-loading');

  function endLoader() {
    if (!root.classList.contains('is-loading')) return;
    root.classList.add('is-leaving');
    setTimeout(function () { root.classList.remove('is-loading', 'is-leaving'); }, 560);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (loading) {
      // Long enough to read as an opening, short enough never to feel like a wait.
      setTimeout(endLoader, 900);
    }
    splitName();
    floatingNav();
    if (!reduced) {
      reveals();
      if (finePointer) { magnetic(); tilt(); }
    }
    spotlight();
    particles();
  });

  /* ─── Animated typography ─── */
  function splitName() {
    var h = document.querySelector('.hero-name');
    if (!h || reduced) return;
    var text = h.textContent.trim();
    h.textContent = '';
    var label = document.createElement('span');
    label.className = 'sr-only';
    label.textContent = text;
    h.appendChild(label);
    var wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    // Letters are grouped into words so a line can only break between words.
    var n = 0;
    text.split(/\s+/).forEach(function (word, wi) {
      if (wi) wrap.appendChild(document.createTextNode(' '));
      var wEl = document.createElement('span');
      wEl.className = 'wd';
      for (var i = 0; i < word.length; i++) {
        var c = document.createElement('span');
        c.className = 'ch'; c.textContent = word[i]; c.style.setProperty('--i', n++);
        wEl.appendChild(c);
      }
      wrap.appendChild(wEl);
    });
    h.appendChild(wrap);
    h.classList.add('is-split');
  }

  /* ─── Floating nav ─── */
  function floatingNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var ticking = false;
    function update() { nav.classList.toggle('is-scrolled', window.scrollY > 40); ticking = false; }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ─── Scroll-triggered reveals ─── */
  function reveals() {
    if (!('IntersectionObserver' in window)) return;
    var groups = [
      '.section-head', '.piece', '.tiles > .tile', '.domain', '.figures > div',
      '.cta', '.split > *', '.panel'
    ];
    var seenEls = new Set();
    var targets = [];
    groups.forEach(function (sel) {
      document.querySelectorAll('main ' + sel).forEach(function (el) {
        if (seenEls.has(el) || el.closest('.hero')) return;
        seenEls.add(el);
        targets.push(el);
      });
    });
    // A nested target would hide again inside a parent that is already revealing.
    targets = targets.filter(function (el) {
      for (var a = el.parentElement; a; a = a.parentElement) if (seenEls.has(a)) return false;
      return true;
    });
    // Siblings that enter together are staggered rather than arriving as a block.
    targets.forEach(function (el) {
      var i = 0, s = el.previousElementSibling;
      while (s && i < 5) { if (seenEls.has(s)) i++; s = s.previousElementSibling; }
      el.style.setProperty('--i', i);
      el.setAttribute('data-reveal', '');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ─── Magnetic hover ─── */
  function magnetic() {
    document.querySelectorAll('.btn, .btn-text, .nav-links a, .nav .nav-name').forEach(function (el) {
      var strength = el.classList.contains('btn') ? 0.28 : 0.2;
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        var x = (ev.clientX - (r.left + r.width / 2)) * strength;
        var y = (ev.clientY - (r.top + r.height / 2)) * strength;
        el.style.setProperty('--tx', x.toFixed(1) + 'px');
        el.style.setProperty('--ty', y.toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      });
    });
  }

  /* ─── 3D tilt on work panels ─── */
  function tilt() {
    document.querySelectorAll('.piece-visual').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (py * -5).toFixed(2) + 'deg');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ─── Spotlight ─── */
  function spotlight() {
    if (!finePointer) return;
    document.querySelectorAll('.piece-visual, .tile, .panel, .cta').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      });
    });
  }

  /* ─── Particle field ───
     Points on a loose sphere, rotated in 3D and projected with
     perspective. Rotation preserves distance, so the edges between
     near neighbours are found once, not every frame. The loop runs
     only while the hero is on screen and the tab is visible, and the
     point count scales with the canvas area. */
  function particles() {
    var field = document.querySelector('.hero-field');
    if (!field) return;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    field.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, pts = [], edges = [], R = 0, cx = 0, cy = 0;
    var rotY = 0, rotX = -0.25, tgtX = 0, tgtY = 0, curX = 0, curY = 0;
    var running = false, visible = true, raf = 0;

    function build() {
      var rect = field.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var wide = w > 900;
      R = wide ? Math.min(w, h) * 0.36 : w * 0.46;
      cx = wide ? w * 0.74 : w * 0.8;
      cy = wide ? h * 0.46 : h * 0.24;
      var n = Math.round(Math.min(180, Math.max(70, (w * h) / 9000)));
      pts = [];
      var golden = Math.PI * (3 - Math.sqrt(5));
      for (var i = 0; i < n; i++) {
        var y = 1 - (i / (n - 1)) * 2;
        var rad = Math.sqrt(1 - y * y);
        var th = golden * i;
        var jitter = 0.86 + Math.random() * 0.22;
        pts.push([Math.cos(th) * rad * jitter, y * jitter, Math.sin(th) * rad * jitter]);
      }
      edges = [];
      var lim = 0.42 * 0.42;
      for (var a = 0; a < n; a++) {
        for (var b = a + 1; b < n; b++) {
          var dx = pts[a][0] - pts[b][0], dy = pts[a][1] - pts[b][1], dz = pts[a][2] - pts[b][2];
          if (dx * dx + dy * dy + dz * dz < lim) edges.push([a, b]);
        }
      }
    }

    var proj = [];
    function frame(t) {
      if (!running) return;
      rotY += 0.0016;
      curX += (tgtX - curX) * 0.04; curY += (tgtY - curY) * 0.04;
      draw();
      raf = requestAnimationFrame(frame);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var ay = rotY + curX * 0.5, ax = rotX + curY * 0.35;
      var sy = Math.sin(ay), cyy = Math.cos(ay), sx = Math.sin(ax), cxx = Math.cos(ax);
      var fov = 2.6;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        var x = p[0] * cyy - p[2] * sy;
        var z = p[0] * sy + p[2] * cyy;
        var y = p[1] * cxx - z * sx;
        z = p[1] * sx + z * cxx;
        var s = fov / (fov + z);
        proj[i] = [cx + x * R * s, cy + y * R * s, z, s];
      }
      ctx.lineWidth = 1;
      for (var e = 0; e < edges.length; e++) {
        var A = proj[edges[e][0]], B = proj[edges[e][1]];
        var depth = 1 - ((A[2] + B[2]) / 2 + 1) / 2;   // 1 near, 0 far
        ctx.strokeStyle = 'rgba(61,155,255,' + (0.03 + depth * 0.16).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      }
      for (var k = 0; k < proj.length; k++) {
        var q = proj[k];
        var d = 1 - (q[2] + 1) / 2;
        ctx.fillStyle = d > 0.62 ? 'rgba(180,215,255,' + (0.35 + d * 0.6).toFixed(3) + ')'
                                 : 'rgba(61,155,255,' + (0.2 + d * 0.6).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(q[0], q[1], (0.7 + d * 1.6) * q[3], 0, 6.283); ctx.fill();
      }
    }

    function start() { if (!running && visible && !reduced) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    build();
    draw();
    requestAnimationFrame(function () { canvas.classList.add('is-on'); });

    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { build(); draw(); }, 150);
    });

    if (reduced) return;   // one still frame, nothing moves

    if (finePointer) {
      window.addEventListener('pointermove', function (ev) {
        tgtX = ev.clientX / window.innerWidth - 0.5;
        tgtY = ev.clientY / window.innerHeight - 0.5;
      }, { passive: true });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        visible ? start() : stop();
      }).observe(field);
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    start();
  }
})();
