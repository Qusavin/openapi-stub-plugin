import type { Plugin } from '@hey-api/openapi-ts';

import { handler } from './plugin';
import type { Config } from './types';

export const defaultConfig: Plugin.Config<Config> = {
	_dependencies: ['@hey-api/typescript'],
	_handler: handler,
	_handlerLegacy: () => {},
	name: 'stubs',
	output: 'stubs',
};

export const defineConfig: Plugin.DefineConfig<Config> = (config) => ({
	experimentalParser: true,
	...defaultConfig,
	...config,
});
