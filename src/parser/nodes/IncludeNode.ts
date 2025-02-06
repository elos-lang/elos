import Node from "../Node";
import Parser from "../Parser";
import {TokenType} from "../../types/token-type";
import lex from "../../lex";
import * as fs from "node:fs";
import Compiler from "../../compiler/Compiler";
import parseBody from "../helpers/parse-body";
import parseHead from "../helpers/parse-head";
import compilerHelpers from "../../compiler/helpers/compile-with-vgap";

export default class IncludeNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithVal(TokenType.IDENT, 'include')) {
            parser.advance();

            parser.expect(TokenType.STRING);
            let textValue = parser.getCurrVal();
            parser.insert(new IncludeNode(textValue));

            parser.advance();

            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        const code = fs.readFileSync(`./example/${this.getVal()}.elos`, 'utf8');

        // Lex
        const tokens = lex(code);

        // Parse
        const parser = new Parser();
        parser.setTokenStream(tokens);

        parseHead(parser);
        parseBody(parser);

        const ast = parser.getAst();
        ast.setParent(this.getParent());

        // Compile
        const clonedCompiler = compiler.clone();
        compilerHelpers.compileWithVgap(clonedCompiler, ast.getChildren());
        compiler.setMemory(clonedCompiler.getMemory());

        compiler.writeHead(clonedCompiler.getHead());
        compiler.write(clonedCompiler.getBody());
    }
}
