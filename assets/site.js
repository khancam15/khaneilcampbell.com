// khaneilcampbell.com · Atelier. Progressive enhancement only: every page reads fully without this file.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal sections as they enter the viewport.
  var items = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    root.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Mobile menu.
  var nav = document.querySelector('.nav');
  var btn = nav && nav.querySelector('.menu');
  if (btn) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
      document.body.classList.toggle('locked', open);
    };
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
  }

  // Magnetic call-to-action buttons on pointer devices.
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * 0.15 + 'px,' + (e.clientY - r.top - r.height / 2) * 0.25 + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  // Architecture diagrams: each component links to its detail card; here the cards
  // become a single inspector panel, and arrow keys move between components.
  var narrow = window.matchMedia('(max-width: 860px)');
  document.querySelectorAll('[data-ad]').forEach(function (ad) {
    var nodes = Array.prototype.slice.call(ad.querySelectorAll('.ad-node'));
    var status = ad.querySelector('.ad-status');
    if (!nodes.length) return;
    var cardFor = function (n) { return document.getElementById(n.getAttribute('aria-controls')); };
    var select = function (node, fromUser) {
      nodes.forEach(function (n) {
        var on = n === node;
        if (on) n.setAttribute('aria-current', 'true'); else n.removeAttribute('aria-current');
        var card = cardFor(n);
        if (card) card.classList.toggle('on', on);
      });
      if (!fromUser) return;
      if (status) status.textContent = 'Showing details for ' + node.querySelector('b').textContent;
      var card = cardFor(node);
      if (card && narrow.matches) card.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    };
    ad.classList.add('live');
    nodes.forEach(function (n, i) {
      n.addEventListener('click', function (e) { e.preventDefault(); select(n, true); });
      n.addEventListener('keydown', function (e) {
        var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        var j = e.key === 'Home' ? 0 : e.key === 'End' ? nodes.length - 1 : step ? (i + step + nodes.length) % nodes.length : -1;
        if (j < 0) return;
        e.preventDefault();
        nodes[j].focus();
      });
    });
    ad.querySelectorAll('.ad-back').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        (ad.querySelector('.ad-node[aria-current]') || nodes[0]).focus();
      });
    });
    select(ad.querySelector('.ad-node[data-default]') || nodes[0], false);

    // Animate the data flow only while the diagram is on screen.
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        ad.classList.toggle('run', entries[0].isIntersecting);
      }).observe(ad);
    }
  });

})();
