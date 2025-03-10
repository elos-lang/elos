import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";
import ExpressionNode from "./ExpressionNode";
import expressionCompiler from "../compiler/helpers/compile-expression-into-value";

export default class DefNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'def')) {
            parser.advance();

            const defNode = new DefNode();

            parser.insert(defNode);
            parser.traverseUp();

            if (parser.expect(TokenType.VAR)) {
                defNode.setValue(parser.getCurrentValue());
                parser.advance();
            }

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('value');

            parser.traverseDown();
            return true;
        }

        return false;

        /*
        if (parser.acceptWithValue(TokenType.IDENT, 'def')) {
            parser.advance();

            if (parser.expect(TokenType.VAR)) {

                let defName = parser.getCurrentValue();
                parser.advance();

                if (parser.accept(TokenType.STRING) || parser.accept(TokenType.NUMBER)) {
                    parser.insert(new DefNode(defName, parser.getCurrentValue()));
                    parser.advance();

                    return true;
                }
            }
        }

        return false;*/
    }

    public getVariableName(): string {
        return this.getValue();
    }

    compile(compiler: Compiler) {
        const value = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('value') as ExpressionNode);

        compiler.define(this.getVariableName(), value);
    }
}
