"use strict";

import Node from "../node.js";
import Body from "./body.js";
import Img from "./img.js";

export default class All extends Node {

    static name = 'all';

    static parse(parser) {

        if (Body.parse(parser)) {
            parser.advance();
            return true;
        }

        while (parser.skip('newline') || parser.skip('whitespace'));
        Img.parse(parser);
        while (parser.skip('newline') || parser.skip('whitespace'));

        return false;
    }

    compile(compiler) {
        //
    }
}
