import Parser from "../src/parser/Parser";
import {TokenType} from "../src/types/token-type";
import DefNode from "../src/nodes/DefNode";
import GroupNode from "../src/nodes/GroupNode";
import AstNode from "../src/parser/AstNode";
import tokens from "./utils/tokens";
import BodyNode from "../src/nodes/BodyNode";
import TxtNode from "../src/nodes/TxtNode";
import ExpressionNode from "../src/nodes/ExpressionNode";

const makeParser = () => {
	return new Parser();
};

test('group parsing', () => {
	const parser = makeParser();
	const ast = parser.parse(tokens.wrapInBody([
		{
			value: 'group',
			type: TokenType.IDENT,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: '{',
			type: TokenType.SYMBOL,
			line: 1,
			position: 4,
			end: false,
		},
		{
			value: 'txt',
			type: TokenType.IDENT,
			line: 1,
			position: 12,
			end: false,
		},
		{
			value: 'a text',
			type: TokenType.STRING,
			line: 1,
			position: 12,
			end: false,
		},
		{
			value: '}',
			type: TokenType.SYMBOL,
			line: 1,
			position: 4,
			end: true,
		},
	]));

	const bodyNode = ast.getChildren()[0] as BodyNode;
	const groupNode = bodyNode.getChildren()[0] as GroupNode;
	const txtNode = groupNode.getChildren()[0] as TxtNode;
	const textExpressionNode = txtNode.getAttribute('text') as ExpressionNode;

	expect(groupNode).toBeInstanceOf(GroupNode);
	expect(groupNode.getName()).toEqual('GroupNode');

	expect(txtNode).toBeInstanceOf(TxtNode);
	expect(txtNode.getName()).toEqual('TxtNode');

	// Test for text expression
	expect(textExpressionNode).toBeInstanceOf(ExpressionNode);
	expect(textExpressionNode.getChildren()[0].getValue()).toEqual('a text');
});