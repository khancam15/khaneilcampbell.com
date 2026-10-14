/* ============================================================
   KHANEIL CAMPBELL — progressive enhancement
   ------------------------------------------------------------
   The only script on the site. Every page is complete without it;
   this file adds the motion and interaction layer on top:

     · pavilion scene       the homepage hero, drawn as layered SVG
     · scroll reveals       sections settle in as they enter
     · 3D tilt, spotlight   work panels and cards respond to the pointer
     · floating nav         firms up once the page is scrolled
     · process steps        the homepage "How I build" list as tabs
     · career timeline      the rail fills and nodes light as you scroll
     · skill map            tabs whose dots form a where-used matrix

   Loaded in <head> without defer so the "js" class lands before first
   paint; everything that touches the body waits for DOMContentLoaded.
   No dependencies, no network calls, no inline code: the CSP allows
   script-src 'self' and nothing more.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    floatingNav();
    scene();
    cardArt();
    steps();
    if (!reduced) {
      reveals();
      if (finePointer) tilt();
    }
    spotlight();
    timeline();
    skillMap();
  });

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
      '.cta', '.split > *', '.panel', '.skillmap', '.cards > .card', '.areas', '.xp', '.process'
    ];
    var seenEls = new Set();
    var targets = [];
    groups.forEach(function (sel) {
      document.querySelectorAll('main ' + sel).forEach(function (el) {
        if (seenEls.has(el) || el.closest('.hero, .stage, .proof')) return;
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

  /* ─── 3D tilt on work panels ─── */
  function tilt() {
    document.querySelectorAll('.piece-visual, .card').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', (px * 4).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (py * -3).toFixed(2) + 'deg');
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
    document.querySelectorAll('.piece-visual, .tile, .panel, .cta, .card').forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
        el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
      });
    });
  }

  /* ─── Career timeline ───
     --p is the share of the timeline the reader has passed, measured at
     60% down the viewport. A node lights once the fill reaches it. */
  function timeline() {
    var tl = document.querySelector('.timeline');
    if (!tl) return;
    var items = Array.prototype.slice.call(tl.querySelectorAll('.tl-item'));
    if (reduced) { items.forEach(function (it) { it.classList.add('is-lit'); }); return; }
    var ticking = false;
    function update() {
      ticking = false;
      var r = tl.getBoundingClientRect();
      var line = window.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, (line - r.top) / r.height));
      tl.style.setProperty('--p', p.toFixed(4));
      items.forEach(function (it) {
        it.classList.toggle('is-lit', it.getBoundingClientRect().top + 10 <= line);
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ─── Skill map ───
     Rebuilds the six cards as a tab list. Each tab carries one dot per
     place a skill area was used, read from the links already in its card,
     so the tabs together form a matrix. Arrow keys move between tabs. */
  function skillMap() {
    var map = document.querySelector('.skillmap');
    if (!map) return;
    // On a phone the panel would open below six tabs, out of sight, so the
    // plain cards stay: every area is readable without a tap.
    if (!window.matchMedia('(min-width: 720px)').matches) return;
    var panels = Array.prototype.slice.call(map.querySelectorAll('.sk'));
    if (!panels.length) return;

    var COLS = [
      ['Columbia', /columbia university/i],
      ['NYC H+H', /nyc health/i],
      ['Montefiore', /montefiore/i],
      ['SOC lab', /soc lab/i],
      ['Pipeline', /pipeline/i],
      ['This site', /this site/i],
      ['ITIL 4', /itil 4/i],
      ['Security+', /security\+/i]
    ];

    var tabs = document.createElement('div');
    tabs.className = 'sk-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Skill areas');
    tabs.setAttribute('aria-orientation', 'vertical');

    var head = document.createElement('div');
    head.className = 'sk-head';
    head.setAttribute('aria-hidden', 'true');
    head.appendChild(document.createElement('span'));
    var headCols = document.createElement('span');
    headCols.className = 'sk-cols';
    var colEls = COLS.map(function (c) {
      var el = document.createElement('span');
      el.className = 'sk-col'; el.textContent = c[0];
      headCols.appendChild(el);
      return el;
    });
    head.appendChild(headCols);

    var buttons = panels.map(function (panel, i) {
      var name = panel.querySelector('.sk-name');
      var label = name.cloneNode(true);
      var used = panel.querySelector('.sk-used').textContent;
      var hits = COLS.map(function (c) { return c[1].test(used); });

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sk-tab';
      b.id = panel.id + '-tab';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', panel.id);
      var l = document.createElement('span');
      l.className = 'sk-tab-label';
      while (label.firstChild) l.appendChild(label.firstChild);
      b.appendChild(l);
      var dots = document.createElement('span');
      dots.className = 'sk-cols';
      dots.setAttribute('aria-hidden', 'true');
      hits.forEach(function (h, k) {
        var d = document.createElement('span');
        d.className = 'sk-dot' + (h ? ' is-used' : '');
        if (h) d.title = COLS[k][0];
        dots.appendChild(d);
      });
      b.appendChild(dots);
      b._hits = hits;

      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', b.id);
      panel.setAttribute('tabindex', '0');

      b.addEventListener('click', function () { select(i, false); });
      b.addEventListener('keydown', function (ev) {
        var k = ev.key, n = buttons.length, to = -1;
        if (k === 'ArrowDown' || k === 'ArrowRight') to = (i + 1) % n;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') to = (i - 1 + n) % n;
        else if (k === 'Home') to = 0;
        else if (k === 'End') to = n - 1;
        if (to >= 0) { ev.preventDefault(); select(to, true); }
      });
      tabs.appendChild(b);
      return b;
    });

    var left = document.createElement('div');
    left.appendChild(head);
    left.appendChild(tabs);
    var right = document.createElement('div');
    panels.forEach(function (p) { right.appendChild(p); });
    map.appendChild(left);
    map.appendChild(right);
    map.classList.add('is-live');

    var current = -1;
    function select(i, focus) {
      if (i === current) { if (focus) buttons[i].focus(); return; }
      current = i;
      buttons.forEach(function (b, k) {
        var on = k === i;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
        panels[k].classList.toggle('is-entering', on && !reduced);
      });
      colEls.forEach(function (c, k) { c.classList.toggle('is-on', buttons[i]._hits[k]); });
      if (focus) buttons[i].focus();
    }
    select(0, false);
  }

  /* ─── Homepage: the pavilion scene ───
     Sky, mist, horizon, still water, a four-level pavilion with lit glass
     between its slabs, its reflection and frosted labels. Drawn from
     geometry so it stays sharp at any size. Each layer drifts by its own
     amount against the pointer; the building itself never rotates. */
  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function scene() {
    var host = document.querySelector('.scene');
    if (!host) return;
    var LEVELS = [
      { name: 'Enterprise IT', sub: 'Columbia, 4+ years', w: 540 },
      { name: 'Security', sub: 'Security+, SOC lab', w: 430 },
      { name: 'Automation', sub: 'Python, APIs, CI', w: 320 },
      { name: 'AI', sub: 'Claude, MCP, agents', w: 210, hot: true }
    ];
    var layers = [];

    function draw() {
      host.textContent = '';
      var narrow = host.clientWidth < 760;
      var W = 1600, H = 900, HZ = 586, CX = 1120, BASE = 650;
      var svg = svgEl('svg', {
        viewBox: narrow ? '762 140 838 754' : '0 0 ' + W + ' ' + H,
        preserveAspectRatio: narrow ? 'xMidYMid slice' : 'xMaxYMax slice',
        'aria-hidden': 'true', focusable: 'false'
      }, host);
      var defs = svgEl('defs', {}, svg);
      function lg(id, stops, x2, y2) {
        var g = svgEl('linearGradient', { id: id, x1: 0, y1: 0, x2: x2 || 0, y2: y2 === undefined ? 1 : y2 }, defs);
        stops.forEach(function (s) { svgEl('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] === undefined ? 1 : s[2] }, g); });
      }
      lg('kc-sky', [[0, '#cfd8e0'], [.55, '#e3e8ec'], [1, '#f1f3f4']]);
      lg('kc-water', [[0, '#dfe5e9'], [.4, '#c9d3da'], [1, '#b4c1ca']]);
      lg('kc-glass', [[0, '#cfe0ee', .9], [1, '#9fc0db', .75]]);
      lg('kc-glass-hot', [[0, '#d9ebfb', .95], [1, '#6fa8d6', .85]]);
      lg('kc-face', [[0, '#ffffff'], [1, '#e9ecee']]);
      lg('kc-mist', [[0, '#ffffff', 0], [.5, '#ffffff', .75], [1, '#ffffff', 0]]);
      lg('kc-fade', [[0, '#eef1f3', .92], [1, '#eef1f3', 0]], 1, 0);
      lg('kc-refl', [[0, '#fff', .55], [1, '#fff', 0]]);
      var soft = svgEl('filter', { id: 'kc-soft', x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
      svgEl('feGaussianBlur', { stdDeviation: 2.4 }, soft);
      var glow = svgEl('filter', { id: 'kc-glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
      svgEl('feGaussianBlur', { stdDeviation: 18 }, glow);
      var mask = svgEl('mask', { id: 'kc-refl-mask' }, defs);
      svgEl('rect', { x: 0, y: HZ, width: W, height: H - HZ, fill: 'url(#kc-refl)' }, mask);

      // sky, sun glow, distant shore
      svgEl('rect', { width: W, height: HZ + 2, fill: 'url(#kc-sky)' }, svg);
      var far = svgEl('g', { 'class': 'layer' }, svg);
      svgEl('circle', { cx: 1260, cy: 170, r: 220, fill: '#ffffff', opacity: .55, filter: 'url(#kc-glow)' }, far);
      svgEl('path', { d: 'M0 ' + HZ + ' L0 ' + (HZ - 18) + ' C 180 ' + (HZ - 30) + ', 320 ' + (HZ - 12) + ', 520 ' + (HZ - 22) + ' S 820 ' + (HZ - 8) + ', 980 ' + (HZ - 14) + ' L 980 ' + HZ + ' Z', fill: '#c3ccd3', opacity: .55 }, far);
      svgEl('path', { d: 'M1380 ' + HZ + ' C 1460 ' + (HZ - 16) + ', 1540 ' + (HZ - 10) + ', 1600 ' + (HZ - 20) + ' L1600 ' + HZ + ' Z', fill: '#c3ccd3', opacity: .45 }, far);

      // still water with faint ripple lines (seeded, so it never changes)
      svgEl('rect', { y: HZ, width: W, height: H - HZ, fill: 'url(#kc-water)' }, svg);
      var rip = svgEl('g', { opacity: .5 }, svg);
      var seed = 7;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      for (var r = 0; r < 46; r++) {
        var ry = HZ + 8 + Math.pow(rnd(), 1.6) * (H - HZ - 8);
        var rx = rnd() * W, len = 30 + rnd() * 160 * (ry - HZ) / (H - HZ) + 20;
        svgEl('line', { x1: rx, y1: ry, x2: rx + len, y2: ry, stroke: '#ffffff', 'stroke-width': .6 + (ry - HZ) / 260, opacity: .35 + rnd() * .4 }, rip);
      }

      // the pavilion, defined once so the reflection can reuse it
      var bld = svgEl('g', { id: 'kc-bld' }, defs);
      var SK = 46, D = 30, T = 16;
      var pw = 720, px0 = CX - pw / 2, px1 = CX + pw / 2;
      svgEl('polygon', { points: px0 + ',' + BASE + ' ' + px1 + ',' + BASE + ' ' + (px1 + SK) + ',' + (BASE - D) + ' ' + (px0 + SK) + ',' + (BASE - D), fill: '#f6f7f8' }, bld);
      svgEl('rect', { x: px0, y: BASE, width: pw, height: 9, fill: '#d9dde0' }, bld);
      svgEl('polygon', { points: px1 + ',' + BASE + ' ' + (px1 + SK) + ',' + (BASE - D) + ' ' + (px1 + SK) + ',' + (BASE - D + 9) + ' ' + px1 + ',' + (BASE + 9), fill: '#c9ced2' }, bld);

      var anchors = [], floor = BASE - D / 2, GH = [72, 68, 64, 60];
      LEVELS.forEach(function (L, i) {
        var x0 = CX - L.w / 2 + i * 6, x1 = x0 + L.w, gTop = floor - GH[i], gi = L.w * .1;
        svgEl('rect', { x: x0 + gi, y: gTop, width: L.w - gi * 2, height: floor - gTop, fill: L.hot ? 'url(#kc-glass-hot)' : 'url(#kc-glass)' }, bld);
        for (var mx = x0 + gi + 22; mx < x1 - gi - 4; mx += 26) svgEl('line', { x1: mx, y1: gTop, x2: mx, y2: floor, stroke: '#ffffff', 'stroke-width': 1.1, opacity: .7 }, bld);
        svgEl('line', { x1: x0 + gi, y1: (gTop + floor) / 2, x2: x1 - gi, y2: (gTop + floor) / 2, stroke: '#ffffff', 'stroke-width': .8, opacity: .45 }, bld);
        if (L.hot) svgEl('rect', { x: x0 + gi, y: gTop, width: L.w - gi * 2, height: floor - gTop, fill: '#6fa8d6', opacity: .28, filter: 'url(#kc-glow)' }, bld);
        [x0 + 14, x1 - 14].forEach(function (cx) { svgEl('rect', { x: cx - 2.5, y: gTop, width: 5, height: floor - gTop, fill: '#f4f5f6' }, bld); });
        var y = gTop - T;
        svgEl('polygon', { points: x0 + ',' + (y + T) + ' ' + x1 + ',' + (y + T) + ' ' + x1 + ',' + y + ' ' + x0 + ',' + y, fill: 'url(#kc-face)', stroke: 'rgba(18,21,26,.08)' }, bld);
        svgEl('polygon', { points: x1 + ',' + (y + T) + ' ' + (x1 + SK) + ',' + (y + T - D) + ' ' + (x1 + SK) + ',' + (y - D) + ' ' + x1 + ',' + y, fill: '#d7dbdf' }, bld);
        svgEl('polygon', { points: x0 + ',' + y + ' ' + x1 + ',' + y + ' ' + (x1 + SK) + ',' + (y - D) + ' ' + (x0 + SK) + ',' + (y - D), fill: '#fbfbfc' }, bld);
        svgEl('rect', { x: x0 + gi, y: gTop, width: L.w - gi * 2, height: 5, fill: 'rgba(18,21,26,.12)' }, bld);
        anchors.push({ L: L, x: x1 + SK * .6, y: y - D * .3 + T / 2 });
        floor = y - D / 2;
      });
      [px0 + 120, px0 + 134].forEach(function (fx) {
        svgEl('rect', { x: fx - 2.2, y: BASE - 22, width: 4.4, height: 15, rx: 2, fill: '#2b3037' }, bld);
        svgEl('circle', { cx: fx, cy: BASE - 25.5, r: 2.6, fill: '#2b3037' }, bld);
      });

      var refl = svgEl('g', { 'class': 'layer', mask: 'url(#kc-refl-mask)' }, svg);
      svgEl('use', { href: '#kc-bld', transform: 'translate(0 ' + (2 * (BASE + 9)) + ') scale(1 -1)', opacity: .55, filter: 'url(#kc-soft)' }, refl);
      var front = svgEl('g', { 'class': 'layer' }, svg);
      var inner = svgEl('g', { 'class': 'bld' }, front);
      svgEl('ellipse', { cx: CX + 30, cy: BASE + 14, rx: 400, ry: 16, fill: 'rgba(18,21,26,.08)' }, inner);
      svgEl('use', { href: '#kc-bld' }, inner);

      svgEl('rect', { y: HZ - 70, width: W, height: 140, fill: 'url(#kc-mist)' }, svg);
      if (!narrow) svgEl('rect', { width: 980, height: H, fill: 'url(#kc-fade)' }, svg);

      // frosted labels pinned to each level
      var pins = svgEl('g', { 'class': 'layer' }, svg);
      var fs = narrow ? 17 : 14, fs2 = narrow ? 0 : 12.5;
      anchors.forEach(function (a) {
        var g = svgEl('g', { 'class': 'pin' }, pins);
        var lx = a.x + (narrow ? 14 : 24), w = narrow ? 160 : 150, h = narrow ? 40 : 50;
        var tone = a.L.hot ? '#2a64a8' : 'rgba(18,21,26,.35)';
        svgEl('line', { x1: a.x, y1: a.y, x2: lx, y2: a.y, stroke: tone, 'stroke-width': 1 }, g);
        svgEl('circle', { cx: a.x, cy: a.y, r: narrow ? 7 : 5.5, fill: a.L.hot ? '#2a64a8' : '#ffffff', stroke: a.L.hot ? '#2a64a8' : 'rgba(18,21,26,.3)' }, g);
        if (a.L.hot) svgEl('circle', { cx: a.x, cy: a.y, r: 12, fill: 'none', stroke: '#2a64a8', opacity: .3 }, g);
        svgEl('rect', { x: lx, y: a.y - h / 2, width: w, height: h, rx: 10, fill: 'rgba(255,255,255,.8)', stroke: '#ffffff' }, g);
        var t1 = svgEl('text', { x: lx + 14, y: fs2 ? a.y - 3 : a.y + 6, 'font-family': 'Geist Mono, monospace', 'font-size': fs, 'letter-spacing': '1.4', fill: '#12151a', 'font-weight': 500 }, g);
        t1.textContent = a.L.name.toUpperCase();
        if (fs2) {
          var t2 = svgEl('text', { x: lx + 14, y: a.y + 15, 'font-family': 'Geist, sans-serif', 'font-size': fs2, fill: '#59606a' }, g);
          t2.textContent = a.L.sub;
        }
      });
      layers = [[far, 6], [refl, 10], [front, 14], [pins, 24]];
    }

    draw();
    var lastNarrow = host.clientWidth < 760;
    window.addEventListener('resize', function () {
      var n = host.clientWidth < 760;
      if (n !== lastNarrow) { lastNarrow = n; draw(); }
    });

    var stage = host.closest('.stage');
    if (stage && finePointer && !reduced) {
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        layers.forEach(function (l) { l[0].style.transform = 'translate(' + (-x * l[1]).toFixed(1) + 'px, ' + (-y * l[1] * .5).toFixed(1) + 'px)'; });
      });
      stage.addEventListener('pointerleave', function () { layers.forEach(function (l) { l[0].style.transform = ''; }); });
    }
  }

  /* ─── Project card drawings: each project's real structure ─── */
  function cardArt() {
    var ph = document.getElementById('art-phases');
    if (ph) {
      ['Brand', 'Plan', 'Mockups', 'Canva', 'Build', 'Publish', 'SEO'].forEach(function (n, i) {
        var x = 20 + i * 80;
        svgEl('circle', { cx: x, cy: 44, r: i === 4 ? 7 : 5, fill: i === 4 ? '#2a64a8' : '#fff', stroke: i === 4 ? '#2a64a8' : 'rgba(18,21,26,.4)' }, ph);
        var t = svgEl('text', { x: i === 0 ? 14 : x, y: 74, 'text-anchor': i === 0 ? 'start' : 'middle' }, ph);
        t.textContent = ('P' + (i + 1) + ' ' + n).toUpperCase();
      });
    }
    var ch = document.getElementById('art-chain');
    if (ch) {
      var CH = ['Kali', 'Windows 11', 'Forwarder', 'Splunk', 'Python', 'Case note'];
      CH.forEach(function (n, i) {
        var x = 10 + i * 86, hot = n === 'Splunk';
        svgEl('rect', { x: x, y: 26, width: 74, height: 34, rx: 8, fill: '#fff', stroke: hot ? '#2a64a8' : 'rgba(18,21,26,.22)', 'stroke-width': hot ? 1.5 : 1 }, ch);
        var t = svgEl('text', { x: x + 37, y: 47, 'text-anchor': 'middle' }, ch);
        t.textContent = n.toUpperCase();
        if (i < CH.length - 1) svgEl('line', { x1: x + 74, y1: 43, x2: x + 86, y2: 43, stroke: 'rgba(18,21,26,.4)' }, ch);
      });
      var e = svgEl('text', { x: 10 + 3 * 86, y: 82 }, ch);
      e.textContent = 'EVENT ID 4625 THRESHOLD';
    }
  }

  /* ─── "How I build" steps ───
     Without the script: a numbered list with every step written out.
     With it: the list becomes tabs driving one frosted detail panel. */
  function steps() {
    var list = document.querySelector('.steps');
    var panel = document.getElementById('step-detail');
    if (!list || !panel) return;
    var items = Array.prototype.slice.call(list.children);
    var data = items.map(function (li) {
      return {
        name: li.querySelector('.name').textContent,
        title: li.getAttribute('data-title'),
        text: li.querySelector('p').textContent,
        ev: li.getAttribute('data-ev')
      };
    });
    list.classList.add('is-live');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Process steps');
    var buttons = items.map(function (li, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.id = 'step-' + i;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'step-detail');
      var n = li.querySelector('.n'), nm = li.querySelector('.name');
      b.appendChild(n); b.appendChild(nm);
      var arrow = document.createElement('span');
      arrow.className = 'arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '→';
      b.appendChild(arrow);
      li.insertBefore(b, li.firstChild);
      li.setAttribute('role', 'presentation');
      b.addEventListener('click', function () { pick(i); });
      if (finePointer) b.addEventListener('mouseenter', function () { pick(i); });
      b.addEventListener('keydown', function (e) {
        var k = items.length, to = e.key === 'ArrowDown' ? (i + 1) % k : e.key === 'ArrowUp' ? (i - 1 + k) % k : -1;
        if (to >= 0) { e.preventDefault(); pick(to); buttons[to].focus(); }
      });
      return b;
    });
    panel.hidden = false;
    var cur = -1;
    function pick(i) {
      if (i === cur) return;
      cur = i;
      buttons.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
      panel.setAttribute('aria-labelledby', 'step-' + i);
      var d = data[i];
      panel.textContent = '';
      var m = document.createElement('span'); m.className = 'mono';
      m.textContent = 'Step ' + String(i + 1).padStart(2, '0') + ' of ' + String(data.length).padStart(2, '0') + ' · ' + d.name;
      var meter = document.createElement('div'); meter.className = 'meter'; meter.setAttribute('aria-hidden', 'true');
      data.forEach(function (_, k) { var t = document.createElement('i'); if (k <= i) t.className = 'on'; meter.appendChild(t); });
      var h = document.createElement('h3'); h.textContent = d.title;
      var p = document.createElement('p'); p.textContent = d.text;
      var ev = document.createElement('p'); ev.className = 'ev';
      var b = document.createElement('b'); b.textContent = 'Evidence: ';
      ev.appendChild(b); ev.appendChild(document.createTextNode(d.ev));
      [m, meter, h, p, ev].forEach(function (n) { panel.appendChild(n); });
    }
    pick(0);
  }
})();
