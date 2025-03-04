"use strict";

import Node from "../../parser/Node";
import {TokenType} from "../../types/token-type";
import Parser from "../../parser/Parser";
import Compiler from "../../compiler/Compiler";

export default class StringPrimitiveNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.accept(TokenType.STRING)) {
            parser.insert(new StringPrimitiveNode(parser.getCurrentValue()));
            parser.advance();
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        compiler.write(this.value);
    }
}
