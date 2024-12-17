/**
 * Replaces all substrings enclosed in curly braces {...} with '[\\w]+'.
 *
 * @param path - The original path string, for example, '/pet/{petId}/uploadImage'
 * @returns The modified string with the placeholders replaced
 */
export function sanitizePath(path: string): string {
	return path.replace(/{[^}]+}/g, '[\\w]+');
}
