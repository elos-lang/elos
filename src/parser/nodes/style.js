"use strict";

import Node from "../node.js";
import StyleProperty from "./style-property.js";
import parseClass from "../helpers/parse-class.js";
import config from "../../config.js";

export default class Style extends Node {

    static name = 'style';

    constructor(name, isClass = false) {
        super(name);
        this.isClass = isClass;
    }

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'style')) {
            parser.advance();

            let className = parseClass(parser);
            let isClass = true;

            if (className === null) {
                if (parser.accept('ident')) {
                    className = parser.getCurrVal();
                    isClass = ! isClass;
                    parser.advance();
                }
            }

            if (parser.acceptWithVal('symbol', config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new Style(className, isClass));
                parser.in();
            }

            while (StyleProperty.parse(parser));

            if (parser.acceptWithVal('symbol', config.BLOCK_CLOSE_SYMBOL)) {
                parser.out();
                parser.advance();
            }

            return true;
        }

        return false;
    }

    compile(compiler) {
        this.getChildren().forEach(child => child.compile(compiler));
    }
}
