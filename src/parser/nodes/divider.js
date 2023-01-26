"use strict";

import Node from "../node.js";

export default class Divider extends Node {

    static name = 'divider';

    static parse(parser) {

        if (parser.acceptWithVal('symbol', '-')) {
            parser.advance();
            parser.insert(new Divider());
            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.write('<hr />');
    }
}
