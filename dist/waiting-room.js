const stage=document.querySelector('#bounce-stage'),photo=document.querySelector('#bouncing-photo'),pause=document.querySelector('#pause-motion');
const descriptions=['Concert crowd','Portrait in natural light','Green mountain landscape','Microphone on stage','Portrait in blue light','Mountain beneath the stars','Festival lights','Outdoor portrait','Mountain peaks'];
const images=descriptions.map((alt,i)=>{const image=new Image();image.src=`assets/${i+1}.jpg`;return {src:image.src,alt}});
const preference=matchMedia('(prefers-reduced-motion: reduce)');let paused=preference.matches,elapsed=0,last=null,index=0;
function updateControl(){pause.textContent=paused?'▷':'Ⅱ';pause.setAttribute('aria-label',paused?'Play animation':'Pause animation');pause.setAttribute('aria-pressed',String(paused))}
pause.onclick=()=>{paused=!paused;updateControl()};preference.addEventListener('change',()=>{paused=preference.matches;updateControl()});updateControl();
// Triangle waves reflect at the edges; the 12s and 8s crossings meet at a corner every 24s.
function triangle(value){const phase=value%2;return phase<=1?phase:2-phase}
function frame(now){if(last!==null&&!paused&&!document.hidden)elapsed+=Math.min((now-last)/1000,.1);last=now;
 const maxX=Math.max(0,stage.clientWidth-photo.clientWidth),maxY=Math.max(0,stage.clientHeight-photo.clientHeight);
 photo.style.transform=`translate3d(${triangle(elapsed/12)*maxX}px,${triangle(elapsed/8)*maxY}px,0)`;
 const next=Math.floor(elapsed/24)%images.length;if(next!==index){index=next;photo.src=images[index].src;photo.alt=images[index].alt}
 requestAnimationFrame(frame)}requestAnimationFrame(frame);
