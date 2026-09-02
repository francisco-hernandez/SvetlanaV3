const CONFIG = {
  whatsappNumber: '50600000000',
  whatsappMessage: 'Hola Svetlana, me gustaría conocer más sobre las sesiones de Solar Reiki.'
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('.parallax').forEach(el => {
    const speed = Number(el.dataset.speed || 0.1);
    const move = () => {
      const rect = el.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const offset = (rect.top + rect.height / 2 - center) * speed;
      el.style.transform = `translate3d(0, ${offset * -1}px, 0)`;
    };
    window.addEventListener('scroll', move, { passive: true });
    move();
  });

  const floating = document.getElementById('floatingCta');
  const contact = document.getElementById('contacto');
  const toggleFloating = () => {
    const passedHero = window.scrollY > window.innerHeight * 0.55;
    const inContact = contact.getBoundingClientRect().top < window.innerHeight && contact.getBoundingClientRect().bottom > 0;
    floating.classList.toggle('show', passedHero && !inContact);
  };
  window.addEventListener('scroll', toggleFloating, { passive: true });
  toggleFloating();
  floating.addEventListener('click', () => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' }));

  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
  document.querySelectorAll('.whatsapp-button').forEach(btn => btn.href = waUrl);

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      status.textContent = 'Revisa los campos marcados antes de enviar.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando…';

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No fue posible enviar el formulario.');
      status.textContent = 'Gracias. Hemos recibido tu mensaje y te contactaremos pronto.';
      status.style.color = '#dce9df';
      form.reset();
      form.classList.remove('was-validated');
    } catch (error) {
      status.textContent = error.message || 'No fue posible enviar el formulario. Escríbenos por WhatsApp.';
      status.style.color = '#f2d0c7';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar mensaje <span>↗</span>';
    }
  });
});
