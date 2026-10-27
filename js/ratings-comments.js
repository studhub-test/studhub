// Утилиты, оценки и комментарии
/* ===== Утилиты ===== */
function lsGet(k,d){try{const v=JSON.parse(userStore.getItem(k));return v==null?d:v}catch(e){return d}}
function lsSet(k,v){userStore.setItem(k,JSON.stringify(v))}
function ago(ts){const m=Math.floor((Date.now()-ts)/60000);if(m<1)return 'только что';if(m<60)return m+' мин назад';const h=Math.floor(m/60);if(h<24)return h+' ч назад';return Math.floor(h/24)+' дн назад'}
const fmtRub=n=>n.toLocaleString('ru-RU')+' ₽';
const scoreText=n=>n<0?'−'+Math.abs(n):String(n);
function openModal(id){document.getElementById(id).classList.add('show')}
function closeModal(id){document.getElementById(id).classList.remove('show')}

/* ===== Оценки (универсально: посты, обсуждения, проекты) ===== */
function voteBox(key,base,vert){
 const v=lsGet('studhub_votes',{})[key]||0,s=base+v;
 return `<div class="vote-control${vert?' vert':''}" data-key="${key}" data-base="${base}"><button class="vote-btn up${v===1?' active':''}" onclick="castVote('${key}',1)"><svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg></button><span class="vote-count ${s<0?'negative':'positive'}">${scoreText(s)}</span><button class="vote-btn down${v===-1?' active':''}" onclick="castVote('${key}',-1)"><svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></button></div>`;
}
function castVote(key,dir){
 const m=lsGet('studhub_votes',{});m[key]=m[key]===dir?0:dir;lsSet('studhub_votes',m);
 document.querySelectorAll(`.vote-control[data-key="${key}"]`).forEach(box=>{
  const s=+box.dataset.base+m[key];
  box.querySelector('.up').classList.toggle('active',m[key]===1);
  box.querySelector('.down').classList.toggle('active',m[key]===-1);
  const c=box.querySelector('.vote-count');c.textContent=scoreText(s);c.className='vote-count '+(s<0?'negative':'positive');
 });
}

/* ===== Комментарии ===== */
const getComments=key=>lsGet('studhub_comments',{})[key]||[];
function renderComments(key){
 const list=getComments(key);
 document.querySelectorAll(`.cc[data-key="${key}"]`).forEach(e=>e.textContent=list.length+(+e.dataset.base||0));
 document.querySelectorAll(`.comments-box[data-key="${key}"]`).forEach(box=>{
  box.innerHTML=(list.map(c=>`<div class="comment"><b>${escapeHtml(c.author)}</b><small>${ago(c.ts)}</small><div>${escapeHtml(c.text)}</div></div>`).join('')||'<div class="comment" style="color:var(--muted-2)">Пока нет комментариев — начните обсуждение.</div>')+`<div class="comment-form"><input class="pill-input" placeholder="Написать комментарий..." onkeydown="if(event.key==='Enter')addComment('${key}',this)"><button class="btn-submit" onclick="addComment('${key}',this.previousElementSibling)">Отправить</button></div>`;
 });
}
function addComment(key,input){
 const t=input.value.trim();if(!t)return;
 const all=lsGet('studhub_comments',{});(all[key]=all[key]||[]).push({author:getCurrentUser().name,text:t,ts:Date.now()});
 lsSet('studhub_comments',all);renderComments(key);showToast('Комментарий добавлен','success');
}
function toggleComments(key){const b=document.querySelector(`.comments-box[data-key="${key}"]`);if(!b)return;b.classList.toggle('open');renderComments(key)}
const commentBtn=(key,base)=>`<div class="post-stat" onclick="toggleComments('${key}')">💬 <span class="cc" data-key="${key}" data-base="${base}">${getComments(key).length+base}</span> комментариев</div>`;
const commentsBox=key=>`<div class="comments-box" data-key="${key}"></div>`;
function mountRating(el,key,base){
 if(!el)return;
 el.innerHTML=`<div style="display:flex;align-items:center;gap:12px;margin:14px 0 6px">${voteBox(key,base)}<span class="post-stat" style="cursor:default">💬 <span class="cc" data-key="${key}" data-base="0">0</span></span></div><div class="comments-box open" data-key="${key}"></div>`;
 renderComments(key);
}
