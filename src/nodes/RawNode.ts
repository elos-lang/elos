import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";
import ExpressionNode from "./ExpressionNode";

export default class RawNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'raw')) {
            parser.advance();
            parser.insert(new RawNode());
            parser.traverseUp();

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('expression');

            parser.traverseDown();
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        (this.getAttribute('expression') as ExpressionNode).compile(compiler);
    }
}
