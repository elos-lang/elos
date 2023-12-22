"use strict";

import Node from "../../node.js";

export default class Color extends Node {

    static name = 'color';

    static parse(parser) {

        if (
            parser.acceptWithVal('symbol', '#')
        ) {
            parser.insert(new Color('kleurtje'));
            parser.advance(6);
            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.write(this.value);
    }
}
