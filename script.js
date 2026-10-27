(() => {
  const menuButton = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }));
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactMotion = matchMedia('(max-width: 760px)').matches;
  const items = [...document.querySelectorAll('.reveal')];
  items.forEach((item, index) => {
    item.classList.add('motion-ready');
    if (item.dataset.delay) item.style.setProperty('--motion-delay', `${Number(item.dataset.delay) * 110}ms`);
    if (item.matches('.hero-copy,.story-copy,.experience-copy,.booking-intro,.location-copy')) item.classList.add('motion-left');
    if (item.matches('.hero-visual,.story-photo,.facade')) item.classList.add('motion-right');
    if (item.matches('.story-mark,.rating,.booking-form')) item.classList.add('motion-scale');
    if (item.matches('.service')) {
      const cardIndex = [...item.parentElement.children].indexOf(item);
      item.style.setProperty('--motion-delay', `${Math.min((cardIndex % 2) * 90, 180)}ms`);
    } else if (!item.dataset.delay) {
      item.style.setProperty('--motion-delay', `${Math.min((index % 3) * 35, 70)}ms`);
    }
  });

  let revealVisibleNow = () => {};
  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: .12, rootMargin: '0px 0px -38px' });
    items.forEach(item => observer.observe(item));
    revealVisibleNow = () => items.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < innerHeight * 1.08 && rect.bottom > -24) item.classList.add('visible');
    });
    addEventListener('hashchange', () => requestAnimationFrame(revealVisibleNow));
    addEventListener('load', () => {
      requestAnimationFrame(revealVisibleNow);
      setTimeout(revealVisibleNow, 180);
    }, { once: true });
  } else {
    items.forEach(item => item.classList.add('visible'));
  }

  const progress = document.createElement('span');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const topbar = document.querySelector('.topbar');
  const parallaxItems = reduced || compactMotion ? [] : [
    [document.querySelector('.hero-orbit'), .055, 38],
    [document.querySelector('.photo-frame img'), .028, 18],
    [document.querySelector('.story-photo img'), .024, 16],
    [document.querySelector('.experience-image img'), .022, 15],
    [document.querySelector('.facade img'), .02, 14],
    [document.querySelector('.closing>img'), .018, 12]
  ].filter(([element]) => element);
  parallaxItems.forEach(([element]) => element.classList.add('motion-parallax'));

  let ticking = false;
  const updateScrollMotion = () => {
    revealVisibleNow();
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, scrollY / maxScroll)})`;
    topbar?.classList.toggle('is-scrolled', scrollY > 22);
    parallaxItems.forEach(([element, speed, limit]) => {
      const parent = element.closest('section,figure,.hero-visual') || element;
      const rect = parent.getBoundingClientRect();
      const centerOffset = innerHeight * .5 - (rect.top + rect.height * .5);
      const value = Math.max(-limit, Math.min(limit, centerOffset * speed));
      element.style.setProperty('--parallax-y', `${value.toFixed(2)}px`);
    });
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(updateScrollMotion);
    ticking = true;
  }, { passive: true });
  addEventListener('resize', updateScrollMotion, { passive: true });
  addEventListener('load', () => requestAnimationFrame(updateScrollMotion), { once: true });
  updateScrollMotion();

  const form = document.querySelector('#booking-form');
  const submit = document.querySelector('#booking-submit');
  function updateBooking() {
    if (!form || !submit) return;
    const service = form.querySelector('[name="service"]:checked')?.value || 'um atendimento';
    const period = form.querySelector('[name="period"]:checked')?.value || 'a combinar';
    const name = form.querySelector('[name="name"]')?.value.trim() || '[seu nome]';
    const number = form.querySelector('[name="contact"]')?.value || '5585987194209';
    const message = `Olá! Meu nome é ${name}. Vim pelo site da Unidade 3 e gostaria de agendar ${service}. Minha preferência é no período da ${period}. Quais horários estão disponíveis?`;
    submit.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
  if (form) {
    form.addEventListener('input', updateBooking);
    form.addEventListener('change', updateBooking);
    updateBooking();
  }
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    const input = form?.querySelector(`[name="service"][value="${link.dataset.service}"]`);
    if (input) {
      input.checked = true;
      updateBooking();
    }
  }));

  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) document.querySelectorAll('details[open]').forEach(other => {
      if (other !== detail) other.open = false;
    });
  }));
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
