(() => {
  const menu = document.querySelector('.home .mobile-menu');
  const toggle = document.querySelector('.home .menu-toggle');
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  const steps=[...document.querySelectorAll('.home .step')];
  const progress=document.querySelector('#finder-progress');
  document.querySelectorAll('.home .choice').forEach(btn => btn.addEventListener('click', () => {
    const n=Number(btn.dataset.next);
    steps.forEach(s=>s.classList.toggle('hidden',Number(s.dataset.step)!==n));
    if(progress) progress.style.width=`${Math.min(n*33.33,100)}%`;
  }));
  document.querySelector('#home-find')?.addEventListener('click',()=>{
    const value=document.querySelector('#home-postcode')?.value.trim();
    const msg=document.querySelector('#home-finder-message');
    if(!msg)return;
    msg.style.display='block';
    msg.textContent=value ? `Thanks — we'll use ${value} to help find your local Heritage Healthcare team.` : 'Enter a postcode or town and we’ll help you find your local team.';
  });

  const search=document.querySelector('#home-location-search');
  const cards=[...document.querySelectorAll('#home-location-items .location-item')];
  search?.addEventListener('input',()=>{
    const q=search.value.toLowerCase().trim();
    cards.forEach(card=>card.style.display=card.textContent.toLowerCase().includes(q)?'flex':'none');
  });
})();
