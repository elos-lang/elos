"use strict";

import fs from "fs";
import lex from "./src/lex.js";
import parse from "./src/parse.js";
import compile from "./src/compile.js";

fs.readFile('./test-example.elos', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let tokens = lex(data);
    //console.log(tokens);

    let ast = parse(tokens);

    let output = compile(ast);

    fs.writeFile('./test-example.html', output, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
    });
});
