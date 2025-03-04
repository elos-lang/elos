"use strict";

import Node from "../parser/Node";
import parseBody from "../parser/helpers/parse-body";
import compilerHelpers from "../compiler/helpers/compile-with-vgap.js";
import config from "../grammar.js";
import {TokenType} from "../types/token-type";
import Parser from "../parser/Parser";

export default class ColNode extends Node {

    static parse(parser: Parser) {

        if (parser.acceptWithValue(TokenType.IDENT, 'col')) {
            parser.advance();

            if (parser.acceptWithValue(TokenType.SYMBOL, config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new ColNode());
                parser.in();

                parseBody(parser);

                if (parser.acceptWithValue(TokenType.SYMBOL, config.BLOCK_CLOSE_SYMBOL)) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }

        }

        return false;
    }

    compile(compiler) {
        compilerHelpers.compileWithVgap(compiler, this.getChildren());
    }
}
