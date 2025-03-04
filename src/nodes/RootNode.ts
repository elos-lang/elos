import Node from "../parser/Node";
import BodyNode from "./BodyNode";
import DefNode from "./DefNode";
import StyleNode from "./StyleNode";
import Parser from "../parser/Parser";
import IncludeNode from "./IncludeNode";
import Compiler from "../compiler/Compiler";

export default class RootNode extends Node {

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
        //
    }
}
