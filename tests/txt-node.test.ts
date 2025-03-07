import Parser from "../src/parser/Parser";
import {TokenType} from "../src/types/token-type";
import tokens from "./utils/tokens";
import BodyNode from "../src/nodes/BodyNode";
import BtnNode from "../src/nodes/BtnNode";
import ExpressionNode from "../src/nodes/ExpressionNode";
import TxtNode from "../src/nodes/TxtNode";

const makeParser = () => {
	return new Parser();
};

test('txt node parsing', () => {
	const parser = makeParser();
	const ast = parser.parse(tokens.wrapInBody([
		{
			value: 'txt',
			type: TokenType.IDENT,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: 'text',
			type: TokenType.STRING,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: '-',
			type: TokenType.SYMBOL,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: '>',
			type: TokenType.SYMBOL,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: 'https://www.elos-lang.com',
			type: TokenType.STRING,
			line: 1,
			position: 1,
			end: false,
		},
	]));


	const bodyNode = ast.getChildren()[0] as BodyNode;
	const btnNode = bodyNode.getChildren()[0] as TxtNode;
	const textExpressionNode = btnNode.getAttribute('text') as ExpressionNode;
	const urlExpressionNode = btnNode.getAttribute('url') as ExpressionNode;
	
	expect(btnNode).toBeInstanceOf(TxtNode);
	expect(btnNode.getName()).toEqual('TxtNode');

	// Test for text expression
	expect(textExpressionNode).toBeInstanceOf(ExpressionNode);
	expect(textExpressionNode.getChildren()[0].getValue()).toEqual('text');

	// Test for url expression
	expect(urlExpressionNode).toBeInstanceOf(ExpressionNode);
	expect(urlExpressionNode.getChildren()[0].getValue()).toEqual('https://www.elos-lang.com');
});