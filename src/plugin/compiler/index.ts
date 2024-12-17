import * as classes from './classes';
import * as module from './module';
import * as types from './types';
import * as _return from './return';
import * as utils from './utils';
import * as transform from './transform';

export type { FunctionParameter } from './types';
export type { Comments } from './utils';
export type { ClassElement, Node, TypeNode } from 'typescript';

export const compiler = {
	anonymousFunction: types.createAnonymousFunction,
	arrayLiteralExpression: types.createArrayLiteralExpression,
	arrowFunction: types.createArrowFunction,
	assignment: types.createAssignment,
	awaitExpression: types.createAwaitExpression,
	block: types.createBlock,
	callExpression: module.createCallExpression,
	classDeclaration: classes.createClassDeclaration,
	conditionalExpression: types.createConditionalExpression,
	constVariable: module.createConstVariable,
	constructorDeclaration: classes.createConstructorDeclaration,
	enumDeclaration: types.createEnumDeclaration,
	exportAllDeclaration: module.createExportAllDeclaration,
	exportNamedDeclaration: module.createNamedExportDeclarations,
	forOfStatement: types.createForOfStatement,
	functionTypeNode: types.createFunctionTypeNode,
	identifier: utils.createIdentifier,
	indexedAccessTypeNode: types.createIndexedAccessTypeNode,
	isTsNode: utils.isTsNode,
	keywordTypeNode: types.createKeywordTypeNode,
	literalTypeNode: types.createLiteralTypeNode,
	methodDeclaration: classes.createMethodDeclaration,
	namedImportDeclarations: module.createNamedImportDeclarations,
	namespaceDeclaration: types.createNamespaceDeclaration,
	newExpression: types.createNewExpression,
	nodeToString: utils.tsNodeToString,
	null: types.createNull,
	objectExpression: types.createObjectType,
	ots: utils.ots,
	parameterDeclaration: types.createParameterDeclaration,
	propertyAccessExpression: types.createPropertyAccessExpression,
	propertyAssignment: types.createPropertyAssignment,
	stringLiteral: types.createStringLiteral,
	stringToTsNodes: utils.stringToTsNodes,
	typeAliasDeclaration: types.createTypeAliasDeclaration,
	typeNode: types.createTypeNode,
	typeOfExpression: types.createTypeOfExpression,
	typeParenthesizedNode: types.createTypeParenthesizedNode,
	typeReferenceNode: types.createTypeReferenceNode,
	valueToExpression: types.toExpression,
	returnFunctionCall: _return.createReturnFunctionCall,
	returnStatement: _return.createReturnStatement,
	returnVariable: _return.createReturnVariable,
	safeAccessExpression: transform.createSafeAccessExpression,
	accessExpression: transform.createAccessExpression,
	propertyAccessExpressions: transform.createPropertyAccessExpressions,
	binaryExpression: transform.createBinaryExpression,
	ifStatement: transform.createIfStatement,
};
