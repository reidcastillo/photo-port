// Keep decoded images alive for the gallery and subsequent full-screen viewing.
window.loadedPhotos = new Map();
window.photosReady = new Promise(resolve => {
  const loader = document.querySelector('#site-loader');
  const track = loader.querySelector('[role="progressbar"]');
  const bar = loader.querySelector('.load-progress');
  const error = document.querySelector('#load-error');
  const retry = document.querySelector('#load-retry');
  const sources = [...new Set([
    ...(window.portfolioPhotos || []).map(photo => photo.src),
    ...Array.from(document.querySelectorAll('img[src]'), image => image.getAttribute('src')).filter(Boolean)
  ])];
  function progress() {
    const value = sources.length ? Math.floor(window.loadedPhotos.size / sources.length * 100) : 100;
    bar.style.width = value + '%'; track.setAttribute('aria-valuenow', String(value));
  }
  function load(src) {
    return new Promise((done, fail) => {
      const image = new Image();
      image.loading = 'eager';
      const timer = setTimeout(() => { image.onload = image.onerror = null; fail(new Error('Timeout')); }, 45000);
      image.onerror = () => { clearTimeout(timer); fail(new Error('Image unavailable')); };
      image.onload = async () => {
        try {
          await image.decode();
          clearTimeout(timer);
          window.loadedPhotos.set(src, image); progress(); done();
        } catch (e) { clearTimeout(timer); fail(e); }
      };
      image.src = src;
    });
  }
  async function run() {
    retry.disabled = true; error.hidden = true;
    const queue = sources.filter(src => !window.loadedPhotos.has(src));
    // Limit simultaneous full-resolution decodes to avoid a memory/CPU spike.
    await Promise.all(Array.from({ length: Math.min(6, queue.length) }, async () => {
      while (queue.length) { const src = queue.shift(); try { await load(src); } catch {} }
    }));
    if (sources.some(src => !window.loadedPhotos.has(src))) {
      error.hidden = false; retry.disabled = false; return;
    }
    if (document.fonts) await document.fonts.ready;
    progress();
    await new Promise(done => setTimeout(done, 180));
    resolve();
    // Let the gallery attach its decoded images before revealing the page.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.classList.remove('site-loading'); loader.remove();
    }));
  }
  retry.addEventListener('click', run);
  run();
});
