import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";
import ExpressionNode from "./ExpressionNode";

export default class ArgumentNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.accept(TokenType.VAR)) {

            parser.insert(new ArgumentNode(parser.getCurrentValue()));
            parser.advance();
            parser.traverseUp();

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('value');

            parser.traverseDown();

            return true;
        }

        return false;
    }

    public getVariableName(): string {
        return this.getValue();
    }

    compile(compiler: Compiler) {
        /*
        const value = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('value') as ExpressionNode);

        compiler.define(this.getVariableName(), value);
        */
    }
}
