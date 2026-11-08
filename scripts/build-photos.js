const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
function collectPhotos(directory = path.join(root, 'dist', 'assets')) {
  return ['music', 'life'].flatMap(category => {
    const folder = path.join(directory, category);
    if (!fs.existsSync(folder)) return [];
    return fs.readdirSync(folder, { withFileTypes: true })
      .filter(file => file.isFile() && /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name))
      .map(file => file.name).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(name => ({ src: `assets/${category}/${encodeURIComponent(name)}`, category, alt: `${category === 'music' ? 'Music' : 'Life'} photograph` }));
  });
}
let running;
async function generate() {
  const directory = path.join(root, 'dist', 'generated');
  fs.mkdirSync(directory, { recursive: true });
  const photos = collectPhotos(), used = new Set();
  for (const photo of photos) {
    const original = path.join(root, 'dist', decodeURIComponent(photo.src));
    const hash = crypto.createHash('sha256').update(fs.readFileSync(original)).digest('hex').slice(0, 20);
    const names = [`${hash}-grid.webp`, `${hash}-view.webp`];
    for (const [i, name] of names.entries()) {
      used.add(name);
      const destination = path.join(directory, name);
      if (!fs.existsSync(destination)) await sharp(original).rotate().resize({ width: i ? 2000 : 960, height: i ? 2000 : 960, fit: 'inside', withoutEnlargement: true }).webp({ quality: i ? 90 : 86 }).toFile(destination);
    }
    const meta = await sharp(path.join(directory, names[0])).metadata();
    photo.src = `generated/${names[0]}`;
    photo.fullSrc = `generated/${names[1]}`;
    photo.width = meta.width; photo.height = meta.height;
  }
  fs.writeFileSync(path.join(root, 'dist', 'photos.js'), 'window.portfolioPhotos = ' + JSON.stringify(photos, null, 2) + ';\nwindow.portfolioExtras = ' + JSON.stringify(fs.existsSync(path.join(root, 'dist/assets/contact.webp')) ? ['assets/contact.webp'] : []) + ';\n');
  for (const name of fs.readdirSync(directory)) if (/^[a-f0-9]{20}-(grid|view)\.webp$/.test(name) && !used.has(name)) fs.unlinkSync(path.join(directory, name));
  return photos;
}
function buildPhotos() {
  if (!running) running = generate().finally(() => { running = null; });
  return running;
}
module.exports = { collectPhotos, buildPhotos };
if (require.main === module) buildPhotos().then(photos => console.log(`Prepared ${photos.length} photos.`)).catch(error => { console.error(error); process.exitCode = 1; });
