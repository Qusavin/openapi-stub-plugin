import { createClient } from '@hey-api/openapi-ts';
import { defineConfig } from './plugin';

createClient({
	client: '@hey-api/client-fetch',
	input: {
		path: 'src/pet-store-openapi.json',
	},
	output: 'src/generated',
	experimentalParser: true,
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
