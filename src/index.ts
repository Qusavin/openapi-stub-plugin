import { createClient } from '@hey-api/openapi-ts';
import { defineConfig } from './plugin';

createClient({
  client: '@hey-api/client-fetch',
  input: 'src/pet-store-openapi.json',
  output: 'src/generated',
  plugins: [
    {
      name: '@hey-api/typescript',
      tree: false,
      enums: 'typescript',
      style: 'PascalCase',
    },
    // @ts-ignore
    defineConfig(),
  ],
});
