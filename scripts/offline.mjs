import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const files = await readdir('dist/assets');
const revision = createHash('sha256').update(files.join('\n')).digest('hex').slice(0, 12);
const worker = await readFile('dist/sw.js', 'utf8');
await writeFile('dist/sw.js', worker
  .replace("'dev-revision'", JSON.stringify(revision))
  .replace('const BUILD_ASSETS = [];', `const BUILD_ASSETS = ${JSON.stringify(files.filter(file => !file.endsWith('.woff')).map(file => `/assets/${file}`))};`));
