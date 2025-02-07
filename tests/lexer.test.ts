import {Lexer} from "../src/lexer/Lexer";
import {TokenType} from "../src/types/token-type";

const makeLexer = () => {
	return new Lexer();
};

test('number tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('1');

	expect(tokens[0]).toEqual({
		type: TokenType.NUMBER,
		value: '1',
		line: 1,
		position: 1,
		end: true
	});
});