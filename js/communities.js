// Сообщества
// All Communities
const allCommunitiesData = [
{ id: 1, name: 'КИТиС', desc: 'Колледж информационных технологий и строительства. Место для своих.', about: 'Сообщество студентов и выпускников КИТиС в Калининграде. Обсуждаем учёбу, делимся полезными материалами, ищем команды для учебных и коммерческих проектов и помогаем друг другу развиваться.', location: 'Калининград · учебное сообщество', cover: 'linear-gradient(125deg,rgba(19,74,66,.15),rgba(19,74,66,.02)),repeating-linear-gradient(90deg,#d5e7df 0 12%,#bdd4ca 12% 13%,#eaf2ed 13% 25%)', members: 1284, online: 86, color: 'c1', icon: 'i1', letter: 'К', joined: true },
{ id: 2, name: 'Жизнь в общаге', desc: 'Истории, лайфхаки и мемы про студенческую жизнь в общежитии.', about: 'Неофициальное пространство про жизнь в общежитии: бытовые лайфхаки, соседи, рецепты на маленькой кухне, смешные истории и советы тем, кто только заселяется. Без токсичности — делимся опытом и выручаем друг друга.', location: 'Студенческая жизнь · общение', cover: 'radial-gradient(circle at 80% 20%,#fff5d7 0 8%,transparent 9%),linear-gradient(135deg,#c8a4e8,#f2d8ef 55%,#f7e8cf)', members: 342, online: 24, color: 'c2', icon: 'i2', letter: 'О', joined: true },
{ id: 3, name: 'Кодим вместе', desc: 'Парное программирование, код-ревью и совместные проекты.', about: 'Клуб для тех, кто учится программировать и хочет расти на практике. Разбираем ошибки, делаем код-ревью, ищем напарников, проводим мини-хакатоны и доводим учебные идеи до работающих проектов.', location: 'Разработка · совместные проекты', cover: 'linear-gradient(135deg,#102d48,#246b83 48%,#7bd5c7)', members: 186, online: 12, color: 'c3', icon: 'i3', letter: '#', joined: true },
{ id: 4, name: 'Дизайн-среда', desc: 'UI/UX, графический дизайн, типографика и вдохновение.', about: 'Место для дизайнеров и тех, кто хочет ими стать. Публикуем работы, обсуждаем интерфейсы, типографику и композицию, делимся референсами и ищем обратную связь для портфолио.', location: 'Дизайн · творчество', cover: 'radial-gradient(circle at 25% 35%,#fff 0 9%,transparent 10%),radial-gradient(circle at 75% 70%,#f7b267 0 14%,transparent 15%),linear-gradient(120deg,#f5d0a9,#c8b6ff)', members: 642, online: 38, color: 'c4', icon: 'i4', letter: 'Д', joined: false },
{ id: 5, name: 'Стажировки и карьера', desc: 'Вакансии, стажировки, советы по трудоустройству и карьерному росту.', about: 'Подборка возможностей для студентов: стажировки, первые вакансии, конкурсы, гранты и карьерные мероприятия. Участники делятся опытом собеседований, помогают с резюме и рассказывают, как получить первый опыт.', location: 'Карьера · возможности', cover: 'linear-gradient(110deg,#4a243f,#9b466d 45%,#f0b67f)', members: 1800, online: 94, color: 'c5', icon: 'i5', letter: 'С', joined: false },
{ id: 6, name: 'БФУ им. Канта', desc: 'Сообщество студентов Балтийского федерального университета.', about: 'Сообщество студентов, абитуриентов и выпускников БФУ им. И. Канта. Обсуждаем университетские новости, учебные направления, мероприятия, исследовательские инициативы и студенческие проекты.', location: 'Калининград · университет', cover: 'linear-gradient(135deg,#164e63,#0f766e 48%,#a7d7c5)', members: 2400, online: 156, color: 'c6', icon: 'i6', letter: 'Б', joined: false }
];
let communityFilter = 'all';
function setCommunityFilter(filter, btn) {
 communityFilter = filter;
 document.querySelectorAll('#communityFilters .tab-btn').forEach(b=>b.classList.remove('active'));
 btn.classList.add('active'); renderAllCommunities();
}
function renderAllCommunities() {
 const grid=document.getElementById('allCommunitiesGrid'); if(!grid) return;
 const q=(document.getElementById('communitySearch')?.value||'').trim().toLowerCase();
 let data=allCommunitiesData.filter(c=>!q || (c.name+' '+c.desc).toLowerCase().includes(q));
 if(communityFilter==='mine') data=data.filter(c=>c.joined);
 if(communityFilter==='popular') data=data.slice().sort((a,b)=>b.members-a.members);
 if(communityFilter==='new') data=data.slice().sort((a,b)=>b.id-a.id);
 grid.innerHTML=data.map(c=>`<div class="community-card" onclick="openCommunity(${c.id})"><div class="community-card-cover ${c.color}"><div class="community-card-icon ${c.icon}">${c.letter}</div></div><div class="community-card-name">${c.name}</div><div class="community-card-desc">${c.desc}</div><div class="community-card-meta"><div class="community-card-members">${c.members.toLocaleString()} участников</div><button class="community-card-btn ${c.joined?'joined':'join'}" onclick="event.stopPropagation();toggleCommunityJoin(${c.id},this)">${c.joined?'Вы участник':'Вступить'}</button></div></div>`).join('') || '<div class="empty-state"><div class="empty-state-title">Сообщества не найдены</div><div class="empty-state-desc">Измени поисковый запрос или фильтр.</div></div>';
}
function openCommunity(id) {
 const c=allCommunitiesData.find(x=>x.id===id); if(!c)return;
 switchView('community');
 const name=document.querySelector('#view-community .community-name');
 const fullname=document.querySelector('#view-community .community-fullname');
 const location=document.querySelector('#view-community .community-location');
 const coverText=document.querySelector('#view-community .cover-building-text');
 const coverLogo=document.querySelector('#view-community .cover-logo');
 if(name)name.textContent=c.name; if(fullname)fullname.textContent=c.desc; if(location)location.textContent='Сообщество StudHub';
 if(coverText)coverText.innerHTML=c.name+'<span>'+c.location+'</span>'; if(coverLogo)coverLogo.textContent=c.letter;
const coverInner=document.querySelector('#view-community .community-cover-inner');
 if(coverInner){
   coverInner.style.background=c.cover; coverInner.dataset.communityCover='true';
   const sky=coverInner.querySelector('.cover-sky'), building=coverInner.querySelector('.cover-building');
   if(sky)sky.style.background='transparent';
   if(building)building.style.background='rgba(255,255,255,.10)';
 }
const aboutCard=document.querySelector('#view-community .community-info + div'); if(aboutCard){aboutCard.querySelector('h2').textContent='О сообществе'; aboutCard.querySelectorAll('p')[0].textContent=c.about || c.desc; aboutCard.querySelectorAll('p')[1].textContent='Участники сообщества публикуют новости, задают вопросы, делятся опытом и находят единомышленников.';}
 const stats=document.querySelectorAll('#view-community .community-stat-num'); if(stats[0])stats[0].textContent=c.members.toLocaleString(); if(stats[1])stats[1].textContent=c.online;
 const join=document.querySelector('#view-community .btn-joined'); if(join){join.textContent=c.joined?'Вы участник':'Вступить';join.onclick=()=>{c.joined=!c.joined;openCommunity(id);showToast(c.joined?'Вы вступили в сообщество':'Вы покинули сообщество','success')};}
 const posts=document.getElementById('communityDetailPosts');
 const relevant=homePostsData.filter(p=>p.community===c.name);
 posts.innerHTML=`<div class="section-header"><h2 class="section-title">Публикации сообщества</h2><span style="color:var(--muted);font-size:13px">${relevant.length} публикаций</span></div>`+(relevant.length?relevant.map(p=>`<article class="post-card"><div class="post-header"><div class="post-author"><div class="post-avatar ${p.avatarClass}">${p.avatarLetter}</div><div class="post-meta"><span class="post-community">${p.community}</span><span class="post-info">${p.author} · ${p.time}</span></div></div></div><h3 class="post-title">${p.title}</h3>${p.text?`<p class="post-text">${p.text}</p>`:''}<div class="post-footer">${voteBox('home-'+p.id,p.votes)}${commentBtn('home-'+p.id,p.comments)}</div>${commentsBox('home-'+p.id)}</article>`).join(''):`<div class="empty-state"><div class="empty-state-title">Пока нет публикаций</div><div class="empty-state-desc">Здесь будут появляться посты участников сообщества.</div></div>`);
}
function toggleCommunityJoin(id, btn) { const c=allCommunitiesData.find(x=>x.id===id); if(!c)return; c.joined=!c.joined; renderAllCommunities(); showToast(c.joined?'Вы вступили в сообщество «'+c.name+'»':'Вы покинули сообщество','success'); }
