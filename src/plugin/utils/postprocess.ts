import { stringCase } from './stringCase';

/**
 * Convert the input value to a correct service name. This converts
 * the input string to PascalCase.
 */
export const getServiceName = (value: string): string =>
	stringCase({
		case: 'PascalCase',
		value: sanitizeNamespaceIdentifier(value),
	});

const sanitizeNamespaceIdentifier = (name: string) =>
	name
		.replace(/^[^\p{ID_Start}]+/u, '')
		.replace(/[^$\u200c\u200d\p{ID_Continue}]/gu, '-')
		.replace(/\$/g, '-');
