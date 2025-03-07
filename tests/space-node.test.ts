import Parser from "../src/parser/Parser";
import {TokenType} from "../src/types/token-type";
import SpaceNode from "../src/nodes/SpaceNode";
import tokens from "./utils/tokens";
import BodyNode from "../src/nodes/BodyNode";

const makeParser = () => {
	return new Parser();
};

test('space node parsing', () => {
	const parser = makeParser();
	const ast = parser.parse(tokens.wrapInBody([
		{
			value: 'space',
			type: TokenType.IDENT,
			line: 1,
			position: 1,
			end: false,
		},
	]));

	const bodyNode = ast.getChildren()[0] as BodyNode;
	const spaceNode = bodyNode.getChildren()[0] as SpaceNode;

	expect(spaceNode).toBeInstanceOf(SpaceNode);
	expect(spaceNode.getName()).toEqual('SpaceNode');
});