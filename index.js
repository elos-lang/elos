"use strict";

import fs from "fs";
import lex from "./src/lex.js";
import parse from "./src/parse.js";
import compile from "./src/compile.js";

let code = fs.readFileSync('./example/test.elos', 'utf8');

let tokens = lex(code);
let ast = parse(tokens);
let output = compile(ast);

fs.writeFileSync('./example/test.html', output);
