import Lexer from "../src/lexer/Lexer";
import {TokenType} from "../src/types/token-type";

const makeLexer = () => {
	return new Lexer();
};

test('whitespace (non-)tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('  	');

	expect(tokens.length).toEqual(0);
});

test('whitespace (non-)tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize(' something 	 something		');

	expect(tokens.length).toEqual(2);
});

test('comment (non-)tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('// ignore');

	expect(tokens.length).toEqual(0);
});

test('comment (non-)tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize(`
ident
// ignore this comment
"123"
// another example
// of a multiline comment
identifier
	`);

	expect(tokens.length).toEqual(3);

	expect(tokens[1]).toEqual({
		type: TokenType.STRING,
		value: '123',
		line: 4,
		position: 1,
		end: false
	});

	expect(tokens[2]).toEqual({
		type: TokenType.IDENT,
		value: 'identifier',
		line: 7,
		position: 1,
		end: false
	});
});

test('ident tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('ident');

	expect(tokens[0]).toEqual({
		type: TokenType.IDENT,
		value: 'ident',
		line: 1,
		position: 1,
		end: true
	});
});

test('ident tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('ident random');

	expect(tokens[1]).toEqual({
		type: TokenType.IDENT,
		value: 'random',
		line: 1,
		position: 7,
		end: true
	});
});

test('ident tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('ident ident random');

	expect(tokens[1]).toEqual({
		type: TokenType.IDENT,
		value: 'ident',
		line: 1,
		position: 7,
		end: false
	});

	expect(tokens[2]).toEqual({
		type: TokenType.IDENT,
		value: 'random',
		line: 1,
		position: 13,
		end: true
	});
});

test('symbol tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('{');

	expect(tokens[0]).toEqual({
		type: TokenType.SYMBOL,
		value: '{',
		line: 1,
		position: 1,
		end: true
	});
});

test('symbol tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize(`.!?,;:()-+=%*/–-…{}$><&#@`);

	expect(tokens.length).toEqual(25);

	expect(tokens[0]).toEqual({
		type: TokenType.SYMBOL,
		value: '.',
		line: 1,
		position: 1,
		end: false
	});

	expect(tokens[4]).toEqual({
		type: TokenType.SYMBOL,
		value: ';',
		line: 1,
		position: 5,
		end: false
	});

	expect(tokens[4]).toEqual({
		type: TokenType.SYMBOL,
		value: ';',
		line: 1,
		position: 5,
		end: false
	});

	expect(tokens[24]).toEqual({
		type: TokenType.SYMBOL,
		value: '@',
		line: 1,
		position: 25,
		end: true
	});
});

test('symbol tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('"123" { "another string"');

	expect(tokens[1]).toEqual({
		type: TokenType.SYMBOL,
		value: '{',
		line: 1,
		position: 7,
		end: false
	});
});

test('symbol tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('ident } "another string"');

	expect(tokens[1]).toEqual({
		type: TokenType.SYMBOL,
		value: '}',
		line: 1,
		position: 7,
		end: false
	});
});

test('string tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('"a random string"');

	expect(tokens[0]).toEqual({
		type: TokenType.STRING,
		value: 'a random string',
		line: 1,
		position: 1,
		end: true
	});
});

test('string tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('"123" "456" "789"');

	expect(tokens[1]).toEqual({
		type: TokenType.STRING,
		value: '456',
		line: 1,
		position: 7,
		end: false
	});
});

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
	const tokens = lexer.tokenize('"123" $var $anotherVariable');

	expect(tokens[2]).toEqual({
		type: TokenType.VAR,
		value: 'anotherVariable',
		line: 1,
		position: 12,
		end: true
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

test('color tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('#f0f0f0');

	expect(tokens[0]).toEqual({
		type: TokenType.COLOR,
		value: 'f0f0f0',
		line: 1,
		position: 1,
		end: true
	});
});

test('color tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('#FFFFFF');

	expect(tokens[0]).toEqual({
		type: TokenType.COLOR,
		value: 'FFFFFF',
		line: 1,
		position: 1,
		end: true
	});
});

test('color tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('#F14000');

	expect(tokens[0]).toEqual({
		type: TokenType.COLOR,
		value: 'F14000',
		line: 1,
		position: 1,
		end: true
	});
});

test('color tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('ident #F14000');

	expect(tokens[1]).toEqual({
		type: TokenType.COLOR,
		value: 'F14000',
		line: 1,
		position: 7,
		end: true
	});
});

test('color tokenization', () => {
	const lexer = makeLexer();
	const tokens = lexer.tokenize('ident #F14000 #000000');

	expect(tokens[2]).toEqual({
		type: TokenType.COLOR,
		value: '000000',
		line: 1,
		position: 15,
		end: true
	});
});