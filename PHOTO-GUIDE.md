# Adding photos

Put photos in `dist/assets/music/` or `dist/assets/life/`. The folder decides the category. Names such as `11.jpg`, `12.jpg`, and `13.jpg` work automatically; gaps in numbering are fine. JPG, JPEG, PNG, WebP, AVIF, and GIF are supported. No titles or manual photo list are required. Both the gallery and Waiting Room share these photos.

## Local preview

Run `node scripts/preview.js`, then open http://localhost:8000. Add, move, or delete photos and refresh your browser. Stop the old Python preview server with Control+C first if it is using port 8000.

## Publish

Run `git add dist scripts vercel.json PHOTO-GUIDE.md`, `git commit -m "Update portfolio photos"`, then `git push origin main`.

Vercel generates the photo list during deployment using `node scripts/build-photos.js`. Keep the output directory set to `dist`. If you previously set an empty Build Command override in the Vercel dashboard, remove that override or set it to `node scripts/build-photos.js`.

`dist/photos.js` is generated; do not edit it. Run `node scripts/build-photos.js` to regenerate it when using another local server.
