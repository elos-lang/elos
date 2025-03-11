import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class";
import styleCompiler from "../parser/helpers/compile-style-attrs";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class LineNode extends Node {

  static parse(parser: Parser): boolean {
    if (parser.acceptWithValue(TokenType.IDENT, "line")) {
      parser.advance();
      parser.insert(new LineNode());
      parser.traverseUp();

      let className = parseClass(parser);
      if (className) {
        parser.setAttribute('className', className);
      }

      parser.traverseDown();
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

    compiler.writeLineToBody(
      `<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`
    );
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td style="${cssString}"></td>`);
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
  }
}
