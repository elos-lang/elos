import Parser from "../src/parser/Parser";
import {TokenType} from "../src/types/token-type";
import DefNode from "../src/nodes/DefNode";
import ExpressionNode from "../src/nodes/ExpressionNode";

const makeParser = () => {
	return new Parser();
};

test('variable definition parsing', () => {
	const parser = makeParser();
	const ast = parser.parse([
		{
			value: 'def',
			type: TokenType.IDENT,
			line: 1,
			position: 1,
			end: false,
		},
		{
			value: 'variable',
			type: TokenType.VAR,
			line: 1,
			position: 4,
			end: false,
		},
		{
			value: 'value',
			type: TokenType.STRING,
			line: 1,
			position: 12,
			end: true,
		}
	]);

	const defNode = ast.getChildren()[0] as DefNode;
	const valueExpressionNode = defNode.getAttribute('value') as ExpressionNode;

	expect(defNode).toBeInstanceOf(DefNode);
	expect(defNode.getName()).toEqual('DefNode');
	expect(defNode.getVariableName()).toEqual('variable');
	expect(valueExpressionNode.getChildren()[0].getValue()).toEqual('value');
});