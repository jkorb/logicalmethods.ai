import {el,iconButton} from './boolean-ui.js';
export function mountResolutionFullscreen(root,board){
 const frame=el('div',{class:'finf-resolution-canvas'}),controls=el('div',{class:'finf-resolution-tools','data-export-controls':''});
 board.before(frame);frame.append(board,controls);
 const button=iconButton(root,'fullscreen','Fullscreen');controls.append(button);root.tabIndex=0;
 let previousOverflow='';
 const expanded=()=>document.fullscreenElement===root||root.classList.contains('nd-fullscreen');
 function sync(){const on=expanded();button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Exit fullscreen':'Fullscreen');button.title=on?'Exit fullscreen (Esc)':'Fullscreen (F)';}
 function fallback(on){root.classList.toggle('nd-fullscreen',on);if(on){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';root.focus();}else{document.body.style.overflow=previousOverflow;button.focus();}sync();}
 async function toggle(){try{if(document.fullscreenElement===root)await document.exitFullscreen();else if(root.classList.contains('nd-fullscreen'))fallback(false);else if(root.requestFullscreen)await root.requestFullscreen();else fallback(true);}catch{fallback(!expanded());}sync();}
 button.onclick=toggle;document.addEventListener('fullscreenchange',sync);
 root.addEventListener('keydown',event=>{
  if(event.key.toLowerCase()==='f'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,[contenteditable]')){event.preventDefault();toggle();}
  if(event.key==='Escape'&&root.classList.contains('nd-fullscreen'))fallback(false);
  if(event.key==='Tab'&&root.classList.contains('nd-fullscreen')){
   const stops=[...root.querySelectorAll('button,textarea,[tabindex="0"]')].filter(n=>!n.disabled&&n.getClientRects().length),first=stops[0],last=stops.at(-1);
   if(event.shiftKey&&(document.activeElement===first||document.activeElement===root)){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }
 });sync();
}
