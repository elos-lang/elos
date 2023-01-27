"use strict";

import Node from "../node.js";

export default class Txt extends Node {

    static name = 'txt';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'txt')) {
            parser.advance();

            parser.expect('string');
            parser.insert(new Txt(parser.getCurrVal()));
            parser.advance();

            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.writeLn(`<div>${this.getVal()}</div>`);
    }
}
