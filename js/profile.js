// Профиль пользователя и его редактирование
function updateProfile() {
const user = getCurrentUser();
const initials = getInitials(user.name);
document.getElementById('profileName').textContent = user.name;
const profileAvatar = document.getElementById('profileAvatarLarge');
const headerAvatar = document.getElementById('userAvatarHeader');
profileAvatar.textContent = user.avatar ? '' : initials;
headerAvatar.textContent = user.avatar ? '' : initials;
profileAvatar.style.backgroundImage = user.avatar ? `url("${user.avatar}")` : '';
headerAvatar.style.backgroundImage = user.avatar ? `url("${user.avatar}")` : '';
document.getElementById('userNameHeader').textContent = user.name;
document.querySelectorAll('.composer-avatar').forEach(el => el.textContent = initials);
if (document.getElementById('profileSubtitle')) document.getElementById('profileSubtitle').textContent = [user.subtitle || 'КИТиС · 1 курс', user.city || 'Калининград'].filter(Boolean).join(' · ');
const acc = getActiveAccount();
const isDemoProfile = !acc || user.username === 'dimidrol'; // демо-цифры (подписчики, отзывы) только у перенесённого демо-профиля
const emptyBio = 'Расскажите о себе: нажмите «Редактировать профиль».';
if (document.getElementById('profileAboutText')) document.getElementById('profileAboutText').textContent = user.bio || (isDemoProfile ? document.getElementById('profileAboutText').textContent : emptyBio);
if (!isDemoProfile) { // у нового аккаунта пока нет подписчиков и отзывов
  [['statFollowers', 0], ['statFollowing', 0], ['statReviews', 0]].forEach(([id, v]) => { const el = document.getElementById(id); if (el) el.textContent = v; });
}
const tagsBox = document.getElementById('profileInterests');
if (tagsBox && !isDemoProfile) tagsBox.innerHTML = (user.interests || '').split(',').map(x => x.trim()).filter(Boolean).map(x => '<span class="interest-tag">' + escapeHtml(x) + '</span>').join('');
const campusCity = document.querySelector('.campus-info-city'); if(campusCity) campusCity.textContent = user.city || 'Калининград';
if (document.getElementById('profileBio')) document.getElementById('profileBio').textContent = user.bio || (isDemoProfile ? 'Пишу код, собираю команду и превращаю идеи в проекты.' : emptyBio);
if (document.getElementById('profileJoined')) document.getElementById('profileJoined').textContent = '@' + (user.username || 'dimidrol') + ' · На StudHub с ' + (acc ? new Date(acc.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) : 'сентября 2026');
const projects = getProjects();
document.getElementById('profileProjectsCount').textContent = projects.length;
document.getElementById('profileTabProjectsCount').textContent = projects.length;
}

// Edit Profile Modal
function openEditProfileModal() {
const user = getCurrentUser();
document.getElementById('editProfileName').value = user.name || '';
document.getElementById('editProfileSubtitle').value = user.subtitle || '';
document.getElementById('editProfileBio').value = user.bio || '';
document.getElementById('editProfileUsername').value = user.username || '';
document.getElementById('editProfileCampus').value = user.campus || 'kitis';
document.getElementById('editProfileInterests').value = user.interests || '';
document.getElementById('editProfileCity').value = user.city || 'Калининград';
document.getElementById('editProfileAvatar').value = '';
document.getElementById('editProfileModal').classList.add('show');
}
function closeEditProfileModal() { document.getElementById('editProfileModal').classList.remove('show'); }
async function saveProfile() {
const user = getCurrentUser();
user.name = document.getElementById('editProfileName').value.trim() || user.name;
user.subtitle = document.getElementById('editProfileSubtitle').value.trim();
user.bio = document.getElementById('editProfileBio').value.trim();
const newUsername = document.getElementById('editProfileUsername').value.trim().replace(/^@/, '').toLowerCase();
if (!/^[a-z0-9_.]{3,20}$/.test(newUsername)) { showToast('Юзернейм: 3–20 символов, только латиница, цифры, точка и подчёркивание', 'error'); return; }
if (typeof BACKEND !== 'undefined' && BACKEND) {
  const usernameResult = await backendUpdateUsername(newUsername);
  if (usernameResult.error) { showToast(usernameResult.error === 'auth.err.usernameTaken' ? 'Этот юзернейм уже занят' : 'Не удалось сохранить юзернейм', 'error'); return; }
}
user.username = newUsername;
user.city = document.getElementById('editProfileCity').value.trim();
user.campus = document.getElementById('editProfileCampus').value;
user.interests = document.getElementById('editProfileInterests').value.trim();
const avatarFile = document.getElementById('editProfileAvatar').files[0];
if (avatarFile) {
  if (!avatarFile.type.startsWith('image/')) { showToast('Выберите файл изображения', 'error'); return; }
  if (avatarFile.size > 2 * 1024 * 1024) { showToast('Аватар должен быть не больше 2 МБ', 'error'); return; }
  user.avatar = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(avatarFile); });
}
saveCurrentUser(user);
closeEditProfileModal();
updateProfile();
renderAllCommunities();
showToast('Профиль обновлён!', 'success');
}
