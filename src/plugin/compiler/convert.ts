import ts from 'typescript';

export const expressionToStatement = ({
	expression,
}: {
	expression: ts.Expression;
}) => {
	return ts.factory.createExpressionStatement(expression);
};
