import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import ArgumentNode from "./ArgumentNode";
import grammar from "../grammar";

export default class ArgumentListNode extends Node {

    static parse(parser: Parser): boolean {
        if (parser.skipWithValue(TokenType.SYMBOL, grammar.ARG_LIST_OPEN_SYMBOL)) {

            parser.insert(new ArgumentListNode());
            parser.traverseUp();

            this.parseArgumentNodes(parser);

            if (parser.skipWithValue(TokenType.SYMBOL, grammar.ARG_LIST_CLOSE_SYMBOL)) {
                parser.traverseDown();
            }

            return true;
        }

        return false;
    }

    private static parseArgumentNodes(parser: Parser) {
        if (ArgumentNode.parse(parser)) {
            if (parser.skipWithValue(TokenType.SYMBOL, ',')) {
                this.parseArgumentNodes(parser);
            }
        }
    }
}
