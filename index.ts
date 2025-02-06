import * as fs from "fs";
import lex from "./src/lex";
import parse from "./src/parse";
import compile from "./src/compile";

const code = fs.readFileSync('./example/test.elos', 'utf8');

const tokens = lex(code);
const ast = parse(tokens);
const output = compile(ast);

fs.writeFileSync('./example/test.html', output);