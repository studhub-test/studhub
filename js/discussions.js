// Обсуждения
/* ===== Обсуждения ===== */
const DISC_CATS=['Вопросы','Идеи','Учёба','Общага','Ищу команду','Оффтоп'];
const seedDiscussions=[
 {id:'s1',title:'Как вы совмещаете учёбу и пет-проекты?',text:'Пары, домашка, ещё и свой проект. Делитесь, как планируете время и не выгораете.',cat:'Учёба',author:'А. Смирнов',ts:Date.now()-3*36e5,base:34,c0:12},
 {id:'s2',title:'Нужен дизайнер в проект «Карта тихих мест»',text:'Нужен человек на макеты в Figma. Можно без опыта — разберёмся вместе.',cat:'Ищу команду',author:'Л. Галлахер',ts:Date.now()-26*36e5,base:21,c0:7},
 {id:'s3',title:'Что делать, если в общаге шумят после 23:00?',text:'Соседи сверху устраивают вечеринки по будням. Как решали такое у вас?',cat:'Общага',author:'К. Дейко',ts:Date.now()-50*36e5,base:15,c0:19},
 {id:'s4',title:'Идея: общий банк конспектов по предметам',text:'Предлагаю собирать конспекты в одном месте по курсам и преподавателям.',cat:'Идеи',author:'П. Глушнев',ts:Date.now()-5*864e5,base:48,c0:15},
 {id:'s5',title:'Какой стек выбрать для первого pet-проекта?',text:'Знаю HTML/CSS и немного JS. React сразу или сначала чистый JS?',cat:'Вопросы',author:'Анна М.',ts:Date.now()-9*36e5,base:9,c0:5}
];
let discCat='Все',discSort='hot',discQ='',discMine=false;
const getDiscs=()=>[...lsGet('studhub_discussions',[]),...seedDiscussions];
function renderDiscFilters(){
 document.getElementById('discCats').innerHTML=['Все',...DISC_CATS].map((c,i)=>`<button class="tab-btn${i?'':' active'}" onclick="setDisc('cat','${c}',this)">${c}</button>`).join('');
 document.getElementById('discCat').innerHTML=DISC_CATS.map(c=>`<option>${c}</option>`).join('');
}
function setDisc(kind,val,btn){
 if(kind==='mine'){discMine=!discMine;btn.classList.toggle('active',discMine)}
 else{
  if(kind==='cat')discCat=val;else discSort=val;
  btn.parentElement.querySelectorAll('.tab-btn:not([data-mine])').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
 }
 renderDiscussions();
}
function renderDiscussions(){
 const box=document.getElementById('discList');if(!box)return;
 const votes=lsGet('studhub_votes',{});
 const sc=d=>d.base+(votes['disc-'+d.id]||0);
 const cm=d=>(d.c0||0)+getComments('disc-'+d.id).length;
 const hot=d=>(sc(d)+cm(d)+1)/Math.pow((Date.now()-d.ts)/36e5+2,1.2);
 const list=getDiscs().filter(d=>(discCat==='Все'||d.cat===discCat)&&(!discMine||d.mine)&&(!discQ||(d.title+' '+d.text).toLowerCase().includes(discQ)));
 list.sort(discSort==='new'?(a,b)=>b.ts-a.ts:discSort==='top'?(a,b)=>sc(b)-sc(a):discSort==='comments'?(a,b)=>cm(b)-cm(a):(a,b)=>hot(b)-hot(a));
 box.innerHTML=list.map(d=>`<article class="disc-card">${voteBox('disc-'+d.id,d.base,true)}<div class="disc-body"><div class="disc-meta"><span class="post-tag green" style="margin:0 6px 0 0;padding:2px 10px">${d.cat}</span>${escapeHtml(d.author)} · ${ago(d.ts)}</div><div class="disc-title" onclick="toggleComments('disc-${d.id}')">${escapeHtml(d.title)}</div><div class="disc-text">${escapeHtml(d.text)}</div><div class="post-footer" style="padding:0">${commentBtn('disc-'+d.id,d.c0||0)}${d.mine?`<div class="post-stat" onclick="deleteDiscussion('${d.id}')">🗑 Удалить</div>`:''}</div>${commentsBox('disc-'+d.id)}</div></article>`).join('')||'<div class="empty-state"><div class="empty-state-title">Ничего не найдено</div><div class="empty-state-desc">Измените фильтры или создайте своё обсуждение.</div></div>';
}
function openDiscModal(){['discTitle','discText'].forEach(i=>document.getElementById(i).value='');openModal('discModal')}
function submitDiscussion(){
 const title=document.getElementById('discTitle').value.trim();
 if(!title){showToast('Введите заголовок','error');return}
 const list=lsGet('studhub_discussions',[]);
 list.unshift({id:'u'+Date.now(),title,text:document.getElementById('discText').value.trim(),cat:document.getElementById('discCat').value,author:getCurrentUser().name,ts:Date.now(),base:0,c0:0,mine:true});
 lsSet('studhub_discussions',list);closeModal('discModal');renderDiscussions();showToast('Обсуждение создано','success');
}
function deleteDiscussion(id){
 if(!confirm('Удалить обсуждение?'))return;
 lsSet('studhub_discussions',lsGet('studhub_discussions',[]).filter(d=>d.id!==id));renderDiscussions();
}
