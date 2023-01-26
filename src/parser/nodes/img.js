"use strict";

import Node from "../node.js";

export default class Img extends Node {

    static name = 'img';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'img')) {
            parser.advance();

            while (
                parser.skip('newline') ||
                parser.skip('whitespace')
            );

            parser.expect('string');
            parser.insert(new Img(parser.getCurrVal()));
            parser.advance();

            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.write(`<img src="${this.getVal()}"/>`);
    }
}
