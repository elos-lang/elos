import Parser from "../src/parser/Parser";
import AstNode from "../src/parser/AstNode";

const makeParser = () => {
	return new Parser();
};

test('ast node parsing', () => {
	const parser = makeParser();
	const astNode = parser.parse([]);
	
	expect(astNode).toBeInstanceOf(AstNode);
	expect(astNode.getChildren().length).toEqual(0);
});