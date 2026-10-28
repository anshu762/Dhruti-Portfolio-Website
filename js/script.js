/* ============================================================
   DHRUTI RAJIV — PORTFOLIO JS
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------------- THEME (run immediately) ---------------- */
  const savedTheme = localStorage.getItem('dr-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  document.addEventListener('DOMContentLoaded', init);

  function init() {

    /* ---------------- LOADER ---------------- */
    const loader = $('#loader'), loaderBar = $('#loaderBar');
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 18 + 7;
      if (p >= 100) { p = 100; clearInterval(tick); finishLoad(); }
      if (loaderBar) loaderBar.style.width = p + '%';
    }, 180);

    function finishLoad() {
      setTimeout(() => {
        loader && loader.classList.add('gone');
        document.body.classList.remove('is-loading');
        revealAll();
        setTimeout(() => loader && (loader.style.display = 'none'), 800);
      }, 450);
    }
    // Safety net
    setTimeout(() => {
      if (document.body.classList.contains('is-loading')) {
        clearInterval(tick); finishLoad();
      }
    }, 4500);

    /* ---------------- THEME TOGGLE ---------------- */
    const themeBtn = $('#themeToggle');
    themeBtn && themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('dr-theme', next);
    });

    /* ---------------- CUSTOM CURSOR ---------------- */
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    if (dot && ring && !isTouch && window.innerWidth > 900) {
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      }, { passive: true });
      (function loop() {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(loop);
      })();
      document.addEventListener('mouseover', e => {
        if (e.target.closest('a,button,.proj,.cert,.skill-card,.act,.ach,.fact,.pill,.stat,.soft-card,.cbox,.exp,.vs-card'))
          ring.classList.add('on');
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest('a,button,.proj,.cert,.skill-card,.act,.ach,.fact,.pill,.stat,.soft-card,.cbox,.exp,.vs-card'))
          ring.classList.remove('on');
      });
    } else {
      dot && (dot.style.display = 'none');
      ring && (ring.style.display = 'none');
    }

    /* ---------------- SPLIT HERO NAME ---------------- */
    const heroName = $('#heroName');
    if (heroName) {
      const txt = heroName.textContent.trim();
      heroName.innerHTML = txt.split('').map(c =>
        c === ' ' ? '<span class="ch">&nbsp;</span>' : `<span class="ch">${c}</span>`
      ).join('');
    }

    /* ---------------- NAVBAR ---------------- */
    const navbar = $('#navbar'), navProgress = $('#navProgress');
    const navLinks = $$('.nav-link'), mmLinks = $$('.mm-link');
    const sections = $$('section[id]');

    function onScroll() {
      const y = window.scrollY;
      navbar && navbar.classList.toggle('stuck', y > 40);

      // progress bar
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (navProgress) navProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

      // active section
      let cur = 'home';
      sections.forEach(s => { if (y >= s.offsetTop - 160) cur = s.id; });
      navLinks.forEach(a => a.classList.toggle('active', a.dataset.sec === cur));
      mmLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));

      // to-top
      toTop && toTop.classList.toggle('show', y > 500);

      // hero parallax
      if (y < window.innerHeight) {
        const b1 = $('.blob-a'), b2 = $('.blob-b');
        b1 && (b1.style.transform = `translateY(${y * 0.18}px)`);
        b2 && (b2.style.transform = `translateY(${y * -0.12}px)`);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------------- MOBILE MENU ---------------- */
    const burger = $('#burger'), mmenu = $('#mobileMenu');
    function closeMenu() {
      burger && burger.classList.remove('open');
      mmenu && mmenu.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
    burger && burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mmenu.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);
      if (open) {
        $$('.mm-link', mmenu).forEach((l, i) => l.style.transitionDelay = (0.06 + i * 0.045) + 's');
      } else {
        $$('.mm-link', mmenu).forEach(l => l.style.transitionDelay = '0s');
      }
    });
    mmLinks.forEach(l => l.addEventListener('click', closeMenu));

    /* ---------------- SMOOTH ANCHORS ---------------- */
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        closeMenu();
        const off = (window.innerWidth > 1080 ? 66 : 60);
        window.scrollTo({ top: t.offsetTop - off, behavior: 'smooth' });
      });
    });

    /* ---------------- TYPEWRITER ---------------- */
    const typeEl = $('#typeText');
    const words = [
      'Business Strategy',
      'Entrepreneurship',
      'Economics & Finance',
      'Social Enterprise',
      'Cultural Preservation',
      'Investment Research',
      'Community Impact'
    ];
    if (typeEl) {
      let wi = 0, ci = 0, del = false;
      (function type() {
        const w = words[wi];
        typeEl.textContent = del ? w.slice(0, ci--) : w.slice(0, ci++);
        let sp = del ? 38 : 78;
        if (!del && ci > w.length) { sp = 1800; del = true; ci = w.length; }
        else if (del && ci < 0) { del = false; ci = 0; wi = (wi + 1) % words.length; sp = 300; }
        setTimeout(type, sp);
      })();
    }

    /* ---------------- FLOATING MOTIFS ---------------- */
    const field = $('#motifField');
    if (field && !isTouch) {
      const icons = ['fa-gem', 'fa-star', 'fa-circle', 'fa-diamond', 'fa-certificate'];
      for (let i = 0; i < 14; i++) {
        const el = document.createElement('i');
        el.className = 'motif fa-solid ' + icons[i % icons.length];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (Math.random() * 14 + 7) + 'px';
        el.style.animationDuration = (Math.random() * 14 + 16) + 's';
        el.style.animationDelay = (Math.random() * 16) + 's';
        field.appendChild(el);
      }
    }

    /* ---------------- REVEAL ON SCROLL ---------------- */
    const revealEls = $$('.reveal');
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        fireInner(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));

    function revealAll() {
      // reveal anything already in viewport on load
      revealEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92) { el.classList.add('in'); fireInner(el); }
      });
    }

    function fireInner(el) {
      // skill bars
      $$('.bar i', el).forEach(b => setTimeout(() => b.style.width = b.dataset.w + '%', 250));
      // score bars
      $$('.track i', el).forEach(b => setTimeout(() => b.style.width = b.dataset.w + '%', 250));
      // counters
      $$('.count', el).forEach(runCount);
      // card stagger
      const kids = $$('.skill-card,.soft-card,.proj,.cert,.act,.ach,.exp,.fact,.pill', el);
      kids.forEach((k, i) => {
        k.style.opacity = '0';
        k.style.transform = 'translateY(22px)';
        k.style.transition = `opacity .55s ease ${i * 0.05}s, transform .55s cubic-bezier(.16,1,.3,1) ${i * 0.05}s`;
        requestAnimationFrame(() => { k.style.opacity = '1'; k.style.transform = 'none'; });
        setTimeout(() => { k.style.transition = ''; k.style.transform = ''; }, 1400 + i * 50);
      });
    }

    /* ---------------- COUNTERS ---------------- */
    function runCount(el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = parseFloat(el.dataset.count);
      const dec = target % 1 !== 0;
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      const dur = 1800, t0 = performance.now();
      (function step(now) {
        const pr = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - pr, 3);
        const v = target * e;
        el.textContent = pre + (dec ? v.toFixed(1) : Math.floor(v).toLocaleString('en-IN')) + suf;
        if (pr < 1) requestAnimationFrame(step);
        else el.textContent = pre + (dec ? target.toFixed(1) : target.toLocaleString('en-IN')) + suf;
      })(t0);
    }

    /* ---------------- SKILL TABS ---------------- */
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.dataset.tab;
        $$('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        $$('.tab-panel').forEach(pnl => {
          const on = pnl.id === id;
          pnl.classList.toggle('active', on);
          if (on) {
            $$('.bar i', pnl).forEach(b => {
              b.style.width = '0%';
              setTimeout(() => b.style.width = b.dataset.w + '%', 80);
            });
            const g = $('.reveal', pnl) || pnl.querySelector('.skill-grid,.soft-grid');
            g && g.classList.add('in');
          }
        });
      });
    });

    /* ---------------- PROJECT FILTER ---------------- */
    const projects = $$('.proj');
    $$('.filter').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.f;
        $$('.filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        projects.forEach(p => {
          const show = f === 'all' || p.dataset.cat === f;
          p.classList.toggle('hidden', !show);
          if (show) { p.classList.remove('fade'); void p.offsetWidth; p.classList.add('fade'); }
        });
      });
    });

    /* ---------------- 3D TILT ---------------- */
    if (!isTouch && window.innerWidth > 992) {
      $$('.proj, .cert, .ach-hero').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const rx = ((e.clientY - r.top) / r.height - .5) * -7;
          const ry = ((e.clientX - r.left) / r.width - .5) * 7;
          card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-9px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      });
    }

        /* ---------------- YOUTUBE (direct iframe — no facade) ---------------- */
    // Video is now embedded directly via <iframe> in the HTML.
    // No JS needed here. Keeping block for structure.

    /* ---------------- CERTIFICATE LIGHTBOX ---------------- */
    const certs = $$('.cert');
    const lb = $('#lightbox'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'),
          lbDesc = $('#lbDesc'), lbFb = $('#lbFallback'), lbPath = $('#lbPath');
    let lbIndex = 0;

    function openLB(i) {
      lbIndex = (i + certs.length) % certs.length;
      const c = certs[lbIndex];
      const src = c.dataset.src;
      lbTitle.textContent = c.dataset.title || '';
      lbDesc.textContent  = c.dataset.desc || '';
      lbPath.textContent  = src;
      lbFb.classList.remove('show');
      lbImg.style.display = 'block';
      lbImg.alt = c.dataset.title || '';
      lbImg.onerror = () => { lbImg.style.display = 'none'; lbFb.classList.add('show'); };
      lbImg.src = src;
      lb.classList.add('open');
      document.body.classList.add('no-scroll');
    }
    function closeLB() { lb.classList.remove('open'); document.body.classList.remove('no-scroll'); setTimeout(()=>{lbImg.src='';},300); }

    certs.forEach((c, i) => c.addEventListener('click', () => openLB(i)));
    $('#lbClose') && $('#lbClose').addEventListener('click', closeLB);
    $('#lbPrev')  && $('#lbPrev').addEventListener('click', e => { e.stopPropagation(); openLB(lbIndex - 1); });
    $('#lbNext')  && $('#lbNext').addEventListener('click', e => { e.stopPropagation(); openLB(lbIndex + 1); });
    lb && lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

    document.addEventListener('keydown', e => {
      if (lb && lb.classList.contains('open')) {
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowLeft') openLB(lbIndex - 1);
        if (e.key === 'ArrowRight') openLB(lbIndex + 1);
      }
      if (e.key === 'Escape') closeMenu();
    });

    /* ---------------- CONTACT FORM ---------------- */
    const form = $('#contactForm'), done = $('#formDone'), resetBtn = $('#formReset');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const f = {
          name:    $('#cname'),
          email:   $('#cmail'),
          subject: $('#csub'),
          message: $('#cmsg')
        };
        let ok = true;
        Object.values(f).forEach(el => {
          const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
          el.classList.toggle('err', bad);
          if (bad) ok = false;
        });
        if (!ok) { form.querySelector('.err').focus(); return; }

        const body = `Name: ${f.name.value}\nEmail: ${f.email.value}\n\n${f.message.value}`;
        window.location.href =
          `mailto:dhrutiirajiv10@gmail.com?subject=${encodeURIComponent(f.subject.value)}&body=${encodeURIComponent(body)}`;

        form.style.display = 'none';
        done && done.classList.add('show');
      });
    }
    resetBtn && resetBtn.addEventListener('click', () => {
      form.reset(); form.style.display = 'block'; done.classList.remove('show');
      $$('.fld input,.fld textarea').forEach(i => i.classList.remove('err'));
    });

    /* ---------------- TO TOP ---------------- */
    const toTopBtn = $('#toTop');
    toTopBtn && toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ---------------- YEAR ---------------- */
    const yr = $('#yr'); yr && (yr.textContent = new Date().getFullYear());

    console.log('%c  Dhruti Rajiv · Business · Culture · Impact  ',
      'background:linear-gradient(90deg,#C05621,#CBA14B);color:#fff;font-size:13px;font-weight:700;padding:6px 10px;border-radius:6px;');
  }

  // expose toTop early for scroll handler
  var toTop = null;
  document.addEventListener('DOMContentLoaded', () => { toTop = document.getElementById('toTop'); });
})();