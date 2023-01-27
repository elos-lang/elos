"use strict";

import fs from "fs";
import lex from "./src/lex.js";
import parse from "./src/parse.js";
import compile from "./src/compile.js";

let code = fs.readFileSync('./test-example.elos', 'utf8');
let tokens = lex(code);
console.log(tokens);
let ast = parse(tokens);
let output = compile(ast);

fs.writeFileSync('./test-example.html', output);
