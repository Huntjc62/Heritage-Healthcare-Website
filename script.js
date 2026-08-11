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
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
