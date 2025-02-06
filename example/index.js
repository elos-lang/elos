import * as fs from "fs";
import {lex, parse, compile} from "../dist/index.js";

const code = fs.readFileSync('./example/test.elos', 'utf8');

const tokens = lex(code);
const ast = parse(tokens);
const output = compile(ast);

fs.writeFileSync('./example/test.html', output);