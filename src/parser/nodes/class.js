"use strict";

import Node from "../node.js";
import ClassProperty from "./class-property.js";

export default class Class extends Node {

    static name = 'class';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'class')) {
            parser.advance();

            parser.expect('ident');
            let className = parser.getCurrVal();
            parser.advance();

            if (parser.acceptWithVal('symbol','[')) {
                parser.advance();

                parser.insert(new Class(className));
                parser.in();
            }

            while (ClassProperty.parse(parser));

            if (parser.acceptWithVal('symbol',']')) {
                parser.out();
                parser.advance();
            }

            return true;
        }

        return false;
    }

    compile(compiler) {
        this.getChildren().forEach(child => {
            child.compile(compiler);
        });
    }
}
