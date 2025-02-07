import { dirname } from 'path';
import * as fs from "fs";
import { Elos } from "../dist/index.js";

const filename = './example/index.elos';
const path = dirname(filename);
const code = fs.readFileSync(filename, 'utf8');

Elos.on('fileTouch', (data) => {
	console.log(data);
});

fs.writeFileSync(`${path}/index.html`, Elos.make(code, path));