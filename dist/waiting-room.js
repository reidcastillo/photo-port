(() => {
const stage = document.querySelector('#bounce-stage');
const library = window.portfolioPhotos;
const bodies = [];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let nextPhoto = 0, lastTime = null;
function dimensions() {
  const width = Math.min(220, stage.clientWidth * .24, Math.sqrt(stage.clientWidth * stage.clientHeight * .23 / Math.max(1, bodies.length)));
  return { width, height: width * .75 };
}
function confine(body, width, height) {
  const right = Math.max(0, stage.clientWidth - width), bottom = Math.max(0, stage.clientHeight - height);
  if (body.x < 0) { body.x = 0; body.vx = Math.abs(body.vx); }
  if (body.x > right) { body.x = right; body.vx = -Math.abs(body.vx); }
  if (body.y < 0) { body.y = 0; body.vy = Math.abs(body.vy); }
  if (body.y > bottom) { body.y = bottom; body.vy = -Math.abs(body.vy); }
}
function addPhoto(event) {
  if (!library.length) return;
  const item = library[nextPhoto++ % library.length], image = document.createElement('img');
  image.src = item.src; image.alt = item.alt; image.className = 'bouncing-photo'; image.draggable = false;
  const rect = stage.getBoundingClientRect();
  bodies.push({ image, x: event?.clientX != null ? event.clientX - rect.left : stage.clientWidth * .3,
    y: event?.clientY != null ? event.clientY - rect.top : stage.clientHeight * .3,
    vx: (Math.random() < .5 ? -1 : 1) * (65 + Math.random() * 35),
    vy: (Math.random() < .5 ? -1 : 1) * (55 + Math.random() * 30) });
  stage.append(image);
}
stage.addEventListener('click', addPhoto);
stage.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); addPhoto(); } });
function frame(time) {
  const dt = lastTime === null || document.hidden ? 0 : Math.min((time - lastTime) / 1000, .025); lastTime = time;
  const { width, height } = dimensions();
  for (const b of bodies) {
    if (!reducedMotion.matches) { b.x += b.vx * dt; b.y += b.vy * dt; }
    confine(b, width, height);
  }
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i], b = bodies[j], dx = b.x - a.x, dy = b.y - a.y;
      const overlapX = width - Math.abs(dx), overlapY = height - Math.abs(dy);
      if (overlapX <= 0 || overlapY <= 0) continue;
      if (overlapX < overlapY) {
        const sign = dx >= 0 ? 1 : -1;
        a.x -= sign * (overlapX / 2 + .1); b.x += sign * (overlapX / 2 + .1);
        if ((a.vx - b.vx) * sign > 0) [a.vx, b.vx] = [b.vx, a.vx];
      } else {
        const sign = dy >= 0 ? 1 : -1;
        a.y -= sign * (overlapY / 2 + .1); b.y += sign * (overlapY / 2 + .1);
        if ((a.vy - b.vy) * sign > 0) [a.vy, b.vy] = [b.vy, a.vy];
      }
      confine(a, width, height); confine(b, width, height);
    }
  }
  for (const b of bodies) {
    b.image.style.width = width + 'px'; b.image.style.height = height + 'px';
    b.image.style.transform = `translate3d(${b.x}px,${b.y}px,0)`;
  }
  requestAnimationFrame(frame);
}
addPhoto(); requestAnimationFrame(frame);

})();
