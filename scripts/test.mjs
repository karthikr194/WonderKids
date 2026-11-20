import { build } from 'esbuild';

const compiled = await build({
  entryPoints: ['tests/learning.test.ts'],
  platform: 'node',
  format: 'esm',
  bundle: true,
  write: false,
});
await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
