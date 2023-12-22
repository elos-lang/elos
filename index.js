"use strict";

import fs from "fs";
import lex from "./src/lex.js";
import parse from "./src/parse.js";
import compile from "./src/compile.js";

const code = fs.readFileSync('./example/primitives.elos', 'utf8');

const tokens = lex(code);
const ast = parse(tokens);
const output = compile(ast);

fs.writeFileSync('./example/primitives.html', output);
