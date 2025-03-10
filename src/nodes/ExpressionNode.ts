import Node from "../parser/Node";
import ColorPrimitiveNode from "./primitives/ColorPrimitiveNode";
import StringPrimitiveNode from "./primitives/StringPrimitiveNode";
import Parser from "../parser/Parser";
import Compiler from "../compiler/Compiler";
import VariablePrimitiveNode from "./primitives/VariablePrimitiveNode";
import OperatorNode from "./OperatorNode";
import NumberPrimitiveNode from "./primitives/NumberPrimitiveNode";

export default class ExpressionNode extends Node {

    static parse(parser: Parser): boolean {
        if (
            NumberPrimitiveNode.parse(parser) ||
            VariablePrimitiveNode.parse(parser) ||
            ColorPrimitiveNode.parse(parser) ||
            StringPrimitiveNode.parse(parser)
        ) {
            // If we're not in an ExpressionNode yet, wrap it into one
            if (parser.getScope().getName() !== this.name) {
                parser.wrap(new ExpressionNode());
            }

            if (OperatorNode.parse(parser)) {
                if (! this.parse(parser)) {
                    throw new Error('Unexpected token '+parser.getCurrentToken().type);
                }
            } else {
                // Get out of the expression
                parser.traverseDown();
            }

            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        this.getChildren().forEach((child, i) => {
            child.compile(compiler);
        });
    }
}
