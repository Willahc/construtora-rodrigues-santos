/* =========================================================
   Construtora Rodrigues Santos — interações da one page
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');

  /* ---------- header no scroll ---------- */
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- menu mobile ---------- */
  function closeMenu() {
    if (!menu || !burger) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  }

  function openMenu() {
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('menu-open');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') closeMenu();
      else openMenu();
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- scrollspy ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var active = a.getAttribute('href') === '#' + entry.target.id;
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------- reveal on scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          rev.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach(function (el) { rev.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- filtros da galeria ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var obras = Array.prototype.slice.call(document.querySelectorAll('.obra'));
  var empty = document.querySelector('.gallery__empty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;

      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      var visible = 0;
      obras.forEach(function (obra) {
        var show = filter === 'todas' || obra.dataset.cat === filter;
        obra.hidden = !show;
        if (show) {
          visible++;
          obra.classList.add('is-in');
        }
      });

      if (empty) empty.hidden = visible > 0;
    });
  });

  /* ---------- lightbox ---------- */
  var dataEl = document.getElementById('galerias');
  var galerias = {};
  try { galerias = JSON.parse(dataEl.textContent); } catch (e) { galerias = {}; }

  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbTitle = document.getElementById('lb-title');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var btnClose = lb.querySelector('.lightbox__close');
  var btnPrev = lb.querySelector('.lightbox__nav--prev');
  var btnNext = lb.querySelector('.lightbox__nav--next');
  var lastFocus = null;
  var current = null;
  var index = 0;

  function preload(i) {
    if (!current) return;
    var item = current.imgs[(i + current.imgs.length) % current.imgs.length];
    if (item) { var im = new Image(); im.src = item.src; }
  }

  function render() {
    var item = current.imgs[index];
    lbImg.src = item.src;
    lbImg.alt = item.cap || current.title;
    lbTitle.textContent = current.title;
    lbCap.textContent = item.cap || current.sub || '';
    lbCount.textContent = (index + 1) + ' / ' + current.imgs.length;
    preload(index + 1);
    preload(index - 1);
  }

  function openLightbox(key) {
    current = galerias[key];
    if (!current || !current.imgs || !current.imgs.length) return;
    index = 0;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    btnClose.focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    if (!current) return;
    index = (index + dir + current.imgs.length) % current.imgs.length;
    render();
  }

  document.querySelectorAll('[data-gallery]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(btn.dataset.gallery);
    });
  });

  if (lb) {
    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', function () { step(-1); });
    btnNext.addEventListener('click', function () { step(1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'Tab') {
        var foco = [btnClose, btnPrev, btnNext];
        var i = foco.indexOf(document.activeElement);
        if (e.shiftKey) {
          if (i <= 0) { e.preventDefault(); btnNext.focus(); }
        } else if (i === foco.length - 1 || i === -1) {
          e.preventDefault(); btnClose.focus();
        }
      }
    });
  }

  /* ---------- formulário → WhatsApp ---------- */
  var form = document.getElementById('form');
  var status = document.getElementById('form-status');
  var WHATS = '5511983485444';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nome = form.nome.value.trim();
      var empresa = form.empresa.value.trim();
      var telefone = form.telefone.value.trim();
      var servico = form.servico.value;
      var mensagem = form.mensagem.value.trim();

      if (!nome || !telefone) {
        status.textContent = 'Preencha nome e telefone para continuar.';
        (!nome ? form.nome : form.telefone).focus();
        return;
      }

      var texto = 'Olá! Vim pelo site.\n' +
        'Nome: ' + nome + '\n' +
        (empresa ? 'Empresa: ' + empresa + '\n' : '') +
        'Telefone: ' + telefone + '\n' +
        'Serviço: ' + servico +
        (mensagem ? '\n\n' + mensagem : '');

      var url = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(texto);
      status.textContent = 'Abrindo o WhatsApp…';
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- ano do rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
