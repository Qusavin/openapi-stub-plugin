import ts from 'typescript';
import { Plugin } from '@hey-api/openapi-ts';
import { compiler } from './compiler';
import type { Config } from './types';
import { getServiceName } from './utils/postprocess';
import { operationIrRef } from './utils/operation';
import { createArrowFunction, createTypeNode } from './compiler/types';
import { excludeFalseValues } from './utils/excludeFalseValues.helper';
import { sanitizePath } from './utils/path';

const stubsId = 'stubs';

const createStubMethod = (
	name: string,
	predicate: string,
	bodyType?: string,
): ts.MethodDeclaration => {
	const mock: Record<string, string> = {
		headers: 'headers',
		status: 'status',
		body: bodyType ? 'body' : 'undefined',
	};

	return compiler.methodDeclaration({
		accessLevel: undefined,
		isStatic: true,
		name,
		parameters: excludeFalseValues(
			bodyType && {
				isRequired: true,
				name: 'body',
				type: bodyType,
			},
			{
				isRequired: true,
				name: 'status',
				type: 'number',
				default: 200,
			},
			{
				isRequired: true,
				name: 'headers',
				type: 'Record<string, string>',
				default: {
					'Content-Type': 'application/json;charset=UTF-8',
				},
			},
		),
		returnType: 'IStub',
		statements: [
			compiler.returnStatement({
				expression: compiler.objectExpression({
					multiLine: true,
					identifiers: ['predicate', 'mock'],
					obj: {
						predicate,
						mock,
					},
					shorthand: true,
				}),
			}),
		],
	});
};

const createPredicateFnProperty = (
	name: string,
	url: string,
	httpMethod: string,
): ts.PropertyDeclaration => {
	return ts.factory.createPropertyDeclaration(
		[
			ts.factory.createModifier(ts.SyntaxKind.StaticKeyword),
			ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword),
		],
		name,
		undefined,
		createTypeNode('StubPredicate'),
		createArrowFunction({
			parameters: [{ name: 'request' }],
			statements: [
				compiler.returnStatement({
					expression: compiler.binaryExpression({
						left: compiler.callExpression({
							functionName: compiler.propertyAccessExpression({
								expression: compiler.newExpression({
									argumentsArray: [
										ts.factory.createStringLiteral(
											sanitizePath(url),
										),
									],
									expression:
										ts.factory.createIdentifier('RegExp'),
								}),
								name: 'test',
							}),
							parameters: [
								compiler.accessExpression(['request', 'url']),
							],
						}),
						operator: '&&',
						right: compiler.binaryExpression({
							left: compiler.accessExpression([
								'request',
								'method',
							]),
							operator: '===',
							right: ts.factory.createStringLiteral(
								httpMethod.toUpperCase(),
							),
						}),
					}),
				}),
			],
		}),
	);
};

export const handler: Plugin.Handler<Config> = ({ context, plugin }) => {
	const stubsFile = context.createFile({
		id: stubsId,
		path: plugin.output,
	});
	const typesModule = stubsFile.relativePathToFile({ context, id: 'types' });

	stubsFile.import({
		asType: true,
		module: '../common',
		name: 'IStub',
	});

	stubsFile.import({
		asType: true,
		module: '../common',
		name: 'StubPredicate',
	});

	const stubMethodsMap = new Map<string, Array<ts.MethodDeclaration>>();
	const predicatePropertiesMap = new Map<
		string,
		Array<ts.PropertyDeclaration>
	>();

	context.subscribe('operation', ({ operation }) => {
		// Find response name in types file
		const identifierResponse = context.file({ id: 'types' })!.identifier({
			$ref: operationIrRef({ id: operation.id, type: 'response' }),
			namespace: 'type',
		});

		if (identifierResponse.name) {
			stubsFile.import({
				asType: true,
				module: typesModule,
				name: identifierResponse.name,
			});
		}

		const predicateProperty = createPredicateFnProperty(
			operation.id,
			operation.path,
			operation.method,
		);

		const uniqueTags = Array.from(new Set(operation.tags));

		if (!uniqueTags.length) {
			uniqueTags.push('default');
		}

		for (const tag of uniqueTags) {
			const name = getServiceName(tag);

			const stubClassName = `${name}Stubs`;
			const predicateClassName = `${name}Predicates`;

			const stubMethod = createStubMethod(
				operation.id,
				`${predicateClassName}.${operation.id}`,
				identifierResponse.name || undefined,
			);
			const stubs = stubMethodsMap.get(stubClassName) ?? [];
			stubs.push(stubMethod);
			stubMethodsMap.set(stubClassName, stubs);

			const predicates =
				predicatePropertiesMap.get(predicateClassName) ?? [];
			predicates.push(predicateProperty);
			predicatePropertiesMap.set(predicateClassName, predicates);
		}
	});

	context.subscribe('after', () => {
		for (const [name, nodes] of predicatePropertiesMap) {
			const node = compiler.classDeclaration({
				decorator: undefined,
				members: [...nodes],
				name,
			});

			stubsFile.add(node);
		}

		for (const [name, nodes] of stubMethodsMap) {
			const node = compiler.classDeclaration({
				decorator: undefined,
				members: [...nodes],
				name,
			});

			stubsFile.add(node);
		}
	});
};
