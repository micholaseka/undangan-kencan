/* ============================================================
   💜 Kencan — Interactions
   - Tombol "Tidak Mau"  : alert sesuai permintaan
   - Tombol "Ya"         : loading 1 detik lalu pindah halaman
   - Halaman sukses      : animasi meriah (confetti) di detik pertama
   ============================================================ */
(() => {
  'use strict';

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==================== Floating hearts ==================== */
  const heartsLayer = document.getElementById('heartsLayer');
  if (heartsLayer && !reducedMotion) {
    const glyphs = ['💗', '💜', '💖', '✨', '💞', '💕'];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span');
      el.className = 'float-heart';
      el.textContent = pick(glyphs);
      el.style.left = rand(2, 96).toFixed(1) + '%';
      el.style.fontSize = rand(12, 26).toFixed(0) + 'px';
      el.style.opacity = rand(0.18, 0.5).toFixed(2);
      el.style.animationDuration = rand(10, 20).toFixed(1) + 's';
      el.style.animationDelay = (-rand(0, 20)).toFixed(1) + 's';
      el.style.setProperty('--sway', rand(-40, 40).toFixed(0) + 'px');
      frag.appendChild(el);
    }
    heartsLayer.appendChild(frag);
  }

  /* ==================== Halaman utama: tombol ==================== */
  const noBtn = document.getElementById('noGakMawBtn');
  const yesBtn = document.getElementById('yesBtn');

  if (noBtn) {
    noBtn.addEventListener('click', () => {
      alert('tombol rusak!! jajal tombol liyane');
    });
  }

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      const overlay = document.getElementById('loadingOverlay');

      yesBtn.disabled = true;
      document.documentElement.classList.add('is-busy');

      if (overlay) {
        overlay.classList.add('is-active');
        overlay.setAttribute('aria-hidden', 'false');
      }

      // Loading 1 detik, lalu pindah ke halaman pesan kencan
      window.setTimeout(() => {
        window.location.href = 'pesan-sudah-Buat.html';
      }, 1000);
    });
  }

  /* ==================== Halaman sukses: confetti ==================== */
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && !reducedMotion) {
    startCelebration(canvas);
  }

  function startCelebration(canvasEl) {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const COLORS = ['#ff4d8d', '#ff8fc7', '#f0abfc', '#c084fc', '#a78bfa', '#e879f9', '#ffd6e8', '#fbcfe8'];
    const particles = [];
    let rafId = 0;

    /* --- Canvas responsif (retina-ready) --- */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = Math.round(window.innerWidth * dpr);
      canvasEl.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    /* --- Path hati (parametrik) --- */
    const heartPath = (size) => {
      const scale = size / 34;
      const steps = 28;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3) * scale;
        const y =
          -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    /* --- Semburan partikel --- */
    const emit = (x, y, count, angle, spread, power) => {
      for (let i = 0; i < count; i++) {
        const a = angle + rand(-spread, spread);
        const speed = rand(power * 0.45, power);
        const r = Math.random();

        particles.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          size: rand(6, 13),
          color: pick(COLORS),
          shape: r < 0.4 ? 'heart' : r < 0.7 ? 'ribbon' : 'dot',
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.18, 0.18),
          life: 1,
          decay: rand(0.005, 0.011),
          wobble: rand(0, Math.PI * 2),
          wobbleAmp: rand(0.3, 0.9),
          wobbleSpeed: rand(0.06, 0.14)
        });
      }
    };

    /* --- Ledakan meriah di detik pertama --- */
    emit(W() * 0.5, H() * 0.4, 60, -Math.PI / 2, Math.PI, 12);      // tengah
    emit(-10, H() * 0.95, 50, -Math.PI / 3, 0.5, 17);               // meriam kiri
    emit(W() + 10, H() * 0.95, 50, -(Math.PI - Math.PI / 3), 0.5, 17); // meriam kanan
    window.setTimeout(() => emit(W() * 0.5, H() * 0.35, 40, -Math.PI / 2, Math.PI, 10), 380);

    /* --- Render loop --- */
    const tick = () => {
      ctx.clearRect(0, 0, W(), H());

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vy += 0.14;          // gravitasi
        p.vx *= 0.988;         // gesekan
        p.vy *= 0.988;
        p.wobble += p.wobbleSpeed;
        p.rot += p.vr;
        p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > H() + 80) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.6);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === 'heart') {
          heartPath(p.size * 1.1);
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length) {
        rafId = requestAnimationFrame(tick);
      } else {
        canvasEl.style.opacity = '0';
      }
    };

    rafId = requestAnimationFrame(tick);

    // Pengaman: hentikan setelah 8 detik
    window.setTimeout(() => {
      if (particles.length) {
        cancelAnimationFrame(rafId);
        canvasEl.style.opacity = '0';
      }
    }, 8000);
  }
})();
