"use strict";

import Node from "./node.js";

export default class Ast extends Node {

    compile(compiler) {
        this.getChildren().forEach(child => child.compile(compiler));
    }
}
