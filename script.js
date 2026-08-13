const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

const steps = [...document.querySelectorAll('.finder-step')];
const progress = document.querySelector('.progress span');

document.querySelectorAll('.choice').forEach(choice => {
  choice.addEventListener('click', () => {
    const next = Number(choice.dataset.next);
    steps.forEach(s => s.classList.toggle('hidden', Number(s.dataset.step) !== next));
    if (progress) progress.style.width = `${next * 33.33}%`;
  });
});

document.querySelector('#find-location')?.addEventListener('click', () => {
  const value = document.querySelector('#postcode').value.trim();
  const result = document.querySelector('#finder-result');
  if (!value) {
    result.textContent = 'Enter a postcode or town and we’ll help you find the nearest Heritage team.';
  } else {
    result.textContent = `Thanks — we’ll use “${value}” to find your nearest Heritage Healthcare team.`;
  }
  result.style.display = 'block';
});

const search = document.querySelector('#location-search');
const items = [...document.querySelectorAll('.location-item')];

search?.addEventListener('input', () => {
  const query = search.value.toLowerCase();
  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
// Full .html page links, including location pages, are intentionally not
// handled by the smooth-scroll code.


// IMPORTANT: links ending in .html are normal page navigation.
// They are intentionally NOT intercepted by JavaScript.
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', () => {
    // Allow the browser to load the requested page normally.
  });
});

document.querySelector('#finder-progress') && (() => {
  const p = document.querySelector('#finder-progress');
  const allSteps = [...document.querySelectorAll('.finder-step')];
  p.style.width = '33.33%';
  document.querySelectorAll('.choice').forEach(c => c.addEventListener('click', () => {
    const n = Number(c.dataset.next);
    p.style.width = `${n * 33.33}%`;
  }));
})();

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  document.querySelector('#form-message').style.display = 'block';
  contactForm.reset();
});

const jobSearch = document.querySelector('#job-search');
const jobType = document.querySelector('#job-type');
document.querySelector('#search-jobs')?.addEventListener('click', () => {
  const q = (jobSearch?.value || '').toLowerCase();
  const type = jobType?.value || '';
  document.querySelectorAll('.job').forEach(job => {
    const text = job.textContent.toLowerCase();
    const show = text.includes(q) && (!type || text.includes(type.toLowerCase()));
    job.style.display = show ? 'flex' : 'none';
  });
});

document.querySelectorAll('.faq button').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.faq').classList.toggle('open'));
});

document.body.classList.add('js-reveal-ready');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
