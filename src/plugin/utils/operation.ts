import { irRef } from './ref';
import { stringCase } from './stringCase';

export interface OperationIRRef {
	/**
	 * Operation ID
	 */
	id: string;
}

export const operationIrRef = ({
	id,
	type,
}: OperationIRRef & {
	type: 'data' | 'error' | 'errors' | 'response' | 'responses';
}): string => {
	let affix = '';

	switch (type) {
		case 'data':
			affix = 'Data';
			break;
		case 'error':
			// error union
			affix = 'Error';
			break;
		case 'errors':
			// errors map
			affix = 'Errors';
			break;
		case 'response':
			// response union
			affix = 'Response';
			break;
		case 'responses':
			// responses map
			affix = 'Responses';
			break;
	}

	return `${irRef}${stringCase({
		case: 'PascalCase',
		value: id,
	})}-${affix}`;
};
