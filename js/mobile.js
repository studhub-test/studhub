// Мобильная версия и PWA: выдвижное меню, нижняя панель, установка на домашний экран, service worker.
function openMobileMenu() { document.body.classList.add('menu-open'); }
function closeMobileMenu() { document.body.classList.remove('menu-open'); }
function toggleMobileMenu() { document.body.classList.toggle('menu-open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

// подсветка активного пункта нижней панели
function syncBottomNav() {
  document.querySelectorAll('#bottomNav a[data-v]').forEach(a => a.classList.toggle('active', a.dataset.v === currentView || (currentView === 'project' && a.dataset.v === 'home')));
}
(function () {
  const orig = switchView;
  switchView = function (v) { orig(v); syncBottomNav(); };
})();

// Установка на домашний экран (Chrome/Android/десктоп). На iOS: «Поделиться» → «На экран Домой».
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredInstall = e;
  const b = document.getElementById('installBtn'); if (b) b.style.display = '';
});
function installApp() {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  deferredInstall.userChoice.finally(() => { deferredInstall = null; const b = document.getElementById('installBtn'); if (b) b.style.display = 'none'; });
}
window.addEventListener('appinstalled', () => { const b = document.getElementById('installBtn'); if (b) b.style.display = 'none'; });

// Service worker работает только по https:// или http://localhost (на file:// не запустится — это нормально)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
syncBottomNav();
