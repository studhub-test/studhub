// Ресурсы (загрузка файлов)
const demoAssets = [
 {name:'конспект 07.10.2026.txt',meta:'Конспекты по алгоритмизации · 7 октября 2026',size:'2,4 МБ',type:'doc'},
 {name:'фото_общаги_2026.jpg',meta:'Жизнь в общаге · 5 октября 2026',size:'4,1 МБ',type:'img'},
 {name:'studhub-prototype.zip',meta:'Проект StudHub · 4 октября 2026',size:'12,8 МБ',type:'code'},
 {name:'правила_колледжа.pdf',meta:'Документы КИТиС · 1 октября 2026',size:'856 КБ',type:'pdf'},
 {name:'ЭТО_ТОЧНО_ЛАСТОВАЯ_КУРСОВАЯ.docx',meta:'Курсовая работа · 28 сентября 2026',size:'1,2 МБ',type:'doc'}
];
function getUploadedAssets(){try{return JSON.parse(userStore.getItem('studhub_uploaded_assets')||'[]')}catch(e){return []}}
function renderAssets(){
 const list=document.getElementById('assetsList');if(!list)return;
 const uploaded=getUploadedAssets();
 const all=[...demoAssets.map((x,i)=>({...x,demo:true,id:'demo-'+i})),...uploaded];
 list.innerHTML=all.map((f)=>`<div class="asset-item"><div class="asset-icon ${f.type||'doc'}"><span style="font-size:12px;font-weight:800">${(f.name.split('.').pop()||'FILE').slice(0,4).toUpperCase()}</span></div><div class="asset-info"><div class="asset-name">${escapeHtml(f.name)}</div><div class="asset-meta">${escapeHtml(f.meta||'Добавлен в мои файлы')}</div></div><div class="asset-size">${f.size||''}</div>${f.data?`<button class="asset-remove" onclick="downloadAsset('${f.id}')">Скачать</button>`:''}${!f.demo?`<button class="asset-remove" onclick="removeAsset('${f.id}')">Удалить</button>`:''}</div>`).join('');
}
function escapeHtml(value){return String(value||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
async function handleAssetFiles(fileList){
 const files=Array.from(fileList||[]);if(!files.length)return;
 const existing=getUploadedAssets();let added=0;
 for(const file of files){
  if(file.size>1.5*1024*1024){showToast('Файл '+file.name+' больше 1,5 МБ — пропущен','error');continue;}
  try{
   const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
   existing.push({id:'asset-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:file.name,size:file.size<1024*1024?(file.size/1024).toFixed(0)+' КБ':(file.size/1024/1024).toFixed(1)+' МБ',meta:'Загружен '+new Date().toLocaleDateString('ru-RU'),type:/\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)?'img':/\.(zip|js|py|html|css|json)$/i.test(file.name)?'code':/\.pdf$/i.test(file.name)?'pdf':'doc',data});
   added++;
  }catch(e){showToast('Не удалось прочитать '+file.name,'error');}
 }
 try{userStore.setItem('studhub_uploaded_assets',JSON.stringify(existing));renderAssets();showToast('Добавлено файлов: '+added,'success');}
 catch(e){showToast('Не удалось сохранить файлы: выберите файлы меньшего размера','error');}
 document.getElementById('assetFileInput').value='';
}
function downloadAsset(id){const f=getUploadedAssets().find(x=>x.id===id);if(!f||!f.data)return;const a=document.createElement('a');a.href=f.data;a.download=f.name;document.body.appendChild(a);a.click();a.remove();}
function removeAsset(id){userStore.setItem('studhub_uploaded_assets',JSON.stringify(getUploadedAssets().filter(x=>x.id!==id)));renderAssets();showToast('Файл удалён','success');}
