const photos=[
['photo-1501386761578-eac5c94b800a','Live','After dark','Crowd beneath golden light at a live music festival'],
['photo-1500648767791-00dcc994a43e','People','A quiet moment','Portrait of a man in natural light'],
['photo-1470071459604-3b5ec3a7fe05','Places','Somewhere, slowly','Mist drifting over a green mountain landscape'],
['photo-1516280440614-37939bbacd81','Live','In the lights','Microphone in focus against soft stage lighting'],
['photo-1534528741775-53994a69daeb','People','Passing glances','Close portrait of a woman'],
['photo-1519681393784-d120267933ba','Places','The last light','Snowy mountain beneath a star-filled sky'],
['photo-1470229722913-7c0e2dbbafd3','Live','A little louder','A sea of people at a concert'],
['photo-1506794778202-cad84cf45f1d','People','Between frames','Outdoor portrait in soft light'],
['photo-1464822759023-fed622ff2c3b','Places','Out of the ordinary','Dramatic mountain peaks beneath clouds']
].map((p,i)=>({src:`assets/${i+1}.jpg`,category:p[1]==='Live'?'music':'life',title:p[2],alt:p[3],id:i+1}));
let selected=photos.filter(p=>p.category==='music'),current=0;const gallery=document.querySelector('#gallery'),lightbox=document.querySelector('#lightbox');
function render(){gallery.replaceChildren();selected.forEach((p,i)=>{const b=document.createElement('button');b.className='photo';b.setAttribute('aria-label',`View photograph: ${p.alt}`);b.innerHTML=`<span class="frame"><img src="${p.src}" alt="${p.alt}" loading="${i<3?'eager':'lazy'}"></span>`;b.onclick=()=>{current=i;show();lightbox.showModal();document.body.style.overflow='hidden'};gallery.append(b)})}
function show(){let p=selected[current];document.querySelector('#full').src=p.src;document.querySelector('#full').alt=p.alt;document.querySelector('#photo-title').textContent=p.title}
document.querySelector('#close').onclick=()=>lightbox.close();lightbox.addEventListener('close',()=>document.body.style.overflow='');
function step(n){current=(current+n+selected.length)%selected.length;show()}document.querySelector('#prev').onclick=()=>step(-1);document.querySelector('#next').onclick=()=>step(1);lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
document.querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>{document.querySelectorAll('[data-category]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));selected=photos.filter(p=>p.category===button.dataset.category);current=0;gallery.setAttribute('aria-label',button.dataset.category+' photographs');render()});
render();
