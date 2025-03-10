import Parser from "../src/parser/Parser";
import {TokenType} from "../src/types/token-type";
import tokens from "./utils/tokens";
import BodyNode from "../src/nodes/BodyNode";
import BtnNode from "../src/nodes/BtnNode";
import ExpressionNode from "../src/nodes/ExpressionNode";
import TxtNode from "../src/nodes/TxtNode";
import ImgNode from "../src/nodes/ImgNode";

const makeParser = () => {
	return new Parser();
};

test('img node parsing', () => {
	const parser = makeParser();
	const ast = parser.parse(tokens.wrapInBody([
		{
			value: 'img',
			type: TokenType.IDENT,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: 'https://placehold.co/600x400/EEE/31343C',
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
	const imgNode = bodyNode.getChildren()[0] as ImgNode;
	const srcExpressionNode = imgNode.getAttribute('src') as ExpressionNode;
	const urlExpressionNode = imgNode.getAttribute('url') as ExpressionNode;

	expect(imgNode).toBeInstanceOf(ImgNode);
	expect(imgNode.getName()).toEqual('ImgNode');

	// Test for text expression
	expect(srcExpressionNode).toBeInstanceOf(ExpressionNode);
	expect(srcExpressionNode.getChildren()[0].getValue()).toEqual('https://placehold.co/600x400/EEE/31343C');

	// Test for url expression
	expect(urlExpressionNode).toBeInstanceOf(ExpressionNode);
	expect(urlExpressionNode.getChildren()[0].getValue()).toEqual('https://www.elos-lang.com');
});