import ts from 'typescript';

import { validTypescriptIdentifierRegExp } from '../utils/regexp';
import {
	createPropertyAccessChain,
	createPropertyAccessExpression,
} from './types';
import { createIdentifier } from './utils';

export const createSafeAccessExpression = (path: string[]) =>
	path.slice(1).reduce<ts.Expression>(
		(expression, element) => {
			validTypescriptIdentifierRegExp.lastIndex = 0;
			if (validTypescriptIdentifierRegExp.test(element)) {
				return createPropertyAccessChain({
					expression,
					name: element,
				});
			}

			return ts.factory.createElementAccessChain(
				expression,
				ts.factory.createToken(ts.SyntaxKind.QuestionDotToken),
				createIdentifier({ text: element }),
			);
		},
		createIdentifier({ text: path[0] }),
	);

export const createAccessExpression = (path: string[]) =>
	path.slice(1).reduce<ts.Expression>(
		(expression, element) =>
			createPropertyAccessExpression({
				expression,
				name: element,
			}),
		createIdentifier({ text: path[0] }),
	);

/**
 * Handles an array of access expressions instead of nesting them (default TypeScript syntax)
 */
export const createPropertyAccessExpressions = ({
	expressions,
}: {
	expressions: Array<string | ts.Expression | ts.MemberName>;
}): ts.PropertyAccessExpression => {
	const expression = expressions.reduce((expression, name) => {
		return createPropertyAccessExpression({
			expression,
			// @ts-expect-error
			name,
		});
	});

	return expression as ts.PropertyAccessExpression;
};

export const createBinaryExpression = ({
	left,
	operator = '==',
	right,
}: {
	left: ts.Expression;
	operator?: '==' | '===' | 'in' | '&&' | '||';
	right: ts.Expression | string;
}) => {
	let operatorSymbol: ts.SyntaxKind;

	switch (operator) {
		case '==':
			operatorSymbol = ts.SyntaxKind.EqualsEqualsToken;
			break;
		case '===':
			operatorSymbol = ts.SyntaxKind.EqualsEqualsEqualsToken;
			break;
		case 'in':
			operatorSymbol = ts.SyntaxKind.InKeyword;
			break;
		case '&&':
			operatorSymbol = ts.SyntaxKind.AmpersandAmpersandToken;
			break;
		case '||':
			operatorSymbol = ts.SyntaxKind.BarBarToken;
			break;
	}

	return ts.factory.createBinaryExpression(
		left,
		operatorSymbol,
		typeof right === 'string' ? createIdentifier({ text: right }) : right,
	);
};

export const createIfStatement = ({
	elseStatement,
	expression,
	thenStatement,
}: {
	elseStatement?: ts.Statement;
	expression: ts.Expression;
	thenStatement: ts.Statement;
}) => ts.factory.createIfStatement(expression, thenStatement, elseStatement);
