import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class OperatorNode extends Node {

  static parse(parser: Parser): boolean {
    if (parser.skipWithVal(TokenType.SYMBOL, '+')) {
      parser.insert(new OperatorNode('+'));
      return true;
    }

    return false;
  }

  compile(compiler: Compiler) {
    //
  }
}
