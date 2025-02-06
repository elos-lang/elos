import * as fs from "fs";
import {lex, parse, compile} from "../dist/index.js";

const code = fs.readFileSync('./example/index.elos', 'utf8');

const tokens = lex(code);
const ast = parse(tokens);
const output = compile(ast);

fs.writeFileSync('./example/index.html', output);