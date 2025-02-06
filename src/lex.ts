"use strict";

import {Lexer} from "./lexer/Lexer";
import {TokenStream} from "./types/token-stream";

export default function lex(text: string): TokenStream {
    return (new Lexer()).tokenize(text);
}
