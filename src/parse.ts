"use strict";

import Parser from "./parser/Parser.js";
import {TokenStream} from "./types/token-stream";

export default function parse(tokens: TokenStream) {
    return (new Parser()).parse(tokens);
}
