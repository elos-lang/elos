import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class RawNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithVal(TokenType.IDENT, 'raw')) {
            parser.advance();

            parser.expect(TokenType.STRING);
            let textValue = parser.getCurrVal();
            parser.advance();

            parser.insert(new RawNode(textValue));
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        compiler.writeLn(this.getVal());
    }
}
