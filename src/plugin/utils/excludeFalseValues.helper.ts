/**
 * Remove null, undefined, false values from given array
 *
 * @param values Given array
 */
export function excludeFalseValues<T>(
	...values: (T | null | undefined | false | '')[]
): T[] {
	return values.filter((v) => v) as T[];
}
