"use strict";

import Node from "../node.js";
import Body from "./body.js";
import Def from "./def.js";

export default class All extends Node {

    static name = 'all';

    static parse(parser) {

        while (Def.parse(parser));

        if (Body.parse(parser)) {
            parser.advance();
            return true;
        }

        return false;
    }

    compile(compiler) {
        //
    }
}
