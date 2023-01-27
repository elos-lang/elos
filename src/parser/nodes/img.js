"use strict";

import Node from "../node.js";

export default class Img extends Node {

    static name = 'img';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'img')) {
            parser.advance();

            parser.expect('string');
            parser.insert(new Img(parser.getCurrVal()));
            parser.advance();

            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.writeLn(`<img src="${this.getVal()}" style="display:block;width:100%;"/>`);
    }
}
