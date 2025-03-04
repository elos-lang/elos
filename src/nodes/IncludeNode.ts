import * as fs from "node:fs";
import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";
import parseBody from "../parser/helpers/parse-body";
import parseHead from "../parser/helpers/parse-head";
import compilerHelpers from "../compiler/helpers/compile-with-vgap";
import AstNode from "../parser/AstNode";
import {Manager} from "../events/Manager";
import {EventId} from "../types/event-id";
import ExpressionNode from "./ExpressionNode";
import Lexer from "../lexer/Lexer";
import expressionCompiler from "../compiler/helpers/compile-expression-into-value";

export default class IncludeNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'include')) {
            parser.advance();
            parser.insert(new IncludeNode());
            parser.traverseUp();

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('fileName');

            parser.traverseDown();
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        // Compile fileName expression
        const file = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('fileName') as ExpressionNode);

        const path = compiler.get('path');
        const filename = `${path}/${file}.elos`;
        const code = fs.readFileSync(filename, 'utf8');

        // Emit FILE_TOUCH event
        Manager.emit(EventId.FILE_TOUCH, {
            filename,
        });

        // Lex
        const tokens = (new Lexer()).tokenize(code);

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
