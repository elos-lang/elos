"use strict";

import Node from "../node.js";
import parseAll from "../helpers/parse-all.js";

export default class Col extends Node {

    static name = 'col';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'col')) {
            parser.advance();

            if (parser.acceptWithVal('symbol','[')) {
                parser.advance();

                parser.insert(new Col());
                parser.in();

                parseAll(parser);

                if (parser.acceptWithVal('symbol',']')) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }

        }

        return false;
    }

    compile(compiler) {
        this.getChildren().forEach(child => {
            child.compile(compiler);
        });
    }
}
