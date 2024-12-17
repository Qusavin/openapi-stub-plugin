export interface Config {
	/**
	 * Plugin name. Must be unique.
	 */
	name: 'stubs';
	/**
	 * Name of the generated file.
	 * @default 'my-plugin'
	 */
	output?: string;
}
