// Service worker StudHub: оболочка приложения работает офлайн.
// Стратегия: для страниц — сначала сеть, при отсутствии сети — кэш; для файлов (css/js/иконки) — кэш с обновлением в фоне.
// Меняйте VERSION при каждом выпуске, чтобы у пользователей обновился кэш.
const VERSION = 'studhub-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png',
  './css/theme.css', './css/style.css', './css/settings.css', './css/wallet.css', './css/auth.css', './css/project.css', './css/mobile.css',
  './js/theme-init.js', './js/storage.js', './js/i18n.js', './js/core.js', './js/home-feed.js', './js/projects.js', './js/profile.js', './js/communities.js',
  './js/ratings-comments.js', './js/discussions.js', './js/profile-posts.js', './js/fundraising.js', './js/notifications.js', './js/wallet.js',
  './js/settings.js', './js/assets.js', './js/auth.js', './js/search.js', './js/config.js', './js/backend.js', './js/mobile.js', './js/main.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;   // чужие домены (шрифты, CDN) не трогаем
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { caches.open(VERSION).then(c => c.put('./index.html', r.clone())); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r.ok) caches.open(VERSION).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
