import Parser from "../src/parser/Parser";
import {TokenType} from "../src/types/token-type";
import DefNode from "../src/nodes/DefNode";
import IncludeNode from "../src/nodes/IncludeNode";
import ExpressionNode from "../src/nodes/ExpressionNode";

const makeParser = () => {
	return new Parser();
};

test('include node parsing', () => {
	const parser = makeParser();
	const ast = parser.parse([
		{
			value: 'include',
			type: TokenType.IDENT,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: 'filename',
			type: TokenType.STRING,
			line: 1,
			position: 9,
			end: true,
		}
	]);

	const includeNode = ast.getChildren()[0] as IncludeNode;
	const fileNameExpressionNode = includeNode.getAttribute('fileName') as ExpressionNode;

	expect(includeNode).toBeInstanceOf(IncludeNode);
	expect(includeNode.getName()).toEqual('IncludeNode');

	// Test for expression
	expect(fileNameExpressionNode).toBeInstanceOf(ExpressionNode);
	expect(fileNameExpressionNode.getChildren()[0].getValue()).toEqual('filename');
});