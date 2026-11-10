let toastTimer = null;

export function toast(message) {
  const element = document.querySelector('#toast');
  if (!element) return;
  element.textContent = String(message);
  element.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => element.classList.remove('show'), 2400);
}

export function startClock() {
  const update = () => {
    const now = new Date();
    const clock = document.querySelector('#clock');
    const date = document.querySelector('#dateText');
    const sunDate = document.querySelector('#sunDate');
    if (clock) clock.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (date) date.textContent = now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase();
    if (sunDate) sunDate.textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  update();
  return window.setInterval(update, 30000);
}
