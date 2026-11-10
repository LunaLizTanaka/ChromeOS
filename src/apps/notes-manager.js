import { $, $$ } from '../core/dom.js';
import { storage, downloadBlob } from '../core/storage.js';
import { toast } from '../core/notifications.js';

const KEY = 'gl-notes-v2';
const LEGACY_KEY = 'gl-notes';
const COLORS = {
  pink:'#f5c5d9', mint:'#bdebe5', butter:'#fff0b9',
  lilac:'#c9c4e9', blue:'#c8dcf8', white:'#fffdfb'
};
let notes = [];
let selectedId = null;
let ready = false;
let saveTimer = null;
let notesWindow = null;
let stickyLayer = null;
let drag = null;
let zTop = 20;

const id = () => globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2,9);
const stamp = () => new Date().toISOString();
const clamp = (v,min,max) => Math.min(max,Math.max(min,v));

function position(raw) {
  raw = raw && typeof raw === 'object' ? raw : {};
  return {
    x: clamp(Number.isFinite(Number(raw.x)) ? Number(raw.x) : .08,0,1),
    y: clamp(Number.isFinite(Number(raw.y)) ? Number(raw.y) : .08,0,1),
    width: clamp(Number(raw.width)||250,190,440),
    height: clamp(Number(raw.height)||220,120,520),
    zIndex: Math.max(1,Number(raw.zIndex)||1),
    minimized: Boolean(raw.minimized)
  };
}
function normalize(raw) {
  raw = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return {
    id:String(raw.id||id()),
    title:String(raw.title||'Nota sem título').slice(0,120),
    body:String(raw.body||'').slice(0,50000),
    type:raw.type==='checklist'?'checklist':'text',
    color:COLORS[raw.color]?raw.color:'pink',
    createdAt:raw.createdAt||stamp(),
    updatedAt:raw.updatedAt||raw.createdAt||stamp(),
    favorite:Boolean(raw.favorite),
    archived:Boolean(raw.archived),
    pinnedToDesktop:Boolean(raw.pinnedToDesktop),
    desktopPosition:position(raw.desktopPosition)
  };
}
function makeNote(data={}) {
  const now=stamp();
  return normalize(Object.assign({
    id:id(),title:'Nova nota',body:'',type:'text',color:'pink',
    createdAt:now,updatedAt:now,favorite:false,archived:false,
    pinnedToDesktop:false,desktopPosition:{x:.08+(notes.length%4)*.04,y:.08+(notes.length%5)*.04}
  },data));
}
function persist(immediate=false,render=true) {
  const write=()=>{
    try {
      storage.setItem(KEY,JSON.stringify({version:2,notes}));
      if(render) renderPinned();
      saveStatus('Salvo');
    } catch(error) {
      console.error('Notes save failed',error);
      saveStatus('Falha ao salvar');
      toast('Não foi possível salvar. Exporte suas notas como backup.');
    }
  };
  clearTimeout(saveTimer);
  if(immediate) write();
  else { saveStatus('Salvando…'); saveTimer=setTimeout(write,260); }
}
function load() {
  const current=storage.getItem(KEY);
  if(current) {
    try {
      const parsed=JSON.parse(current);
      notes=Array.isArray(parsed)?parsed.map(normalize):Array.isArray(parsed.notes)?parsed.notes.map(normalize):[];
      return;
    } catch(error) { console.warn('Notes v2 invalid; keeping legacy data.',error); }
  }
  const legacy=storage.getItem(LEGACY_KEY);
  if(legacy!==null && String(legacy).length) {
    notes=[makeNote({title:'Minha primeira nota',body:String(legacy)})];
    // Keep gl-notes as a recovery copy; never delete it during migration.
    persist(true,false);
  }
}
const findNote = noteId => notes.find(note=>note.id===noteId)||null;
function saveStatus(value) {
  if(notesWindow && notesWindow.isConnected) {
    const node=$('#noteSaveStatus',notesWindow);
    if(node) node.textContent=value;
  }
}
function dateLabel(value) {
  const d=new Date(value);
  return Number.isNaN(d.getTime())?'':d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
}
function renderList(win) {
  const list=$('#notesList',win);
  const q=($('#notesSearch',win).value||'').trim().toLocaleLowerCase('pt-BR');
  const showArchived=$('#showArchivedNotes',win).checked;
  const visible=notes.filter(n=>showArchived||!n.archived)
    .filter(n=>!q||(n.title+' '+n.body).toLocaleLowerCase('pt-BR').includes(q))
    .sort((a,b)=>Number(b.favorite)-Number(a.favorite)||new Date(b.updatedAt)-new Date(a.updatedAt));
  list.replaceChildren();
  $('#notesCount',win).textContent=visible.length+' '+(visible.length===1?'nota':'notas');
  if(!visible.length) {
    const empty=document.createElement('div');
    empty.className='notes-list-empty';
    empty.textContent=q?'Nenhuma nota encontrada.':'Sua coleção está vazia. Crie sua primeira nota!';
    list.appendChild(empty);
    return;
  }
  visible.forEach(note=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='notes-list-item'+(note.id===selectedId?' selected':'');
    button.dataset.noteId=note.id;
    button.style.setProperty('--note-paper',COLORS[note.color]);
    const title=document.createElement('strong');
    title.className='notes-list-title';
    title.textContent=(note.favorite?'★ ':'')+(note.title||'Nota sem título');
    const snippet=document.createElement('span');
    snippet.className='notes-list-snippet';
    snippet.textContent=note.body.replace(/\s+/g,' ').slice(0,76)||(note.type==='checklist'?'Lista vazia':'Sem conteúdo ainda');
    const meta=document.createElement('small');
    meta.textContent=dateLabel(note.updatedAt)+(note.pinnedToDesktop?' · Fixada':'')+(note.archived?' · Arquivada':'');
    button.append(title,snippet,meta);
    button.addEventListener('click',()=>select(win,note.id));
    list.appendChild(button);
  });
}
function renderEditor(win) {
  const note=findNote(selectedId);
  const empty=$('#notesEditorEmpty',win);
  const editor=$('#notesEditor',win);
  if(!note) { empty.hidden=false; editor.hidden=true; return; }
  empty.hidden=true; editor.hidden=false;
  $('#noteTitle',win).value=note.title;
  $('#noteBody',win).value=note.body;
  $('#noteType',win).value=note.type;
  $('#noteColor',win).value=note.color;
  $('#noteFavorite',win).textContent=note.favorite?'★ FAVORITA':'☆ FAVORITAR';
  $('#pinNote',win).textContent=note.pinnedToDesktop?'DESAFIXAR DO DESKTOP':'FIXAR NO DESKTOP';
  $('#archiveNote',win).textContent=note.archived?'DESARQUIVAR':'ARQUIVAR';
  $('#noteBodyHelp',win).textContent=note.type==='checklist'
    ?'Escreva uma tarefa por linha. As caixas aparecem nos papéis fixados.'
    :'Sua anotação é salva automaticamente neste navegador.';
  saveStatus('Salvo');
}
function select(win,noteId) { selectedId=noteId; renderList(win); renderEditor(win); }
function renderAll(win) { if(!win||!win.isConnected)return; renderList(win); renderEditor(win); }
function addNote(win) {
  const note=makeNote();
  notes.unshift(note); selectedId=note.id;
  persist(true); renderAll(win);
  $('#noteTitle',win).focus(); $('#noteTitle',win).select();
}
function exportAll() {
  downloadBlob(JSON.stringify({application:'Galaxy Legacy Notes',version:2,exportedAt:stamp(),notes},null,2),
    'galaxy-legacy-notes-backup.json','application/json');
  toast('Backup das notas exportado ♡');
}
function importAll(win,event) {
  const file=event.target.files&&event.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try {
      if(file.size>2*1024*1024)throw new Error('Backup maior que 2 MB.');
      const parsed=JSON.parse(String(reader.result));
      const incoming=Array.isArray(parsed)?parsed:parsed.notes;
      if(!Array.isArray(incoming)||incoming.length>500||!incoming.every(n=>n&&typeof n==='object'&&!Array.isArray(n)))
        throw new Error('Formato do backup inválido.');
      if(!confirm('Importar '+incoming.length+' notas? A coleção atual será substituída. Exporte um backup antes se quiser preservá-la.'))return;
      notes=incoming.map(normalize); selectedId=notes[0]?notes[0].id:null;
      persist(true); renderAll(win); toast('Notas importadas ♡');
    } catch(error) { console.error(error); toast('Não foi possível importar esse JSON.'); }
    finally { event.target.value=''; }
  };
  reader.onerror=()=>toast('Não foi possível ler o backup.');
  reader.readAsText(file);
}
function bindEditor(win) {
  const title=$('#noteTitle',win),body=$('#noteBody',win),type=$('#noteType',win),color=$('#noteColor',win);
  const commit=()=>{
    const note=findNote(selectedId); if(!note)return;
    note.title=title.value.slice(0,120); note.body=body.value;
    note.type=type.value==='checklist'?'checklist':'text';
    note.color=COLORS[color.value]?color.value:'pink'; note.updatedAt=stamp();
    renderList(win); renderPinned(); persist(false,false);
    $('#noteBodyHelp',win).textContent=note.type==='checklist'
      ?'Escreva uma tarefa por linha. As caixas aparecem nos papéis fixados.'
      :'Sua anotação é salva automaticamente neste navegador.';
  };
  title.addEventListener('input',commit); body.addEventListener('input',commit);
  type.addEventListener('change',commit); color.addEventListener('change',commit);
  $('#newNote',win).addEventListener('click',()=>addNote(win));
  $('[data-create-first-note]',win).addEventListener('click',()=>addNote(win));
  $('#notesSearch',win).addEventListener('input',()=>renderList(win));
  $('#showArchivedNotes',win).addEventListener('change',()=>renderList(win));
  $('#exportNotes',win).addEventListener('click',exportAll);
  $('#importNotes',win).addEventListener('change',e=>importAll(win,e));
  $('#pinNote',win).addEventListener('click',()=>{
    const note=findNote(selectedId); if(!note)return;
    note.pinnedToDesktop=!note.pinnedToDesktop;
    if(note.pinnedToDesktop) note.desktopPosition=position({
      x:.06+(notes.filter(n=>n.pinnedToDesktop).length%4)*.035,
      y:.08+(notes.filter(n=>n.pinnedToDesktop).length%5)*.04,
      width:260,height:220,zIndex:++zTop,minimized:false
    });
    note.updatedAt=stamp(); persist(true); renderAll(win);
    toast(note.pinnedToDesktop?'Nota fixada na área de trabalho ♡':'Nota desafixada. O conteúdo continua salvo.');
  });
  $('#duplicateNote',win).addEventListener('click',()=>{
    const note=findNote(selectedId); if(!note)return;
    const copy=makeNote({title:note.title+' (cópia)',body:note.body,type:note.type,color:note.color});
    notes.unshift(copy); selectedId=copy.id; persist(true); renderAll(win);
  });
  $('#deleteNote',win).addEventListener('click',()=>{
    const note=findNote(selectedId); if(!note)return;
    if(!confirm('Excluir “'+note.title+'”?'))return;
    notes=notes.filter(n=>n.id!==note.id); selectedId=notes[0]?notes[0].id:null;
    persist(true); renderAll(win); toast('Nota excluída ♡');
  });
  $('#noteFavorite',win).addEventListener('click',()=>{
    const note=findNote(selectedId); if(!note)return;
    note.favorite=!note.favorite; note.updatedAt=stamp(); persist(true); renderAll(win);
  });
  $('#archiveNote',win).addEventListener('click',()=>{
    const note=findNote(selectedId); if(!note)return;
    note.archived=!note.archived; if(note.archived)note.pinnedToDesktop=false;
    note.updatedAt=stamp(); persist(true); renderAll(win);
  });
  win.addEventListener('gl:select-note',e=>{if(e.detail&&findNote(e.detail.id))select(win,e.detail.id);});
}
function checklist(note,content) {
  const lines=note.body.split('\n').filter(line=>line.trim());
  if(!lines.length){const empty=document.createElement('p');empty.className='sticky-empty';empty.textContent='Adicione tarefas no Notes…';content.appendChild(empty);return;}
  const list=document.createElement('div');list.className='sticky-checklist';
  lines.forEach((line,index)=>{
    const m=line.match(/^\s*(?:[-*]\s*)?\[([ xX])\]\s*(.*)$/);
    const checked=m?m[1].toLowerCase()==='x':false;
    const labelText=m?m[2]:line.replace(/^\s*[-*]\s*/,'');
    const label=document.createElement('label');label.className='sticky-task'+(checked?' checked':'');
    const box=document.createElement('input');box.type='checkbox';box.checked=checked;
    box.addEventListener('change',()=>{
      const updated=lines.slice();updated[index]='- ['+(box.checked?'x':' ')+'] '+labelText;
      updateNote(note.id,{body:updated.join('\n')},true);renderPinned();
    });
    const text=document.createElement('span');text.textContent=labelText;label.append(box,text);list.appendChild(label);
  });
  content.appendChild(list);
}
function makeCard(note) {
  const card=document.createElement('article');card.className='sticky-note'+(note.desktopPosition.minimized?' is-minimized':'');
  card.dataset.stickyId=note.id;card.style.setProperty('--sticky-color',COLORS[note.color]);
  card.style.left=(note.desktopPosition.x*100)+'%';card.style.top=(note.desktopPosition.y*100)+'%';
  card.style.width=note.desktopPosition.width+'px';
  card.style.height=(note.desktopPosition.minimized?42:note.desktopPosition.height)+'px';
  card.style.zIndex=String(note.desktopPosition.zIndex);
  const head=document.createElement('div');head.className='sticky-note-head';
  const title=document.createElement('strong');title.className='sticky-note-title';title.textContent=note.title||'Nota sem título';
  const actions=document.createElement('div');actions.className='sticky-note-actions';
  [['data-sticky-edit','✎','Editar no Notes'],['data-sticky-minimize',note.desktopPosition.minimized?'+':'−','Recolher papel'],['data-sticky-unpin','×','Desafixar do desktop']].forEach(([attr,label,titleText])=>{
    const btn=document.createElement('button');btn.type='button';btn.setAttribute(attr,note.id);btn.textContent=label;btn.title=titleText;btn.setAttribute('aria-label',titleText);actions.appendChild(btn);
  });
  head.append(title,actions);card.appendChild(head);
  if(!note.desktopPosition.minimized){
    const body=document.createElement('div');body.className='sticky-note-content';
    if(note.type==='checklist')checklist(note,body);
    else {const text=document.createElement('p');text.className='sticky-note-text';text.textContent=note.body||'Clique em editar para escrever…';body.appendChild(text);}
    card.appendChild(body);
    const resize=document.createElement('div');resize.className='sticky-note-resize';resize.setAttribute('data-sticky-resize',note.id);resize.setAttribute('aria-label','Redimensionar papel');card.appendChild(resize);
  }
  return card;
}
function renderPinned() {
  if(!stickyLayer||!stickyLayer.isConnected)return;
  stickyLayer.replaceChildren();
  notes.filter(n=>n.pinnedToDesktop&&!n.archived).sort((a,b)=>a.desktopPosition.zIndex-b.desktopPosition.zIndex)
    .forEach(note=>stickyLayer.appendChild(makeCard(note)));
}
function updateNote(noteId,changes,immediate=false) {
  const note=findNote(noteId);if(!note)return;
  Object.assign(note,changes,{updatedAt:stamp()});persist(immediate);
}
function beginDrag(event) {
  const resize=event.target.closest('[data-sticky-resize]');
  const head=event.target.closest('.sticky-note-head');
  if(!resize&&!head)return;
  if(event.button!==undefined&&event.button!==0)return;
  if(event.target.closest('button,input'))return;
  const noteId=resize?resize.getAttribute('data-sticky-resize'):head.closest('.sticky-note').dataset.stickyId;
  const note=findNote(noteId),card=stickyLayer.querySelector('[data-sticky-id=\"'+CSS.escape(noteId)+'\"]');
  if(!note||!card)return;
  event.preventDefault();
  const layer=stickyLayer.getBoundingClientRect(),rect=card.getBoundingClientRect();
  note.desktopPosition.zIndex=++zTop;card.style.zIndex=String(zTop);
  drag={id:noteId,pointerId:event.pointerId,mode:resize?'resize':'move',sx:event.clientX,sy:event.clientY,
    left:rect.left-layer.left,top:rect.top-layer.top,width:rect.width,height:rect.height,lw:layer.width,lh:layer.height};
  card.classList.add('is-dragging');
  try{stickyLayer.setPointerCapture(event.pointerId);}catch(error){}
}
function moveDrag(event) {
  if(!drag||(event.pointerId!==undefined&&event.pointerId!==drag.pointerId))return;
  const card=stickyLayer.querySelector('[data-sticky-id=\"'+CSS.escape(drag.id)+'\"]');if(!card)return;
  const dx=event.clientX-drag.sx,dy=event.clientY-drag.sy;
  if(drag.mode==='move'){
    card.style.left=clamp(drag.left+dx,0,Math.max(0,drag.lw-card.offsetWidth))+'px';
    card.style.top=clamp(drag.top+dy,0,Math.max(0,drag.lh-card.offsetHeight))+'px';
  }else{
    card.style.width=clamp(drag.width+dx,190,Math.min(440,drag.lw-drag.left))+'px';
    card.style.height=clamp(drag.height+dy,120,Math.min(520,drag.lh-drag.top))+'px';
  }
}
function finishDrag(event) {
  if(!drag)return;
  const d=drag;drag=null;
  const card=stickyLayer.querySelector('[data-sticky-id=\"'+CSS.escape(d.id)+'\"]'),note=findNote(d.id);if(!card||!note)return;
  card.classList.remove('is-dragging');
  const layer=stickyLayer.getBoundingClientRect(),rect=card.getBoundingClientRect();
  note.desktopPosition=position(Object.assign({},note.desktopPosition,{
    x:layer.width?(rect.left-layer.left)/layer.width:0,
    y:layer.height?(rect.top-layer.top)/layer.height:0,
    width:rect.width,height:note.desktopPosition.minimized?note.desktopPosition.height:rect.height,
    zIndex:Number(card.style.zIndex)||++zTop
  }));
  note.updatedAt=stamp();persist(true,false);
  try{if(stickyLayer.hasPointerCapture(d.pointerId))stickyLayer.releasePointerCapture(d.pointerId);}catch(error){}
}
function bindSticky() {
  if(!stickyLayer||stickyLayer.dataset.bound)return;
  stickyLayer.dataset.bound='true';
  stickyLayer.addEventListener('pointerdown',beginDrag,true);
  document.addEventListener('pointermove',moveDrag,{passive:false});
  document.addEventListener('pointerup',finishDrag);
  document.addEventListener('pointercancel',finishDrag);
  stickyLayer.addEventListener('click',event=>{
    const edit=event.target.closest('[data-sticky-edit]'),min=event.target.closest('[data-sticky-minimize]'),unpin=event.target.closest('[data-sticky-unpin]');
    if(edit){
      window.GalaxyLegacy.openApp('notes');
      setTimeout(()=>document.querySelector('[data-window=\"app-notes\"]')?.dispatchEvent(new CustomEvent('gl:select-note',{detail:{id:edit.getAttribute('data-sticky-edit')}})),0);
    }else if(min){
      const note=findNote(min.getAttribute('data-sticky-minimize'));if(!note)return;
      note.desktopPosition.minimized=!note.desktopPosition.minimized;persist(true);
    }else if(unpin){
      const note=findNote(unpin.getAttribute('data-sticky-unpin'));if(!note)return;
      note.pinnedToDesktop=false;note.updatedAt=stamp();persist(true);toast('Papel desafixado; nota preservada.');
    }
  });
  if('ResizeObserver'in window){const observer=new ResizeObserver(clampPins);observer.observe(stickyLayer);}
}
function clampPins() {
  if(!stickyLayer)return;
  const r=stickyLayer.getBoundingClientRect();let changed=false;
  notes.filter(n=>n.pinnedToDesktop).forEach(n=>{
    const p=n.desktopPosition,w=Math.min(p.width,Math.max(190,r.width-12)),h=Math.min(p.height,Math.max(120,r.height-12));
    const x=r.width?clamp(p.x*r.width,0,Math.max(0,r.width-w))/r.width:0;
    const y=r.height?clamp(p.y*r.height,0,Math.max(0,r.height-(p.minimized?42:h)))/r.height:0;
    if(w!==p.width||h!==p.height||Math.abs(x-p.x)>.001||Math.abs(y-p.y)>.001){n.desktopPosition=Object.assign({},p,{x,y,width:w,height:h});changed=true;}
  });
  if(changed)persist(true,false);renderPinned();
}
export function renderPinnedNotes(){renderPinned();}
export function initializeNotesSystem(){
  if(ready)return;ready=true;load();stickyLayer=$('#stickyLayer');
  if(!stickyLayer)throw new Error('Missing #stickyLayer');
  zTop=Math.max(zTop,...notes.filter(n=>n.pinnedToDesktop).map(n=>n.desktopPosition.zIndex));
  bindSticky();renderPinned();
  window.addEventListener('pagehide',()=>{if(saveTimer)persist(true);});
}
export function initializeNotesApp(win){
  initializeNotesSystem();notesWindow=win;bindEditor(win);renderList(win);renderEditor(win);
}
