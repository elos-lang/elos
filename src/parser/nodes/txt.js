"use strict";

import Node from "../node.js";

export default class Txt extends Node {

    static name = 'txt';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'txt')) {
            parser.advance();

            while (
                parser.skip('newline') ||
                parser.skip('whitespace')
            );

            parser.expect('string');
            parser.insert(new Txt(parser.getCurrVal()));
            parser.advance();

            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.write(`<h1>${this.getVal()}</h1>`);
    }
}
