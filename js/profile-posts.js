// Посты в профиле
/* ===== Посты в профиле ===== */
let profileTab='posts';
function switchProfileTab(btn,tab){document.querySelectorAll('.profile-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');profileTab=tab;renderProfileTab()}
const getUserPosts=()=>lsGet('studhub_userposts',[]);
function renderProfileTab(){
 const box=document.getElementById('profileTabContent');if(!box)return;
 const posts=getUserPosts(),user=getCurrentUser();
 ['profilePostsCount','profileTabPostsCount'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=posts.length});
 const empty=(t,d)=>`<div class="empty-state" style="margin-bottom:20px"><div class="empty-state-title">${t}</div><div class="empty-state-desc" style="margin-bottom:0">${d}</div></div>`;
 if(profileTab==='posts'){
  box.innerHTML=`<div class="composer"><div class="composer-avatar">${getInitials(user.name)}</div><div style="flex:1;font-size:14px;color:var(--muted)">О чём хотите рассказать?</div><button class="btn-submit" onclick="openPostModal()">Создать пост</button></div>`+(posts.map(p=>`<article class="post-card"><div class="post-header"><div class="post-author"><div class="post-avatar green">${getInitials(p.author)}</div><div class="post-meta"><span class="post-community">${escapeHtml(p.author)}</span><span class="post-info">${ago(p.ts)}</span></div></div><button class="btn-more" title="Удалить" onclick="deletePost('${p.id}')">🗑</button></div><div class="post-tag green">${escapeHtml(p.tag)}</div><h2 class="post-title">${escapeHtml(p.title)}</h2><p class="post-text" style="white-space:pre-wrap">${escapeHtml(p.text)}</p><div class="post-footer">${voteBox('post-'+p.id,0)}${commentBtn('post-'+p.id,0)}</div>${commentsBox('post-'+p.id)}</article>`).join('')||empty('Пока нет постов','Напишите первый пост — он появится здесь.'));
 }else if(profileTab==='projects'){
  const ps=getProjects();
  box.innerHTML=ps.length?`<div class="projects-grid" style="margin-bottom:20px">${ps.map(p=>renderProjectCard(p)).join('')}</div>`:empty('Проектов пока нет','Создайте проект кнопкой «Создать проект».');
 }else box.innerHTML=empty('Сохранённого пока нет','Раздел в разработке.');
}
function openPostModal(){['postTitle','postText'].forEach(i=>document.getElementById(i).value='');openModal('postModal')}
function submitPost(){
 const title=document.getElementById('postTitle').value.trim();
 if(!title){showToast('Введите заголовок','error');return}
 const posts=getUserPosts();
 posts.unshift({id:String(Date.now()),title,text:document.getElementById('postText').value.trim(),tag:document.getElementById('postTag').value,author:getCurrentUser().name,ts:Date.now()});
 lsSet('studhub_userposts',posts);closeModal('postModal');renderProfileTab();showToast('Пост опубликован','success');
}
function deletePost(id){if(!confirm('Удалить пост?'))return;lsSet('studhub_userposts',getUserPosts().filter(p=>p.id!==id));renderProfileTab()}
