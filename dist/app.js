(async () => {
await window.photosReady;
const photos=[...window.portfolioPhotos];
// Shuffle once per visit; switching categories and using arrows preserves that order.
for(let i=photos.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[photos[i],photos[j]]=[photos[j],photos[i]];}
let selected=photos.filter(p=>p.category==='music'),current=0;const gallery=document.querySelector('#gallery'),lightbox=document.querySelector('#lightbox');
function render(){gallery.replaceChildren();selected.forEach((p,i)=>{const b=document.createElement('button');b.className='photo';b.setAttribute('aria-label',`View photograph: ${p.alt}`);const frame=document.createElement('span');frame.className='frame';const img=window.loadedPhotos.get(p.src);img.alt=p.alt;img.width=p.width;img.height=p.height;img.decoding="sync";frame.append(img);b.append(frame);b.onclick=async()=>{current=i;await show();if(!lightbox.open)lightbox.showModal();document.body.style.overflow='hidden'};gallery.append(b)})}
let viewerRequest=0;
async function show(){
 const request=++viewerRequest,p=selected[current],image=new Image();
 image.src=window.fullPhotoURLs.get(p.fullSrc)||p.src;image.alt=p.alt;image.id='full';
 await image.decode();
 if(request!==viewerRequest)return;
 document.querySelector('#full').replaceWith(image);
}
document.querySelector('#close').onclick=()=>lightbox.close();lightbox.addEventListener('close',()=>document.body.style.overflow='');
function step(n){current=(current+n+selected.length)%selected.length;show()}document.querySelector('#prev').onclick=()=>step(-1);document.querySelector('#next').onclick=()=>step(1);lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
document.querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>{document.querySelectorAll('[data-category]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));selected=photos.filter(p=>p.category===button.dataset.category);current=0;gallery.setAttribute('aria-label',button.dataset.category+' photographs');render()});
render();

})();
