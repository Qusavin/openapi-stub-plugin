import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  shims: true,
  sourcemap: true,
  treeshake: true,
  external: ['@hey-api/openapi-ts', '@hey-api/client-fetch'],
}));
