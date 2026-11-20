import { mkdir, copyFile, readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const assets = ['index.html', 'style.css', 'app.js', 'me.png', ...(await readdir('.')).filter(name => /^qr.*\.svg$/.test(name))];
await mkdir('www', { recursive: true });
for (const asset of assets) await copyFile(asset, `www/${asset}`);
const html = await readFile('www/index.html', 'utf8');
for (const [, asset] of html.matchAll(/(?:src|href)="([^":?#]+)(?:\?[^" ]*)?"/g)) {
  if (asset === './') continue;
  assert(assets.includes(asset), `Missing bundled asset: ${asset}`);
}
console.log(`Bundled ${assets.length} web assets in www/`);
