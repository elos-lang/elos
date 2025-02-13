import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class.js";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class LineNode extends Node {

  static parse(parser: Parser): boolean {
    if (parser.acceptWithVal(TokenType.IDENT, "line")) {
      parser.advance();
      let className = parseClass(parser);

      const lineNode = new LineNode();

      if (className) {
        lineNode.setAttribute('className', className);
      }

      parser.insert(lineNode);
      return true;
    }

    return false;
  }

  compile(compiler: Compiler) {

    const className = this.getAttribute('className') as string || null;
    const width = parseInt(compiler.variable("width") as string);

    const css = styleCompiler.compileStyleAttrs(
      compiler,
      "line",
      className,
      {
        height: "2px",
        "background-color": "#000000",
      }
    );

    const cssString = styleCompiler.attrsToCssString(css);

    compiler.writeLn(
      `<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`
    );
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td style="${cssString}"></td>`);
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
  }
}
