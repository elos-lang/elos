"use strict";

import Node from "../node.js";

export default class ClassProperty extends Node {

    static name = 'class-property';

    constructor(property, value) {
        super(value);
        this.property = property;
    }

    static parse(parser) {

        if (parser.accept('ident')) {
            let property = parser.getCurrVal();
            parser.advance();

            if (parser.accept('number') || parser.accept('string')) {
                let value = parser.getCurrVal();
                parser.advance();
                parser.insert(new ClassProperty(property, value));

                return true;
            }
        }

        return false;
    }

    compile(compiler) {

        const className = this.getParent().getVal();
        const classes = compiler.get('classes');

        if (! classes[className]) {
            classes[className] = [];
        }
        classes[className] = [...classes[className], [this.property, this.getVal()]];
    }
}
