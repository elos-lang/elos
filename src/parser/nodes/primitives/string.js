"use strict";

import Node from "../../node.js";

export default class String extends Node {

    static name = 'string';

    static parse(parser) {

        if (parser.accept('string')) {
            parser.insert(new String(parser.getCurrVal()));
            parser.advance();
            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.write(this.value);
    }
}
