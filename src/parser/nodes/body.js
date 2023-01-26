"use strict";

import Node from "../node.js";
import Img from "./img.js";
import Divider from "./divider.js";
import Txt from "./txt.js";

export default class Body extends Node {

    static name = 'body';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'body')) {

            parser.advance();
            parser.skip('whitespace');

            if (parser.acceptWithVal('symbol','[')) {
                parser.advance();

                parser.insert(new Body());
                parser.in();

                while (
                    parser.skip('newline') ||
                    parser.skip('whitespace') ||
                    Img.parse(parser) ||
                    Divider.parse(parser) ||
                    Txt.parse(parser)
                );

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
        compiler.write('<body>')
        this.getChildren().forEach(child => compiler.compile(child));
        compiler.write('</body>');
    }
}
