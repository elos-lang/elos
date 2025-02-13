import {Lexer} from "../src/lexer/Lexer";
import {TokenType} from "../src/types/token-type";

const makeLexer = () => {
	return new Lexer();
};

test('var tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('"a random string" $some_VariableName "a random string" 5');

	expect(tokens[1]).toEqual({
		type: TokenType.VAR,
		value: 'some_VariableName',
		line: 1,
		position: 19,
		end: false
	});
});

test('var tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('$some_VariableName');

	expect(tokens[0]).toEqual({
		type: TokenType.VAR,
		value: 'some_VariableName',
		line: 1,
		position: 1,
		end: true
	});
});

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