#!/usr/bin/env node

import fs from 'fs';
import path, {dirname} from 'path';
import { Elos } from '../dist/index.js';

const args = process.argv.slice(2);
if (args.length < 1) {
	console.error('Usage: elos <input-file> [output-file]');
	process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || null;
const filename = path.resolve(inputFile);
const filepath = dirname(filename);

if (!fs.existsSync(filename)) {
	console.error(`Error: File not found: ${inputFile}`);
	process.exit(1);
}

const code = fs.readFileSync(filename, 'utf-8');
const output = Elos.make(code, filepath);

if (outputFile) {
	fs.writeFileSync(outputFile, output, 'utf-8');
	console.log(`Output written to ${outputFile}`);
} else {
	process.stdout.write(output);
}