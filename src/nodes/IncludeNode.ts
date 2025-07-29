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
import ArgumentListNode from "./ArgumentListNode";
import ArgumentNode from "./ArgumentNode";
import grammar from "../grammar";

export default class IncludeNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, grammar.INCLUDE_NODE_KEYWORD)) {
            parser.advance();
            parser.insert(new IncludeNode());
            parser.traverseUp();

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('fileName');

            if (ArgumentListNode.parse(parser)) {
                parser.setAttribute('argumentList');
            }

            parser.traverseDown();
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        const argumentListNode = this.getAttribute('argumentList');
        let argumentNodes: ArgumentNode[] = [];

        if (argumentListNode instanceof ArgumentListNode) {
            argumentNodes = argumentListNode.getChildren() as ArgumentNode[];
        }

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

        // Define locale variables
        argumentNodes.forEach((argNode) => {
            const compiledValue = expressionCompiler.compileExpressionIntoValue(compiler, argNode.getAttribute('value') as ExpressionNode);
            clonedCompiler.defineLocal(argNode.getVariableName(), compiledValue);
        });

        // Check if include is being used in the root (AstNode)
        if (this.getParent() instanceof AstNode) {
            clonedCompiler.compile(ast);
        } else {
            // Nope, so we compile it with vgap
            compilerHelpers.compileWithVgap(clonedCompiler, ast.getChildren());
        }

        compiler.import(clonedCompiler);

        compiler.writeHead(clonedCompiler.getHead());
        compiler.write(clonedCompiler.getBody());

        compiler.flushLocalVariables();
    }
}
