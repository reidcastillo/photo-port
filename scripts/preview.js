const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { buildPhotos } = require('./build-photos');
const root = path.resolve(__dirname, '../dist');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.avif':'image/avif', '.gif':'image/gif', '.ttf':'font/ttf' };
http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (file === path.join(root, 'photos.js')) buildPhotos();
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch { res.writeHead(400).end('Invalid request'); }
}).listen(8000, '127.0.0.1', () => console.log('Portfolio preview: http://localhost:8000 — add photos, then refresh.'));
