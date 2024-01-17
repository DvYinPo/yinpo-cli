import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['index.ts'],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: 'node',
  target: 'node18',
  outfile: 'outfile.js',
})
