const photos=window.portfolioPhotos;
let selected=photos.filter(p=>p.category==='music'),current=0;const gallery=document.querySelector('#gallery'),lightbox=document.querySelector('#lightbox');
function render(){gallery.replaceChildren();selected.forEach((p,i)=>{const b=document.createElement('button');b.className='photo';b.setAttribute('aria-label',`View photograph: ${p.alt}`);b.innerHTML=`<span class="frame"><img src="${p.src}" alt="${p.alt}" loading="${i<3?'eager':'lazy'}"></span>`;b.onclick=()=>{current=i;show();lightbox.showModal();document.body.style.overflow='hidden'};gallery.append(b)})}
function show(){let p=selected[current];document.querySelector('#full').src=p.src;document.querySelector('#full').alt=p.alt}
document.querySelector('#close').onclick=()=>lightbox.close();lightbox.addEventListener('close',()=>document.body.style.overflow='');
function step(n){current=(current+n+selected.length)%selected.length;show()}document.querySelector('#prev').onclick=()=>step(-1);document.querySelector('#next').onclick=()=>step(1);lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
document.querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>{document.querySelectorAll('[data-category]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));selected=photos.filter(p=>p.category===button.dataset.category);current=0;gallery.setAttribute('aria-label',button.dataset.category+' photographs');render()});
render();
