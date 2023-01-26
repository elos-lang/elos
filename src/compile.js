"use strict";

import Compiler from "./compiler/compiler.js";

export default function compile(ast) {
    let compiler = new Compiler();
    return compiler.compile(ast);
}
