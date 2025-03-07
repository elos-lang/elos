import {TokenStream} from "../../src/types/token-stream";
import {Token} from "../../src/types/token";
import {TokenType} from "../../src/types/token-type";

export default {
	wrapInBody(tokens: Token[]): TokenStream {
		return [
			{
				value: 'body',
				type: TokenType.IDENT,
				line: 1,
				position: 1,
				end: false,
			},
			{
				value: '{',
				type: TokenType.SYMBOL,
				line: 1,
				position: 1,
				end: false,
			},
			...tokens,
			{
				value: '}',
				type: TokenType.SYMBOL,
				line: 1,
				position: 1,
				end: true,
			},
		];
	}
};
