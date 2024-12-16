import type { Plugin } from '@hey-api/openapi-ts';

import type { Config } from './types';

export const handler: Plugin.Handler<Config> = ({ context, plugin }) => {
  // create a file for our output
  const file = context.createFile({
    id: plugin.name,
    path: plugin.output,
  });

  context.subscribe('before', () => {
    // do something before parsing the input
  });

  context.subscribe('operation', ({ operation }) => {
    // do something with the operation model
  });

  context.subscribe('after', () => {
    // do something after parsing the input
  });
};
