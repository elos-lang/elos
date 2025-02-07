import * as fs from "node:fs";
import Node from "../Node";
import Parser from "../Parser";
import {TokenType} from "../../types/token-type";
import lex from "../../lex";
import Compiler from "../../compiler/Compiler";
import parseBody from "../helpers/parse-body";
import parseHead from "../helpers/parse-head";
import compilerHelpers from "../../compiler/helpers/compile-with-vgap";
import AstNode from "../AstNode";
import {Manager} from "../../events/Manager";
import {EventId} from "../../types/event-id";

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

        const path = compiler.get('path');
        const filename = `${path}/${this.getVal()}.elos`;
        const code = fs.readFileSync(filename, 'utf8');

        // Emit FILE_TOUCH event
        Manager.emit(EventId.FILE_TOUCH, {
            filename,
        });

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

        // Check if include is being used in the root (AstNode)
        if (this.getParent() instanceof AstNode) {
            clonedCompiler.compile(ast);
        } else {
            // Nope, so we compile it with vgap
            compilerHelpers.compileWithVgap(clonedCompiler, ast.getChildren());
        }

        compiler.setMemory(clonedCompiler.getMemory());

        compiler.writeHead(clonedCompiler.getHead());
        compiler.write(clonedCompiler.getBody());
    }
}
