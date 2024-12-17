export type StringCase =
	| 'camelCase'
	| 'PascalCase'
	| 'preserve'
	| 'snake_case'
	| 'SCREAMING_SNAKE_CASE';

const uppercaseRegExp = /[\p{Lu}]/u;
const lowercaseRegExp = /[\p{Ll}]/u;
const identifierRegExp = /([\p{Alpha}\p{N}_]|$)/u;
const separatorsRegExp = /[_.\- `\\[\]{}\\/]+/;

const leadingSeparatorsRegExp = new RegExp('^' + separatorsRegExp.source);
const separatorsAndIdentifierRegExp = new RegExp(
	separatorsRegExp.source + identifierRegExp.source,
	'gu',
);
const numbersAndIdentifierRegExp = new RegExp(
	'\\d+' + identifierRegExp.source,
	'gu',
);

const preserveCase = ({
	case: _case,
	string,
}: {
	readonly case: StringCase;
	string: string;
}) => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;
	let isLastLastCharPreserved = false;

	const separator =
		_case === 'snake_case' || _case === 'SCREAMING_SNAKE_CASE' ? '_' : '-';

	for (let index = 0; index < string.length; index++) {
		const character = string[index];
		isLastLastCharPreserved =
			index > 2 ? string[index - 3] === separator : true;

		let nextIndex = index + 1;
		let nextCharacter = string[nextIndex];
		separatorsRegExp.lastIndex = 0;
		while (nextCharacter && separatorsRegExp.test(nextCharacter)) {
			nextIndex += 1;
			nextCharacter = string[nextIndex];
		}
		const isSeparatorBeforeNextCharacter = nextIndex !== index + 1;

		lowercaseRegExp.lastIndex = 0;
		uppercaseRegExp.lastIndex = 0;
		if (
			uppercaseRegExp.test(character) &&
			(isLastCharLower ||
				(nextCharacter &&
					!isSeparatorBeforeNextCharacter &&
					nextCharacter !== 's' &&
					lowercaseRegExp.test(nextCharacter)))
		) {
			// insert separator behind character
			string = `${string.slice(0, index)}${separator}${string.slice(index)}`;
			index++;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharLower = false;
			isLastCharUpper = true;
		} else if (
			isLastCharUpper &&
			isLastLastCharUpper &&
			lowercaseRegExp.test(character) &&
			!isLastLastCharPreserved &&
			// naive detection of plurals
			!(
				character === 's' &&
				(!nextCharacter ||
					nextCharacter.toLocaleLowerCase() !== nextCharacter)
			)
		) {
			// insert separator 2 characters behind
			string = `${string.slice(0, index - 1)}${separator}${string.slice(index - 1)}`;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharLower = true;
			isLastCharUpper = false;
		} else {
			const characterLower = character.toLocaleLowerCase();
			const characterUpper = character.toLocaleUpperCase();
			isLastLastCharUpper = isLastCharUpper;
			isLastCharLower =
				characterLower === character && characterUpper !== character;
			isLastCharUpper =
				characterUpper === character && characterLower !== character;
		}
	}

	return string;
};

export const stringCase = ({
	case: _case,
	value,
}: {
	readonly case: StringCase | undefined;
	value: string;
}): string => {
	let result = value.trim();

	if (!result.length) {
		return '';
	}

	if (!_case || _case === 'preserve') {
		return result;
	}

	if (result.length === 1) {
		separatorsRegExp.lastIndex = 0;
		if (separatorsRegExp.test(result)) {
			return '';
		}

		return _case === 'PascalCase' || _case === 'SCREAMING_SNAKE_CASE'
			? result.toLocaleUpperCase()
			: result.toLocaleLowerCase();
	}

	const hasUpperCase = result !== result.toLocaleLowerCase();

	if (hasUpperCase) {
		result = preserveCase({ case: _case, string: result });
	}

	result = result.replace(leadingSeparatorsRegExp, '');
	result =
		_case === 'SCREAMING_SNAKE_CASE'
			? result.toLocaleUpperCase()
			: result.toLocaleLowerCase();

	if (_case === 'PascalCase') {
		result = `${result.charAt(0).toLocaleUpperCase()}${result.slice(1)}`;
	}

	if (_case === 'snake_case' || _case === 'SCREAMING_SNAKE_CASE') {
		result = result.replaceAll(
			separatorsAndIdentifierRegExp,
			(_, identifier) => `_${identifier}`,
		);

		if (result[result.length - 1] === '_') {
			// strip trailing underscore
			result = result.slice(0, result.length - 1);
		}
	} else {
		separatorsAndIdentifierRegExp.lastIndex = 0;
		numbersAndIdentifierRegExp.lastIndex = 0;

		result = result.replaceAll(
			numbersAndIdentifierRegExp,
			(match, _, offset) => {
				if (
					['_', '-', '.'].includes(
						result.charAt(offset + match.length),
					)
				) {
					return match;
				}

				return match.toLocaleUpperCase();
			},
		);

		result = result.replaceAll(
			separatorsAndIdentifierRegExp,
			(_, identifier) => identifier.toLocaleUpperCase(),
		);
	}

	return result;
};
