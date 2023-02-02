"use strict";

import Node from "../node.js";

export default class StyleProperty extends Node {

    static name = 'style-property';

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
                parser.insert(new StyleProperty(property, value));

                return true;
            }
        }

        return false;
    }

    compile(compiler) {

        const parent = this.getParent();
        const name = parent.getVal();
        const style = (parent.isClass ? compiler.get('classes') : compiler.get('identStyles'));

        if (! style[name]) {
            style[name] = [];
        }

        style[name] = [...style[name], [this.property, this.getVal()]];
    }
}
