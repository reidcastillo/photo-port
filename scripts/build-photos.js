const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function collectPhotos(directory = path.join(root, 'dist', 'assets')) {
  return ['music', 'life'].flatMap(category => {
    const folder = path.join(directory, category);
    if (!fs.existsSync(folder)) return [];
    return fs.readdirSync(folder, { withFileTypes: true })
      .filter(file => file.isFile() && /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name))
      .map(file => file.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(name => ({ src: `assets/${category}/${encodeURIComponent(name)}`, category, alt: `${category === 'music' ? 'Music' : 'Life'} photograph` }));
  });
}
function buildPhotos() {
  const photos = collectPhotos();
  fs.writeFileSync(path.join(root, 'dist', 'photos.js'), '// Generated automatically from assets/music and assets/life.\nwindow.portfolioPhotos = ' + JSON.stringify(photos, null, 2) + ';\n');
  return photos;
}
module.exports = { collectPhotos, buildPhotos };
if (require.main === module) console.log(`Found ${buildPhotos().length} photos.`);
