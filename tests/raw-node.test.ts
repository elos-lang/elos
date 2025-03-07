import Parser from "../src/parser/Parser";
import {TokenType} from "../src/types/token-type";
import ExpressionNode from "../src/nodes/ExpressionNode";
import tokens from "./utils/tokens";
import BodyNode from "../src/nodes/BodyNode";
import RawNode from "../src/nodes/RawNode";

const makeParser = () => {
	return new Parser();
};

test('raw node parsing', () => {
	const parser = makeParser();
	const ast = parser.parse(tokens.wrapInBody([
		{
			value: 'raw',
			type: TokenType.IDENT,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: 'raw data',
			type: TokenType.STRING,
			line: 1,
			position: 9,
			end: true,
		}
	]));

	const bodyNode = ast.getChildren()[0] as BodyNode;
	const rawNode = bodyNode.getChildren()[0] as RawNode;
	const expressionNode = rawNode.getAttribute('expression') as ExpressionNode;

	expect(rawNode).toBeInstanceOf(RawNode);
	expect(rawNode.getName()).toEqual('RawNode');

	// Test for expression
	expect(expressionNode).toBeInstanceOf(ExpressionNode);
	expect(expressionNode.getChildren()[0].getValue()).toEqual('raw data');
});