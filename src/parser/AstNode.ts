import Node from "./Node";
import Compiler from "../compiler/Compiler";
import Parser from "./Parser";
import DefNode from "../nodes/DefNode";
import StyleNode from "../nodes/StyleNode";
import IncludeNode from "../nodes/IncludeNode";
import BodyNode from "../nodes/BodyNode";

export default class AstNode extends Node {

    static parse(parser: Parser): boolean {

        while (
            DefNode.parse(parser) ||
            StyleNode.parse(parser) ||
            IncludeNode.parse(parser)
        );

        if (BodyNode.parse(parser)) {
            parser.advance();
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        this.getChildren().forEach(child => child.compile(compiler));
    }
}
