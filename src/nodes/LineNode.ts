import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class.js";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import {Nullable} from "../types/nullable";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";

export default class LineNode extends Node {

  private className: Nullable<string>;

  constructor(value: string, className: string = null) {
    super(value);
    this.className = className;
  }

  static parse(parser: Parser): boolean {
    if (parser.acceptWithVal(TokenType.IDENT, "line")) {
      parser.advance();
      let className = parseClass(parser);
      parser.insert(new LineNode("", className));
      return true;
    }

    return false;
  }

  compile(compiler) {
    const width = parseInt(compiler.variable("width"));

    const css = styleCompiler.compileStyleAttrs(
      compiler,
      "line",
      this.className,
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
