import Node from "../Node";
import Parser from "../Parser";
import {TokenType} from "../../types/token-type";

export default class ArrowNode extends Node {

	static parse(parser: Parser): boolean {
		if (
			parser.acceptWithVal(TokenType.SYMBOL, '-')
		) {
			parser.expectAtWithVal(TokenType.SYMBOL, 1, '>');
			parser.advance(2);
			return true;
		}

		return false;
	}
}
