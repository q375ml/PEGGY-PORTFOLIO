(() => {
 'use strict';
 const inlineHost=document.querySelector('[data-case-inline]');
 const dialog=document.createElement(inlineHost?'section':'dialog');
 dialog.className='case-access about'+(inlineHost?' case-access-inline':'');
 dialog.setAttribute('aria-labelledby','case-access-title');
 dialog.innerHTML=`<button type="button" class="case-close" aria-label="Close password dialog">×</button><h5 id="case-access-title">Private content</h5><p class="case-subtitle">Enter passcode to continue</p><form><label class="case-sr-only" for="case-password">Passcode</label><div class="case-password-row"><input id="case-password" name="password" type="password" autocomplete="current-password" required aria-describedby="case-feedback"><button class="case-show" type="button" aria-label="Show passcode" aria-pressed="false"><svg class="case-eye" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3.5"/></svg><svg class="case-eye-off" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.5 5.1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3 4M6.1 6.1A23 23 0 0 0 2 12s3.5 7 10 7a13 13 0 0 0 5.9-1.9M9.5 9.5a3.5 3.5 0 0 0 5 5"/></svg></button></div><p id="case-feedback" class="case-feedback" role="status" aria-live="polite"></p><button class="bt_blue case-unlock" type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="12" rx="1"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/></svg><span>Unlock</span></button></form>`;
 (inlineHost||document.body).append(dialog);
 const form=dialog.querySelector('form'),input=form.elements.password,feedback=dialog.querySelector('.case-feedback'),submit=form.querySelector('[type=submit]'),close=dialog.querySelector('.case-close'),show=dialog.querySelector('.case-show');
 form.noValidate=true;
 if(inlineHost){
  close.hidden=true;
  const home=document.createElement('a');
  home.className='case-return-home';
  home.href='index.html';
  home.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4-5 5 5 5M4 9h10a6 6 0 0 1 0 12h-4"/></svg><span>Return to Home</span>';
  dialog.append(home);
 }
 let busy=false,opener=null;
 function open(trigger){opener=trigger;input.value='';input.type='password';show.setAttribute('aria-label','Show passcode');show.setAttribute('aria-pressed','false');input.removeAttribute('aria-invalid');dialog.classList.remove('case-error');feedback.textContent='';dialog.showModal();input.focus();}
 function reset(){input.value='';if(opener)opener.focus();}
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',reset);
 dialog.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
 show.addEventListener('click',()=>{const visible=input.type==='password';input.type=visible?'text':'password';show.setAttribute('aria-label',visible?'Hide passcode':'Show passcode');show.setAttribute('aria-pressed',String(visible));});
 input.addEventListener('input',()=>{if(dialog.classList.contains('case-error')){dialog.classList.remove('case-error');input.removeAttribute('aria-invalid');feedback.textContent='';}});
 document.querySelectorAll('[data-cloud-case]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();open(link);}));
 async function fetchFile(url,json=false){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('network');return json?response.json():response.arrayBuffer();}
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  if(input.value.length===0){
   dialog.classList.add('case-error');
   input.setAttribute('aria-invalid','true');
   feedback.textContent='Please fill out this field.';
   input.focus();
   return;
  }
  busy=true;submit.disabled=true;close.disabled=true;show.disabled=true;input.readOnly=true;input.removeAttribute('aria-invalid');dialog.classList.remove('case-error');feedback.textContent='Unlocking project…';
  const urls=[];let authenticated=false;
  try {
   if(!window.crypto?.subtle)throw Error('secure-context');
   const base=new URL('protected/',document.baseURI),config=await fetchFile(new URL('config.json',base),true);
   const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveKey']);
   input.value='';
   const salt=Uint8Array.from(atob(config.salt),c=>c.charCodeAt(0));
   const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',iterations:config.iterations,salt},material,{name:'AES-GCM',length:256},false,['decrypt']);
   async function decrypt(file){const bytes=new Uint8Array(await fetchFile(new URL(file,base)));return crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(0,12)},key,bytes.slice(12));}
   const payload=JSON.parse(new TextDecoder().decode(await decrypt(config.manifest)));authenticated=true;
   feedback.textContent='Loading project images…';
   const doc=new DOMParser().parseFromString(payload.html,'text/html');
   let next=0;
   await Promise.all(Array.from({length:3},async()=>{while(next<payload.assets.length){const asset=payload.assets[next++];const bytes=await decrypt(asset.file);const url=URL.createObjectURL(new Blob([bytes],{type:asset.type}));urls.push(url);doc.querySelectorAll(`[data-case-asset="${asset.id}"]`).forEach(img=>{img.src=url;img.removeAttribute('data-case-asset');});}}));
   const rendered='<!DOCTYPE html>\n'+doc.documentElement.outerHTML;
   history.pushState({cloudCaseUnlocked:true},'',new URL('design-to-code.html',document.baseURI));
   document.open();document.write(rendered);document.close();
   // document.open() removes window listeners: install the guards on the new document.
   let locked=false;
   function clearUnlockedContent(){
    if(locked)return;
    locked=true;
    // Clear text and media before the browser can cache this unlocked document.
    document.body?.replaceChildren();
    document.title='Private Content | Peggy Designer';
    urls.forEach(url=>URL.revokeObjectURL(url));
   }
   window.addEventListener('pagehide',clearUnlockedContent);
   window.addEventListener('pageshow',event=>{
    if(event.persisted||locked){clearUnlockedContent();location.reload();}
   });
   window.addEventListener('popstate',event=>{
    // Keep in-page anchors working, but never restore an unlocked view in an older entry.
    if(!event.state?.cloudCaseUnlocked){clearUnlockedContent();location.reload();}
   });
  }catch(error){
   urls.forEach(url=>URL.revokeObjectURL(url));
   const badPassword=error.name==='OperationError'&&!authenticated;
   feedback.textContent=badPassword?'Incorrect passcode. Please try again.':error.message==='secure-context'?'Please open this website over HTTPS or localhost.':'Unable to load the project. Please check your connection and try again.';
   dialog.classList.add('case-error');if(badPassword)input.setAttribute('aria-invalid','true');input.focus();
  }finally{busy=false;submit.disabled=false;close.disabled=false;show.disabled=false;input.readOnly=false;}
 });
})();
