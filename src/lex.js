"use strict";

import Lexer from "./lexer/lexer.js";

export default function lex(text) {
    const lexer = new Lexer();
    return lexer.tokenize(text);
}
