"use strict";

export default class Compiler {

    constructor() {
        this.output = '';
    }

    write(string) {
        this.output += string;
    }

    compile(ast) {
        ast.compile(this);
        return this.output;
    }
}
