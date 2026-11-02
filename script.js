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

// 4. Profile photo: hide the image if the file isn't found so the placeholder shows
const photo = document.querySelector('.hero-photo img');
if (photo) {
  photo.addEventListener('error', () => photo.classList.add('hidden'));
  if (photo.complete && photo.naturalWidth === 0) photo.classList.add('hidden');
}

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

// 6. Show the Family section only when "View My Family" is clicked
const familyBtn = document.getElementById('view-family');
const familySection = document.getElementById('Family');
if (familyBtn && familySection) {
  familyBtn.addEventListener('click', e => {
    e.preventDefault();
    familySection.classList.remove('is-hidden');
    familySection.scrollIntoView({ behavior: 'smooth' });
  });
}

// 7. Typing effect for the Skills description
const skillsTyping = document.getElementById('skills-typing');
if (skillsTyping && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const fullText = skillsTyping.textContent.trim();
  skillsTyping.setAttribute('aria-label', fullText);
  skillsTyping.textContent = '';
  skillsTyping.classList.add('typing');
  let i = 0;
  const typeNext = () => {
    skillsTyping.textContent = fullText.slice(0, ++i);
    if (i < fullText.length) setTimeout(typeNext, 45); // 45 = speed in milliseconds
    
  };
  typeNext();
}