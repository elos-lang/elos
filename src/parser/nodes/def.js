"use strict";

import Node from "../node.js";

export default class Def extends Node {

    static name = 'def';

    constructor(defName, value) {
        super(value);

        this.defName = defName;
    }

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'def')) {
            parser.advance();

            if (parser.accept('ident')) {
                let defName = parser.getCurrVal();
                parser.advance();

                if (parser.accept('string') || parser.accept('number')) {
                    parser.insert(new Def(defName, parser.getCurrVal()));
                    parser.advance();

                    return true;
                }
            }

        }

        return false;
    }

    compile(compiler) {
        compiler.define(this.defName, this.getVal());
    }
}
