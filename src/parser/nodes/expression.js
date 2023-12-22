"use strict";

import Node from "../node.js";
import Color from "./primitives/color.js";
import String from "./primitives/string.js";

export default class Expression extends Node {

    static name = 'expression';

    static parse(parser) {

        if (
            Color.parse(parser) ||
            String.parse(parser)
        ) {
            if (parser.getScope().getName() !== this.name) {
                parser.wrap(new Expression());
            }

            parser.traverseDown();
            return true;
        }

        return false
    }

    compile(compiler) {
        this.getChildren().forEach((child, i) => {
            child.compile(compiler);
        });
    }
}
