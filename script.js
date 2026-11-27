// 1. Mobile menu
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// 2. Footer year
document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

// 3. Animated title (typing effect). Skipped if the visitor prefers reduced motion.
const typed = document.getElementById('typed');
if (typed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const words = ['BSIT Student', 'Aspiring Web Developer']; // edit these
  let w = 0, c = 0, deleting = false;
  const tick = () => {
    const word = words[w];
    typed.textContent = word.slice(0, c);
    if (!deleting && c < word.length) c++;
    else if (!deleting) { deleting = true; return setTimeout(tick, 1400); }
    else if (c > 0) c--;
    else { deleting = false; w = (w + 1) % words.length; }
    setTimeout(tick, deleting ? 45 : 90);
  };
  tick();
}

// 4. Photos: if an image fails, try other common extensions, then hide it so the placeholder shows
const EXTS = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'];
document.querySelectorAll('.hero-photo img, .frame-img img').forEach(img => {
  const original = img.getAttribute('src');
  const base = original.replace(/\.[^./]+$/, '');
  const tried = [original];

  const fail = () => {
    const next = EXTS.map(e => `${base}.${e}`).find(p => !tried.includes(p));
    if (next) {
      tried.push(next);
      img.src = next;
    } else {
      console.warn('Image failed to load. Tried:', tried);
      img.classList.add('hidden');
    }
  };

  img.addEventListener('load', () => img.classList.remove('hidden'));
  img.addEventListener('error', fail);
  if (img.complete && img.naturalWidth === 0) fail();
});

// 5. Contact form validation (no message is actually sent)
const form = document.getElementById('contact-form');
if (form) {
  const rules = {
    name:    v => v.trim().length >= 2 || 'Please enter your full name.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    subject: v => v.trim().length >= 3 || 'Please enter a subject (at least 3 characters).',
    message: v => v.trim().length >= 10 || 'Your message should be at least 10 characters.'
  };
  const status = document.getElementById('form-status');

  const check = input => {
    const result = rules[input.name](input.value);
    const field = input.closest('.field');
    field.classList.toggle('invalid', result !== true);
    field.querySelector('.error').textContent = result === true ? '' : result;
    input.setAttribute('aria-invalid', result !== true);
    return result === true;
  };

  form.querySelectorAll('input,textarea').forEach(i => i.addEventListener('blur', () => check(i)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.classList.remove('show');
    const inputs = [...form.querySelectorAll('input,textarea')];
    const allValid = inputs.map(check).every(Boolean);
    if (!allValid) { inputs.find(i => i.getAttribute('aria-invalid') === 'true').focus(); return; }
    // TODO: connect a backend or email service (e.g. Formspree, EmailJS) here.
    status.textContent = 'Your details look good, but this form is not connected to an email service yet, so nothing was sent. Please contact me using the details on this page.';
    status.classList.add('show');
  });
}

// 6. Typing effect for any ".typewriter" text (e.g. the Achievements description)
document.querySelectorAll('.typewriter').forEach(el => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fullText = el.textContent.trim();
  el.setAttribute('aria-label', fullText);
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  const typeNext = () => {
    el.textContent = fullText.slice(0, ++i);
    if (i < fullText.length) setTimeout(typeNext, 45); // 45 = speed in milliseconds
  };
  typeNext();
});


// 7. Homepage interactions: soccer ball bounce + cursor glow (skipped if visitor prefers reduced motion)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ball = document.querySelector('.hv-badge.ball');
if (ball && !reduceMotion) {
  let bounce = null;
  ball.addEventListener('click', () => {
    if (bounce) bounce.cancel();
    bounce = ball.animate([
      { transform: 'translateY(0) scale(1, 1)' },
      { transform: 'translateY(-70px) scale(.95, 1.05)', offset: 0.35 },
      { transform: 'translateY(0) scale(1.15, .85)',     offset: 0.55 },
      { transform: 'translateY(-26px) scale(1, 1)',      offset: 0.75 },
      { transform: 'translateY(0) scale(1.06, .94)',     offset: 0.9 },
      { transform: 'translateY(0) scale(1, 1)' }
    ], { duration: 900, easing: 'cubic-bezier(.3,.6,.4,1)' });
    const icon = ball.querySelector('svg');
    if (icon) icon.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 900, easing: 'ease-out' });
  });
}

// Cursor glow: on every page, and only for mouse/trackpad (not touch)
const fineMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!reduceMotion && fineMouse) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  let tx = 0, ty = 0, x = 0, y = 0, raf = null;
  const follow = () => {
    x += (tx - x) * 0.12;   // 0.12 = how smoothly it trails the mouse (smaller = slower)
    y += (ty - y) * 0.12;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) ? requestAnimationFrame(follow) : null;
  };
  window.addEventListener('pointermove', e => {
    if (!glow.classList.contains('on')) { x = tx = e.clientX; y = ty = e.clientY; }
    tx = e.clientX; ty = e.clientY;
    glow.classList.add('on');
    if (!raf) raf = requestAnimationFrame(follow);
  }, { passive: true });
  document.addEventListener('mouseleave', () => glow.classList.remove('on'));
}

// 8. Card spotlight: a soft light follows the mouse inside cards, photo frames and timeline items
if (!reduceMotion && fineMouse) {
  document.querySelectorAll('.card, .frame, .timeline li').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
    el.addEventListener('pointerleave', () => {
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
    });
  });
}

// 9. Click bursts: hearts on Family cards, stars on Achievements, soccer balls on About cards
const burst = (x, y, symbols, palette) => {
  const colors = palette || ['#FFD36E', '#F8CD8A', '#2DD4BF', '#FFFFFF'];
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('span');
    s.className = 'burst';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = symbols[i % symbols.length];
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.color = colors[i % colors.length];
    document.body.appendChild(s);
    const dx = (Math.random() - 0.5) * 140;
    const dy = -(80 + Math.random() * 110);
    const spin = (Math.random() - 0.5) * 80;
    s.animate([
      { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin}deg) scale(1.2)`, opacity: 0 }
    ], { duration: 800 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => s.remove();
  }
};
if (!reduceMotion) {
  const bind = (selector, symbols) => document.querySelectorAll(selector).forEach(el =>
    el.addEventListener('click', e => burst(e.clientX, e.clientY, symbols)));
  bind('.family .card', ['\u2665']);
  bind('.frame, .timeline li', ['\u2605']);
  bind('.about-cards .card', ['\u26BD', '\u2605']);
}


// 10. Interactive side widgets (About / Achievements / Family): click for a bounce, a burst and a counter
document.querySelectorAll('[data-sd]').forEach(btn => {
  const deco = btn.closest('.side-deco');
  const text = deco.querySelector('.sd-text');
  const countEl = deco.querySelector('.sd-count b');
  const dots = deco.querySelectorAll('.sd-dots i');
  const msgs = btn.dataset.msgs.split('|');
  const symbols = btn.dataset.symbols.split('|');
  const colors = btn.dataset.colors.split(',');
  const original = text.textContent;
  let n = 0, timer = null;
  btn.addEventListener('click', () => {
    n++;
    btn.classList.add('used');
    countEl.textContent = n;
    text.textContent = msgs[(n - 1) % msgs.length];
    text.classList.add('pop');
    clearTimeout(timer);
    timer = setTimeout(() => { text.textContent = original; text.classList.remove('pop'); }, 1800);
    dots.forEach((d, i) => d.classList.toggle('is-on', n >= (i + 1) * 5)); // a dot lights up every 5 clicks
    if (reduceMotion) return;
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    burst(cx, cy, symbols, colors);
    if (n % 15 === 0) { burst(cx, cy, symbols, colors); burst(cx, cy, symbols, colors); } // big celebration
    btn.animate([
      { transform: 'translateY(0) scale(1, 1)' },
      { transform: 'translateY(-18px) scale(.95, 1.05)', offset: 0.35 },
      { transform: 'translateY(0) scale(1.12, .88)',     offset: 0.6 },
      { transform: 'translateY(0) scale(1, 1)' }
    ], { duration: 500, easing: 'cubic-bezier(.3,.6,.4,1)' });
  });
});

// 11. Achievements: click a photo frame to flip to its next picture (6 slots = 3 frames x 2 photos)
document.querySelectorAll('.frame').forEach(frame => {
  const slides = frame.querySelectorAll('.slide');
  const box = frame.querySelector('.frame-img');
  if (slides.length < 2 || !box) return;
  const counter = frame.querySelector('.frame-badge b');
  let i = 0, busy = false;
  const swap = () => {
    slides[i].classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-active');
    if (counter) counter.textContent = i + 1;
  };
  const flip = () => {
    if (busy) return;
    if (reduceMotion) return swap();
    busy = true;
    const out = box.animate([{ transform: 'perspective(700px) rotateY(0)' }, { transform: 'perspective(700px) rotateY(90deg)' }],
      { duration: 180, easing: 'ease-in', fill: 'forwards' });
    out.onfinish = () => {
      swap();
      box.animate([{ transform: 'perspective(700px) rotateY(-90deg)' }, { transform: 'perspective(700px) rotateY(0)' }],
        { duration: 220, easing: 'ease-out' }).onfinish = () => { busy = false; };
      out.cancel();
    };
  };
  frame.addEventListener('click', flip);
  frame.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
  });
});


// 12. About page: terminal tabs (Personal Info / about.md)
document.querySelectorAll('.term-tabs').forEach(tabs => {
  const term = tabs.closest('.terminal');
  const btns = [...tabs.querySelectorAll('.term-tab')];
  const show = btn => {
    btns.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
      const p = term.querySelector('#panel-' + b.dataset.tab);
      p.classList.toggle('is-active', on);
      p.toggleAttribute('inert', !on);
      p.setAttribute('aria-hidden', !on);
    });
  };
  btns.forEach(b => b.addEventListener('click', () => show(b)));
  tabs.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    const next = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
    show(next); next.focus();
  });
});


// 13. Moving constellation background on every page (mint dots + lines that drift and link to the cursor)
(() => {
  const cvs = document.createElement('canvas');
  cvs.className = 'bg-net';
  cvs.setAttribute('aria-hidden', 'true');
  document.body.prepend(cvs);
  const ctx = cvs.getContext('2d');
  const COLOR = '124,240,224';   // mint (R,G,B) - change this to recolor the dots and lines
  const LINK = 150;              // how close two dots must be to connect
  const MOUSE_LINK = 180;        // how close the cursor must be to connect
  let w = 0, h = 0, nodes = [];
  const mouse = { x: -9999, y: -9999 };

  const make = () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,   // speed
    r: 1.3 + Math.random() * 1.8
  });

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${COLOR},${(1 - d / LINK) * 0.35})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < MOUSE_LINK) {
        ctx.strokeStyle = `rgba(${COLOR},${(1 - md / MOUSE_LINK) * 0.55})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    ctx.shadowColor = `rgba(${COLOR},.9)`;
    ctx.shadowBlur = 8;
    ctx.fillStyle = `rgba(${COLOR},.9)`;
    nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); });
    ctx.shadowBlur = 0;
  };

  const step = () => {
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    draw();
    requestAnimationFrame(step);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    cvs.width = w * dpr; cvs.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.min(90, Math.round((w * h) / 16000));   // number of dots
    while (nodes.length < target) nodes.push(make());
    nodes.length = target;
    nodes.forEach(n => { n.x = Math.min(n.x, w); n.y = Math.min(n.y, h); });
    if (reduceMotion) draw();
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  resize();
  if (!reduceMotion) requestAnimationFrame(step);   // visitors who prefer reduced motion get a still picture
})();