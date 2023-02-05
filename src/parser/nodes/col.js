"use strict";

import Node from "../node.js";
import parseAll from "../helpers/parse-all.js";
import compilerHelpers from "../../compiler/helpers/compile-with-vgap.js";
import config from "../../grammar.js";

export default class Col extends Node {

    static name = 'col';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'col')) {
            parser.advance();

            if (parser.acceptWithVal('symbol', config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new Col());
                parser.in();

                parseAll(parser);

                if (parser.acceptWithVal('symbol',config.BLOCK_CLOSE_SYMBOL)) {
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
