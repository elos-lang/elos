"use strict";

import Node from "../../parser/Node";
import {TokenType} from "../../types/token-type";
import Parser from "../../parser/Parser";

export default class StringPrimitiveNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.accept(TokenType.STRING)) {
            parser.insert(new StringPrimitiveNode(parser.getCurrVal()));
            parser.advance();
            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.write(this.value);
    }
}
