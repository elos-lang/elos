"use strict";

import Parser from "./parser/parser.js";

export default function parse(tokens) {
    let parser = new Parser();
    return parser.parse(tokens);
}
