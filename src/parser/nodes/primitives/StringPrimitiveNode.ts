"use strict";

import Node from "../../Node";
import {TokenType} from "../../../types/token-type";
import Parser from "../../Parser";

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
