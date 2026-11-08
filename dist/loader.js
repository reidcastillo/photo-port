window.loadedPhotos = new Map();
window.fullPhotoURLs = new Map();
window.photosReady = new Promise(resolve => {
  const loader = document.querySelector('#site-loader');
  const track = loader.querySelector('[role="progressbar"]');
  const bar = loader.querySelector('.load-progress');
  const error = document.querySelector('#load-error');
  const retry = document.querySelector('#load-retry');
  const sources = [...new Set([
    ...(window.portfolioPhotos || []).flatMap(photo => [photo.src, photo.fullSrc].filter(Boolean)),
    ...Array.from(document.querySelectorAll('img[src]'), image => image.getAttribute('src')).filter(Boolean)
  ])];
  function progress() {
    const value = sources.length ? Math.floor((window.loadedPhotos.size + window.fullPhotoURLs.size) / sources.length * 100) : 100;
    bar.style.width = value + '%'; track.setAttribute('aria-valuenow', String(value));
  }
  const fullSources = new Set((window.portfolioPhotos || []).map(photo => photo.fullSrc).filter(Boolean));
  const ready = src => window.loadedPhotos.has(src) || window.fullPhotoURLs.has(src);
  async function load(src) {
    if (fullSources.has(src)) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45000);
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) throw new Error('Image unavailable');
        const blob = await response.blob();
        window.fullPhotoURLs.set(src, URL.createObjectURL(blob)); progress();
      } finally { clearTimeout(timer); }
      return;
    }
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
    const queue = sources.filter(src => !ready(src));
    await Promise.all(Array.from({ length: Math.min(6, queue.length) }, async () => {
      while (queue.length) { const src = queue.shift(); try { await load(src); } catch {} }
    }));
    if (sources.some(src => !ready(src))) {
      error.hidden = false; retry.disabled = false; return;
    }
    if (document.fonts) await document.fonts.ready;
    progress();
    await new Promise(done => setTimeout(done, 180));
    resolve();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.classList.remove('site-loading'); loader.remove();
    }));
  }
  retry.addEventListener('click', run);
  run();
});
