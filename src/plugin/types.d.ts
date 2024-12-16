export interface Config {
  /**
   * Plugin name. Must be unique.
   */
  name: 'my-plugin';
  /**
   * Name of the generated file.
   * @default 'my-plugin'
   */
  output?: string;
  /**
   * A custom option for your plugin.
   */
  myOption?: boolean;
}
