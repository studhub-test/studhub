// Уведомления (колокольчик в шапке). Хранятся в localStorage, фильтруются по настройкам.
const NOTIF_SEED = [
  { id: 'n1', type: 'replies', color: '#e8f5f2', fg: '#2d8a7a', letter: 'П', text: '<strong>П. Глушнев</strong> ответил на ваш комментарий', ts: Date.now() - 15 * 60000, read: false },
  { id: 'n2', type: 'invites', color: '#f0e8f8', fg: '#8b6ab5', letter: 'Л', text: '<strong>Л. Галлахер</strong> пригласил вас в команду', ts: Date.now() - 2 * 3600000, read: false },
  { id: 'n3', type: 'community', color: '#e8f0f8', fg: '#4a8ab5', letter: 'К', text: 'Новое обсуждение в <strong>КИТиС</strong>', ts: Date.now() - 5 * 3600000, read: true },
];
function getNotifs() {
  let list = lsGet('studhub_notifs', null);
  if (!list) { list = NOTIF_SEED; lsSet('studhub_notifs', list); }
  return list;
}
function pushNotif(type, html, letter) {
  if (getSettings().notif[type] === false) return;
  const list = getNotifs();
  list.unshift({ id: 'n' + Date.now(), type, color: '#e8f5f2', fg: '#2d8a7a', letter: letter || '₽', text: html, ts: Date.now(), read: false });
  lsSet('studhub_notifs', list.slice(0, 30));
  renderNotifs();
}
function renderNotifs() {
  const s = getSettings();
  const visible = getNotifs().filter(n => s.notif[n.type] !== false);
  const unread = visible.filter(n => !n.read).length;
  const box = document.getElementById('notifList');
  if (box) box.innerHTML = visible.length ? visible.map(n => `<div class="notif-item ${n.read ? '' : 'unread'}"><div class="notif-avatar" style="background:${n.color};color:${n.fg};">${n.letter}</div><div class="notif-content"><div class="notif-text">${n.text}</div><div class="notif-time">${ago(n.ts)}</div></div>${n.read ? '' : '<div class="notif-dot"></div>'}</div>`).join('') : '<div class="search-empty">—</div>';
  const badge = document.getElementById('notifBadge');
  if (badge) { badge.textContent = unread; badge.style.display = (s.notif.badge !== false && unread > 0) ? 'flex' : 'none'; }
}
function markNotifsRead() {
  lsSet('studhub_notifs', getNotifs().map(n => ({ ...n, read: true })));
  const badge = document.getElementById('notifBadge'); if (badge) badge.style.display = 'none';
}
