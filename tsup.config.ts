import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2022',
  clean: true,
  sourcemap: true,
  minify: true,
  dts: false,
  treeshake: true,
});
