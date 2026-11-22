// Copia as libs para assets/vendor e empacota o lírio 3D (Three.js) num IIFE.
import { cpSync, mkdirSync } from 'node:fs';
import { build } from 'esbuild';

mkdirSync('assets/vendor', { recursive: true });
for (const f of ['gsap.min.js', 'ScrollTrigger.min.js', 'DrawSVGPlugin.min.js'])
  cpSync(`node_modules/gsap/dist/${f}`, `assets/vendor/${f}`);
for (const f of ['lenis.min.js', 'lenis.css'])
  cpSync(`node_modules/lenis/dist/${f}`, `assets/vendor/${f}`);

await build({
  entryPoints: ['src/lirio3d.js'], bundle: true, minify: true, format: 'iife',
  globalName: 'Lirio3D', target: 'es2020', legalComments: 'none', outfile: 'assets/lirio3d.js',
});
