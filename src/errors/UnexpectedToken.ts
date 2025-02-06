import {Token} from "../types/token";
import {TokenType} from "../types/token-type";
import {Nullable} from "../types/nullable";

export default class UnexpectedToken extends Error {
	constructor(expected: Nullable<TokenType>, got: Token) {

		if (! expected) {
			super(`Unexpected token ${got.type}(${got.value}) at line ${got.line},${got.position}`);
		} else {
			super(`Expected a token with type ${expected ?? 'unknown'}, got ${got.type}(${got.value}) at line ${got.line},${got.position}`);
		}

		this.name = "UnexpectedToken";
	}
}