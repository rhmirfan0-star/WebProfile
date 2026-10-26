'use strict';

/* =========================================================
   KONFIGURASI: ubah data di bagian ini saja
   - URL kosong ('') = tombol/ikon otomatis disembunyikan
   ========================================================= */
const CONFIG = {
  email: 'email@contoh.com',            // GANTI dengan email Anda
  formEndpoint: '',                     // Opsional: URL Formspree/Getform, mis. 'https://formspree.io/f/xxxx'
  socials: [                            // GANTI: isi url dengan tautan akun Anda (harus diawali https://)
    { label: 'GitHub',    url: '', icon: 'github' },
    { label: 'LinkedIn',  url: '', icon: 'linkedin' },
    { label: 'Instagram', url: '', icon: 'instagram' }
  ],
  projects: [                           // GANTI: data contoh, bebas ditambah atau dihapus
    {
      title: 'Project One',
      category: 'Web',                  // harus sama dengan data-filter di index.html
      desc: 'Short description of what the project does and the problem it solves.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      image: '',                        // isi path gambar, mis. 'img/project-1.jpg' (rasio 16:10)
      hue: 262,                         // warna thumbnail placeholder (0-360)
      demo: '',                         // URL demo
      source: ''                        // URL source code
    },
    {
      title: 'Project Two',
      category: 'UI/UX',
      desc: 'Short description of the design process, research and final result.',
      tags: ['Figma', 'Prototype', 'User flow'],
      image: '', hue: 222, demo: '', source: ''
    },
    {
      title: 'Project Three',
      category: 'Web',
      desc: 'Short description of a responsive website or small web app you built.',
      tags: ['Responsive', 'Grid', 'Accessibility'],
      image: '', hue: 286, demo: '', source: ''
    },
    {
      title: 'Project Four',
      category: 'Graphic',
      desc: 'Short description of a branding, poster or social media design.',
      tags: ['Branding', 'Poster'],
      image: '', hue: 245, demo: '', source: ''
    }
  ]
};

/* Ikon sosial (path SVG bergaya garis) */
const ICONS = {
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'
};
 
/* =========================================================
   HELPER
   ========================================================= */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isValidUrl = (url) => /^https?:\/\//i.test(url || '');

// Mencegah karakter khusus merusak HTML saat data dirender
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const iconSvg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

/* Toast: notifikasi singkat di bawah layar */
function notify(message, type = 'info') {
  const region = $('#toast');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.dataset.type = type;
  toast.textContent = message;
  region.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

/* =========================================================
   RENDER DATA (sosial, email, proyek)
   ========================================================= */
function renderSocials() {
  const links = CONFIG.socials.filter((s) => isValidUrl(s.url)).map((s) => `
    <li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)}">${iconSvg(s.icon)}</a></li>`);
  if (CONFIG.email) {
    links.push(`<li><a href="mailto:${esc(CONFIG.email)}" aria-label="Send an email">${iconSvg('mail')}</a></li>`);
  }
  $$('[data-socials]').forEach((list) => { list.innerHTML = links.join(''); });

  $$('[data-email]').forEach((link) => {
    if (!CONFIG.email) { link.hidden = true; return; }
    link.href = `mailto:${CONFIG.email}`;
    link.textContent = CONFIG.email;
  });
}

function renderProjects() {
  const grid = $('#project-grid');
  if (!grid) return;

  grid.innerHTML = CONFIG.projects.map((p) => {
    const media = p.image
      ? `<img class="thumb__media" src="${esc(p.image)}" alt="Preview of ${esc(p.title)}" width="640" height="400" loading="lazy">`
      : `<div class="thumb__media thumb__media--ph" style="--h:${Number(p.hue) || 262}" role="img" aria-label="Placeholder preview of ${esc(p.title)}"></div>`;
    const demo = isValidUrl(p.demo)
      ? `<a class="btn btn--primary btn--sm" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">View Project</a>` : '';
    const source = isValidUrl(p.source)
      ? `<a class="btn btn--ghost btn--sm" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Source Code</a>` : '';

    return `
      <article class="project card" data-category="${esc(p.category)}" data-reveal>
        <div class="thumb">${media}</div>
        <div class="project__body">
          <span class="project__cat">${esc(p.category)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          ${demo || source ? `<div class="project__links">${demo}${source}</div>` : ''}
        </div>
      </article>`;
  }).join('');
}

/* =========================================================
   NAVBAR: perubahan saat scroll + menu mobile
   ========================================================= */
function initNav() {
  const header = $('.header');
  const toggle = $('.nav__toggle');
  const menu = $('#nav-menu');
  const backdrop = $('.nav-backdrop');
  if (!header) return { close() {} };

  // Navbar menjadi solid setelah halaman digulir (dibatasi satu update per frame)
  let ticking = false;
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  updateHeader();

  if (!toggle || !menu) return { close() {} };

  const desktop = window.matchMedia('(min-width: 860px)');

  const setOpen = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    if (backdrop) backdrop.classList.toggle('is-visible', open);
    document.body.classList.toggle('menu-open', open);
    if (!open && restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  if (backdrop) backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false, true);
  });

  // Tutup menu otomatis jika layar melebar ke ukuran desktop
  desktop.addEventListener('change', (event) => { if (event.matches) setOpen(false); });

  return { close: () => setOpen(false) };
}

/* =========================================================
   SMOOTH SCROLL: memperhitungkan tinggi navbar
   ========================================================= */
function initAnchors(nav) {
  const header = $('.header');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    const target = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (!target) return;

    event.preventDefault();
    nav.close();

    const offset = header ? header.offsetHeight : 0;
    const top = target.id === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY - offset + 1;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

    history.pushState(null, '', hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

/* =========================================================
   MENU AKTIF sesuai section yang sedang terlihat
   ========================================================= */
function initScrollSpy() {
  const sections = $$('main section[id]');
  const links = $$('.nav__link');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // Garis deteksi berada di sekitar tengah layar
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   SCROLL REVEAL: tiap elemen hanya dianimasikan sekali
   ========================================================= */
function initReveal() {
  const items = $$('[data-reveal]');
  if (!items.length) return;

  const showAll = () => items.forEach((el) => el.classList.add('is-visible', 'is-done'));
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) { showAll(); return; }

  const observer = new IntersectionObserver((entries, obs) => {
    // Elemen yang masuk bersamaan diberi jeda bertahap (staggered)
    entries.filter((e) => e.isIntersecting).forEach((entry, index) => {
      const el = entry.target;
      el.style.setProperty('--i', Math.min(index, 5));
      el.classList.add('is-visible');
      el.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'opacity') el.classList.add('is-done');
      }, { once: true });
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  items.forEach((el) => observer.observe(el));
}

/* =========================================================
   FILTER PROYEK
   ========================================================= */
function initFilter() {
  const buttons = $$('.filter');
  const cards = $$('.project');
  if (!buttons.length || !cards.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      buttons.forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        const wasHidden = card.hidden;
        card.hidden = !match;
        card.classList.remove('is-shown');
        if (match && wasHidden) {
          // Memicu ulang animasi kecil untuk kartu yang baru muncul
          void card.offsetWidth;
          card.classList.add('is-shown');
        }
      });
    });
  });
}

/* =========================================================
   FORMULIR KONTAK: validasi + status pengiriman
   ========================================================= */
function initForm() {
  const form = $('#contact-form');
  if (!form) return;

  const status = $('#form-status');
  const submit = $('.form__submit', form);
  const fields = ['name', 'email', 'subject', 'message'];

  // Aturan validasi tiap kolom; mengembalikan pesan error atau string kosong
  const rules = {
    name: (v) => (v.length < 2 ? 'Please enter your name (at least 2 characters).' : ''),
    email: (v) => {
      if (!v) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email, for example name@example.com.';
    },
    subject: (v) => (v.length < 3 ? 'Please add a subject (at least 3 characters).' : ''),
    message: (v) => (v.length < 10 ? 'Please write a message of at least 10 characters.' : '')
  };

  const validateField = (name) => {
    const input = form.elements[name];
    const error = $(`#${name}-error`);
    const message = rules[name](input.value.trim());
    error.textContent = message;
    input.closest('.field').classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  };

  const setStatus = (text, type) => {
    status.textContent = text;
    status.dataset.type = type || '';
  };

  // Setelah kolom pernah salah, cek ulang saat pengguna mengetik
  form.addEventListener('input', (event) => {
    const { name } = event.target;
    if (fields.includes(name) && event.target.closest('.field').classList.contains('has-error')) validateField(name);
  });
  form.addEventListener('focusout', (event) => {
    const { name } = event.target;
    if (fields.includes(name) && event.target.value.trim()) validateField(name);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', '');

    const results = fields.map(validateField);
    if (results.includes(false)) {
      form.elements[fields[results.indexOf(false)]].focus();
      return;
    }

    // Tanpa layanan pengiriman, jangan mengklaim pesan sudah terkirim
    if (!CONFIG.formEndpoint) {
      const text = 'Your message is valid, but it was not sent because no form service is connected yet. Set formEndpoint in script.js or email me directly.';
      setStatus(text, 'info');
      notify('Form is valid, but sending is not set up yet.', 'info');
      return;
    }

    submit.classList.add('is-loading');
    submit.disabled = true;
    setStatus('Sending your message…', 'info');

    try {
      const response = await fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus('Thanks, your message has been sent.', 'success');
      notify('Message sent.', 'success');
    } catch (error) {
      setStatus('The message could not be sent. Please try again or email me directly.', 'error');
      notify('Sending failed. Please try again.', 'error');
    } finally {
      submit.classList.remove('is-loading');
      submit.disabled = false;
    }
  });
}

/* =========================================================
   INISIALISASI
   ========================================================= */
function init() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  renderSocials();
  renderProjects();   // harus sebelum initReveal dan initFilter agar kartu ikut terdeteksi

  const nav = initNav();
  initAnchors(nav);
  initScrollSpy();
  initReveal();
  initFilter();
  initForm();
}

// Script dimuat dengan "defer", jadi DOM sudah siap saat init dijalankan
init();
