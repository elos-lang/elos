"use strict";

import Node from "../../parser/Node";
import {TokenType} from "../../types/token-type";
import Parser from "../../parser/Parser";
import Compiler from "../../compiler/Compiler";

export default class VariablePrimitiveNode extends Node {

	static parse(parser: Parser): boolean {

		if (parser.accept(TokenType.NUMBER)) {
			parser.insert(new VariablePrimitiveNode(parser.getCurrVal()));
			parser.advance();
			return true;
		}

		return false;
	}

	compile(compiler: Compiler) {
		compiler.write(this.value);
	}
}
