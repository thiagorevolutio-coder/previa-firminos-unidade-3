(() => {
  const menuButton=document.querySelector('.nav-toggle'), menu=document.querySelector('.nav');
  if(menuButton&&menu){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menu.classList.toggle('is-open',!open)});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');menu.classList.remove('is-open')}))}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches, items=document.querySelectorAll('.reveal');
  if(!reduced&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -30px'});items.forEach(item=>observer.observe(item))}else items.forEach(item=>item.classList.add('visible'));
  const form=document.querySelector('#booking-form'), submit=document.querySelector('#booking-submit');
  function update(){if(!form||!submit)return;const service=form.querySelector('[name="service"]:checked')?.value||'um atendimento';const period=form.querySelector('[name="period"]:checked')?.value||'a combinar';const name=form.querySelector('[name="name"]')?.value.trim()||'[seu nome]';const number=form.querySelector('[name="contact"]')?.value||'5585987194209';const message=`Olá! Meu nome é ${name}. Vim pelo site da Unidade 3 e gostaria de agendar ${service}. Minha preferência é no período da ${period}. Quais horários estão disponíveis?`;submit.href=`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
  if(form){form.addEventListener('input',update);form.addEventListener('change',update);update()}
  document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{const input=form?.querySelector(`[name="service"][value="${link.dataset.service}"]`);if(input){input.checked=true;update()}}));
  document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('details[open]').forEach(other=>{if(other!==detail)other.open=false})}));
  const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
})();
