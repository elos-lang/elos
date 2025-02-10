var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Elos: () => Elos,
  compile: () => compile,
  lex: () => lex,
  parse: () => parse
});
module.exports = __toCommonJS(index_exports);

// src/compiler/Compiler.ts
var Compiler = class _Compiler {
  head = "";
  body = "";
  memory = {
    path: "",
    variables: {
      preview: "",
      edge: 35,
      hgap: 10,
      vgap: 10,
      bgcolor: "#ffffff",
      width: 650
    },
    colsId: 0,
    imgId: 0,
    classes: {},
    identStyles: {}
  };
  constructor(memory = {}) {
    Object.assign(this.memory, memory);
  }
  getMemory() {
    return this.memory;
  }
  setMemory(memory) {
    this.memory = memory;
  }
  write(string) {
    this.body += string;
  }
  writeLn(string) {
    this.write("\n" + string);
  }
  writeHead(string) {
    this.head += string;
  }
  writeLnHead(string) {
    this.writeHead("\n" + string);
  }
  define(name, value) {
    this.memory.variables[name] = value;
    return value;
  }
  variable(name) {
    return typeof this.memory.variables[name] === "undefined" ? null : this.memory.variables[name];
  }
  remember(name, value) {
    this.memory[name] = value;
    return value;
  }
  get(name) {
    return typeof this.memory[name] === "undefined" ? null : this.memory[name];
  }
  getHead() {
    return this.head;
  }
  getBody() {
    return this.body;
  }
  clone() {
    return new _Compiler(this.memory);
  }
  compile(ast) {
    ast.compile(this);
    return `
            <!doctype html>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <!--[if !mso]><!-->
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <!--<![endif]-->
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style type="text/css">
                          * { padding: 0; margin: 0; }
                          #outlook a { padding:0; }
                          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
                          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
                          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
                          p { display:block;margin:13px 0; }
                        </style>
                    ${this.getHead()}
                </head>
                <body bgcolor="${this.variable("bgcolor")}">
                    ${this.getBody()}
                </body>
            </html>
        `;
  }
};

// src/grammar.ts
var grammar_default = {
  REGEX_IDENT: /[a-zA-ZÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]/,
  REGEX_NUMBER: /\d/,
  REGEX_SYMBOL: /[.!?,;:()\-+=%*\\/—–…${}><&#@°]/,
  REGEX_WHITESPACE: /\s/,
  REGEX_NEWLINE: /[\n\r]/,
  REGEX_STRING_DELIMITER: /["']/,
  BLOCK_OPEN_SYMBOL: "{",
  BLOCK_CLOSE_SYMBOL: "}"
};

// src/lexer/Lexer.ts
var Lexer = class {
  /**
   *
   * @private
   */
  mode = 0 /* ALL */;
  /**
   *
   * @private
   */
  cursor = 0;
  /**
   *
   * @private
   */
  end = 0;
  /**
   *
   * @private
   */
  line = 1;
  /**
   *
   * @private
   */
  column = 1;
  /**
   *
   * @private
   */
  tokens = [];
  /**
   *
   * @private
   */
  value = "";
  /**
   *
   * @private
   */
  character = "";
  /**
   *
   * @private
   */
  nextCharacter = "";
  /**
   *
   * @private
   */
  delimiter = "";
  /**
   * Transforms code into a TokenStream
   * @param text
   */
  tokenize(text) {
    this.end = text.length;
    while (this.cursor < this.end) {
      this.character = text[this.cursor];
      this.nextCharacter = text[this.cursor + 1] || null;
      if (this.mode === 0 /* ALL */) {
        this.mode = this.determineMode();
      }
      switch (this.mode) {
        case 7 /* STRING */:
          this.lexString();
          break;
        case 2 /* IDENT */:
          this.lexIdent();
          break;
        case 3 /* NUMBER */:
          this.lexNumber();
          break;
        case 4 /* SYMBOL */:
          this.lexSymbol();
          break;
        case 6 /* NEWLINE */:
          this.lexNewline();
          break;
        case 5 /* WHITESPACE */:
          this.lexWhitespace();
          break;
        case 1 /* UNKNOWN */:
          this.lexUnknown();
          break;
      }
    }
    return this.tokens;
  }
  atEnd() {
    return this.cursor <= this.end;
  }
  /**
   * Determines the lexing mode based on the current character
   * @private
   */
  determineMode() {
    this.value = "";
    if (grammar_default.REGEX_IDENT.exec(this.character)) {
      return 2 /* IDENT */;
    }
    if (grammar_default.REGEX_STRING_DELIMITER.exec(this.character)) {
      this.delimiter = this.character;
      return 7 /* STRING */;
    }
    if (grammar_default.REGEX_NUMBER.exec(this.character)) {
      return 3 /* NUMBER */;
    }
    if (grammar_default.REGEX_SYMBOL.exec(this.character)) {
      return 4 /* SYMBOL */;
    }
    if (grammar_default.REGEX_NEWLINE.exec(this.character)) {
      return 6 /* NEWLINE */;
    }
    if (grammar_default.REGEX_WHITESPACE.exec(this.character)) {
      return 5 /* WHITESPACE */;
    }
    return 1 /* UNKNOWN */;
  }
  lexIdent() {
    this.value += this.character;
    this.cursor++;
    this.column++;
    if (!this.nextCharacter || !grammar_default.REGEX_IDENT.exec(this.nextCharacter)) {
      this.tokens.push({
        type: "Ident" /* IDENT */,
        value: this.value,
        line: this.line,
        position: this.column,
        end: this.atEnd()
      });
      this.mode = 0 /* ALL */;
    }
  }
  lexString() {
    if (this.delimiter !== this.character) {
      this.value += this.character;
    }
    this.cursor++;
    if (this.nextCharacter === this.delimiter) {
      this.tokens.push({
        type: "String" /* STRING */,
        value: this.value,
        line: this.line,
        position: this.column,
        end: this.atEnd()
      });
      this.mode = 0 /* ALL */;
      this.cursor++;
      this.column++;
      this.delimiter = "";
    }
  }
  lexNumber() {
    this.value += this.character;
    this.cursor++;
    if (!this.nextCharacter || !grammar_default.REGEX_NUMBER.exec(this.nextCharacter)) {
      this.tokens.push({
        type: "Number" /* NUMBER */,
        value: this.value,
        line: this.line,
        position: this.column,
        end: this.atEnd()
      });
      this.column++;
      this.mode = 0 /* ALL */;
    }
  }
  lexSymbol() {
    this.tokens.push({
      type: "Symbol" /* SYMBOL */,
      value: this.character,
      line: this.line,
      position: this.column,
      end: this.atEnd()
    });
    this.cursor++;
    this.column++;
    this.mode = 0 /* ALL */;
  }
  lexNewline() {
    this.cursor++;
    this.line++;
    this.column = 0;
    this.mode = 0 /* ALL */;
  }
  lexWhitespace() {
    this.cursor++;
    this.mode = 0 /* ALL */;
  }
  lexUnknown() {
    this.tokens.push({
      type: "Unknown" /* UNKNOWN */,
      value: this.character,
      line: this.line,
      position: this.column,
      end: this.atEnd()
    });
    this.cursor++;
    this.column++;
    this.mode = 0 /* ALL */;
  }
};

// src/parser/Node.ts
var Node = class {
  value;
  parent = null;
  children = [];
  attributes = {};
  constructor(value = "") {
    this.value = value;
  }
  getName() {
    return this.constructor.name;
  }
  setParent(node) {
    this.parent = node;
  }
  getParent() {
    return this.parent;
  }
  getVal() {
    return this.value;
  }
  setVal(value) {
    this.value = value;
  }
  addChild(node) {
    this.children.push(node);
  }
  getChildren() {
    return this.children;
  }
  hasChildren() {
    return this.children.length > 0;
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  getAttribute(name) {
    return this.attributes[name];
  }
  removeLastChild() {
    this.children.pop();
  }
  parse(parser) {
    return false;
  }
  compile(compiler) {
  }
};

// src/parser/AstNode.ts
var AstNode = class extends Node {
  compile(compiler) {
    this.getChildren().forEach((child) => child.compile(compiler));
  }
};

// src/nodes/ArrowNode.ts
var ArrowNode = class extends Node {
  static parse(parser) {
    if (parser.acceptWithVal("Symbol" /* SYMBOL */, "-")) {
      parser.expectAtWithVal("Symbol" /* SYMBOL */, 1, ">");
      parser.advance(2);
      return true;
    }
    return false;
  }
};

// src/nodes/ImgNode.ts
var ImgNode = class _ImgNode extends Node {
  url;
  constructor(value, url = null) {
    super(value);
    this.url = url;
  }
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "img")) {
      parser.advance();
      parser.expect("String" /* STRING */);
      let value = parser.getCurrVal();
      parser.advance();
      if (ArrowNode.parse(parser)) {
        parser.expect("String" /* STRING */);
        let urlValue = parser.getCurrVal();
        parser.insert(new _ImgNode(value, urlValue));
        parser.advance();
        return true;
      }
      parser.insert(new _ImgNode(value));
      return true;
    }
    return false;
  }
  compile(compiler) {
    const scrollBarWidth = 15;
    const width = parseInt(compiler.variable("width"));
    const mediaQueryWidth = width + parseInt(compiler.variable("edge")) * 2 + scrollBarWidth;
    const imgId = compiler.remember("imgId", parseInt(compiler.get("imgId")) + 1);
    const currWidth = parseInt(compiler.get("currWidth"));
    compiler.writeLnHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
    compiler.writeLnHead(`.elos-img-${imgId} {`);
    compiler.writeLnHead(`width: ${currWidth}px !important;`);
    compiler.writeLnHead("}");
    compiler.writeLnHead("</style>");
    if (this.url) {
      compiler.writeLn(`<a href="${this.url}" target="_blank" style="text-decoration: none;">`);
    }
    compiler.writeLn(`<img class="elos-img-${imgId}" border="0" src="${this.getVal()}" style="display:block; border: 0; width: 100%;"/>`);
    if (this.url) {
      compiler.writeLn(`</a>`);
    }
  }
};

// src/parser/helpers/parse-class.ts
function parseClass(parser) {
  if (parser.skipWithVal("Symbol" /* SYMBOL */, ".")) {
    parser.expect("Ident" /* IDENT */);
    let className = parser.getCurrVal();
    parser.advance();
    return className;
  }
  return null;
}

// src/parser/helpers/compile-style-attrs.ts
var propMap = {
  size: {
    type: "integer",
    unit: "px",
    cssProperty: "font-size"
  },
  weight: {
    type: "string",
    cssProperty: "font-weight"
  },
  line: {
    type: "integer",
    unit: "px",
    cssProperty: "line-height"
  },
  height: {
    type: "integer",
    unit: "px",
    cssProperty: "height"
  },
  width: {
    type: "integer",
    unit: "px",
    cssProperty: "weight"
  },
  transform: {
    type: "string",
    cssProperty: "text-transform"
  },
  color: {
    type: "string",
    cssProperty: "color"
  },
  bgcolor: {
    type: "string",
    cssProperty: "background-color"
  },
  rounded: {
    type: "integer",
    unit: "px",
    cssProperty: "border-radius"
  },
  padding: {
    type: "integer",
    unit: "px",
    cssProperty: "padding"
  },
  align: {
    type: "string",
    cssProperty: "text-align"
  }
};
var compile_style_attrs_default = {
  compileStyleAttrs(compiler, ident, className = null, defaults = {}) {
    const name = className ? className : ident;
    const styles = className ? compiler.get("classes") : compiler.get("identStyles");
    const properties = styles[name] || [];
    const css = defaults;
    properties.forEach((prop) => {
      let cssProp = "";
      let type = "string";
      if (propMap[prop[0]]) {
        type = propMap[prop[0]]["type"];
        cssProp = propMap[prop[0]]["cssProperty"];
        switch (type) {
          case "string":
            css[cssProp] = prop[1];
            break;
          case "integer":
            const unit = propMap[prop[0]]["unit"] ? "px" : "";
            css[cssProp] = parseInt(prop[1]) + unit;
            break;
        }
      }
    });
    return css;
  },
  attrsToCssString(cssProps) {
    let output = "";
    for (let prop in cssProps) {
      output += `${prop}: ${cssProps[prop]};`;
    }
    return output;
  }
};

// src/nodes/LineNode.ts
var LineNode = class _LineNode extends Node {
  className;
  constructor(value, className = null) {
    super(value);
    this.className = className;
  }
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "line")) {
      parser.advance();
      let className = parseClass(parser);
      parser.insert(new _LineNode("", className));
      return true;
    }
    return false;
  }
  compile(compiler) {
    const width = parseInt(compiler.variable("width"));
    const css = compile_style_attrs_default.compileStyleAttrs(
      compiler,
      "line",
      this.className,
      {
        height: "2px",
        "background-color": "#000000"
      }
    );
    const cssString = compile_style_attrs_default.attrsToCssString(css);
    compiler.writeLn(
      `<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`
    );
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td style="${cssString}"></td>`);
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
  }
};

// src/nodes/TxtNode.ts
var TxtNode = class _TxtNode extends Node {
  className;
  url;
  constructor(value, className = null, url = null) {
    super(value);
    this.className = className;
    this.url = url;
  }
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "txt")) {
      parser.advance();
      let className = parseClass(parser);
      parser.expect("String" /* STRING */);
      let textValue = parser.getCurrVal();
      parser.advance();
      if (ArrowNode.parse(parser)) {
        parser.expect("String" /* STRING */);
        let urlValue = parser.getCurrVal();
        parser.insert(new _TxtNode(textValue, className, urlValue));
        parser.advance();
        return true;
      }
      parser.insert(new _TxtNode(textValue, className));
      return true;
    }
    return false;
  }
  compile(compiler) {
    const width = compiler.variable("width");
    const css = compile_style_attrs_default.compileStyleAttrs(compiler, "txt", this.className, {
      "font-size": "12px",
      "color": "#000000",
      "line-height": "16px",
      "text-decoration": "none"
    });
    const cssString = compile_style_attrs_default.attrsToCssString(css);
    compiler.writeLn(`<table cellspacing="0" cellpadding="0" style="max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td style="${cssString}">`);
    if (this.url) {
      compiler.writeLn(`<a href="${this.url}" target="_blank" style="${cssString}">`);
      compiler.writeLn(`${this.getVal()}`);
      compiler.writeLn(`</a>`);
    } else {
      compiler.writeLn(`${this.getVal()}`);
    }
    compiler.writeLn(`</td>`);
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
  }
};

// src/nodes/RawNode.ts
var RawNode = class _RawNode extends Node {
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "raw")) {
      parser.advance();
      parser.expect("String" /* STRING */);
      let textValue = parser.getCurrVal();
      parser.advance();
      parser.insert(new _RawNode(textValue));
      return true;
    }
    return false;
  }
  compile(compiler) {
    compiler.writeLn(this.getVal());
  }
};

// src/compiler/helpers/compile-with-vgap.ts
var compile_with_vgap_default = {
  compileWithVgap(compiler, children, align = "left" /* LEFT */) {
    const totalChildrenCount = children.length;
    const rawChildrenCount = children.filter((child) => child instanceof RawNode).length;
    const otherChildrenCount = totalChildrenCount - rawChildrenCount;
    const hasOnlyRawChildren = otherChildrenCount === 0;
    const vgap = compiler.variable("vgap");
    const cssString = align === "center" /* CENTER */ ? "" : "width: 100%;";
    if (totalChildrenCount) {
      if (!hasOnlyRawChildren) {
        compiler.writeLn(`<table role="presentation" style="${cssString}border:none;border-spacing:0;text-align:${align};font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
      }
      let otherChildIndex = 0;
      children.forEach((child, index) => {
        if (child instanceof RawNode) {
          child.compile(compiler);
        } else {
          compiler.writeLn("<tr>");
          compiler.writeLn(`<td align="${align}">`);
          child.compile(compiler);
          compiler.writeLn("</td>");
          compiler.writeLn("</tr>");
          if (otherChildIndex < otherChildrenCount - 1) {
            compiler.writeLn(`<tr><td height="${vgap}"></td></tr>`);
          }
          otherChildIndex++;
        }
      });
      if (!hasOnlyRawChildren) {
        compiler.writeLn(`</table>`);
      }
    }
  }
};

// src/nodes/GroupNode.ts
var GroupNode = class _GroupNode extends Node {
  className;
  constructor(value, className) {
    super(value);
    this.className = className;
  }
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "group")) {
      parser.advance();
      let className = parseClass(parser);
      if (parser.acceptWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        parser.insert(new _GroupNode("", className));
        parser.in();
        parseBody(parser);
        if (parser.acceptWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
          parser.out();
          parser.advance();
        }
        return true;
      }
    }
    return false;
  }
  compile(compiler) {
    const css = compile_style_attrs_default.compileStyleAttrs(compiler, "group", this.className, {
      "background-color": "#f0f0f0",
      "padding": "25px",
      "text-align": "left"
    });
    const bgColor = css["background-color"];
    const padding = parseInt(css["padding"]);
    const align = css["text-align"];
    const currWidth = parseInt(compiler.get("currWidth"));
    compiler.remember("currWidth", currWidth - padding * 2);
    compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width:100%;max-width:${currWidth}px;border:none;border-spacing:0;text-align:${align};">`);
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLn(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
    compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLn("</tr>");
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLn(`<td bgcolor="${bgColor}" align="${align}">`);
    compile_with_vgap_default.compileWithVgap(compiler, this.getChildren(), align);
    compiler.writeLn("</td>");
    compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLn("</tr>");
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLn(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
    compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
    compiler.remember("currWidth", currWidth);
  }
};

// src/nodes/ColNode.ts
var ColNode = class _ColNode extends Node {
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "col")) {
      parser.advance();
      if (parser.acceptWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        parser.insert(new _ColNode());
        parser.in();
        parseBody(parser);
        if (parser.acceptWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
          parser.out();
          parser.advance();
        }
        return true;
      }
    }
    return false;
  }
  compile(compiler) {
    compile_with_vgap_default.compileWithVgap(compiler, this.getChildren());
  }
};

// src/nodes/ColsNode.ts
var ColsNode = class _ColsNode extends Node {
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "cols")) {
      parser.advance();
      parser.insert(new _ColsNode());
      parser.in();
      while (ColNode.parse(parser)) ;
      parser.out();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const colsId = compiler.remember("colsId", parseInt(compiler.get("colsId")) + 1);
    const scrollBarWidth = 15;
    const colCount = this.getChildren().length;
    const currWidth = parseInt(compiler.get("currWidth"));
    const width = parseInt(compiler.variable("width"));
    const mediaQueryWidth = width + parseInt(compiler.variable("edge")) * 2 + scrollBarWidth;
    const gap = parseInt(compiler.variable("hgap"));
    const colWidth = Math.floor(currWidth / colCount - gap + Math.floor(gap / colCount));
    compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${currWidth}px;border:none;border-spacing:0;text-align:left;">`);
    compiler.writeLn("<tr>");
    compiler.writeLn("<td>");
    compiler.writeLn("<!--[if mso]>");
    compiler.writeLn('<table role="presentation" width="100%">');
    compiler.writeLn("<tr>");
    compiler.writeLn("<![endif]-->");
    this.getChildren().forEach((child, i) => {
      compiler.remember("currWidth", colWidth);
      compiler.writeLnHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
      compiler.writeLnHead(`.elos-col-${colsId}-${i} {`);
      compiler.writeLnHead(`float: left;`);
      compiler.writeLnHead(`max-width: ${colWidth}px !important;`);
      compiler.writeLnHead(`margin-bottom: 0 !important;`);
      if (i < colCount - 1) {
        compiler.writeLnHead(`padding-right: ${gap}px !important;`);
      }
      if (i === 0) {
      }
      compiler.writeLnHead("}");
      compiler.writeLnHead("</style>");
      compiler.writeLn("<!--[if mso]>");
      compiler.writeLn(`<td style="width: ${colWidth}px; padding: 0;" align="left" valign="top">`);
      compiler.writeLn("<![endif]-->");
      compiler.writeLn(`<div class="elos-col-${colsId}-${i}" style="display:inline-block; margin-bottom: ${gap}px; width:100%; vertical-align:top; text-align:left;">`);
      child.compile(compiler);
      compiler.writeLn("</div>");
      compiler.writeLn("<!--[if mso]>");
      compiler.writeLn("</td>");
      compiler.writeLn("<![endif]-->");
    });
    compiler.remember("currWidth", currWidth);
    compiler.writeLn("<!--[if mso]>");
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
    compiler.writeLn("<![endif]-->");
    compiler.writeLn("</td>");
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
  }
};

// src/nodes/SpaceNode.ts
var SpaceNode = class _SpaceNode extends Node {
  className;
  constructor(value, className = null) {
    super(value);
    this.className = className;
  }
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "space")) {
      parser.advance();
      let className = parseClass(parser);
      parser.insert(new _SpaceNode("", className));
      return true;
    }
    return false;
  }
  compile(compiler) {
    const vgap = compiler.variable("vgap");
    const width = compiler.variable("width");
    const css = compile_style_attrs_default.compileStyleAttrs(compiler, "space", this.className, {
      "height": `${vgap}px`
    });
    const cssString = compile_style_attrs_default.attrsToCssString(css);
    compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td style="${cssString}"></td>`);
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
  }
};

// src/nodes/BtnNode.ts
var BtnNode = class _BtnNode extends Node {
  className;
  url;
  constructor(value, className, url = null) {
    super(value);
    this.className = className;
    this.url = url;
  }
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "btn")) {
      parser.advance();
      let className = parseClass(parser);
      parser.expect("String" /* STRING */);
      let textValue = parser.getCurrVal();
      parser.advance();
      if (parser.acceptWithVal("Symbol" /* SYMBOL */, "-") && parser.acceptAtWithVal("Symbol" /* SYMBOL */, 1, ">")) {
        parser.advance(2);
        parser.expect("String" /* STRING */);
        let urlValue = parser.getCurrVal();
        parser.insert(new _BtnNode(textValue, className, urlValue));
        parser.advance();
        return true;
      }
      parser.insert(new _BtnNode(textValue, className));
      return true;
    }
    return false;
  }
  compile(compiler) {
    const width = compiler.get("currWidth");
    let css = compile_style_attrs_default.compileStyleAttrs(compiler, "btn", this.className, {
      "background-color": "#000000",
      "color": "#ffffff",
      "border-radius": "8px",
      "font-size": "12px",
      "font-weight": "normal",
      "line-height": "16px",
      "text-decoration": "none",
      "text-transform": "none",
      "padding": "8px 16px"
    });
    const bgColor = css["background-color"];
    const padding = css["padding"];
    const borderRadius = css["border-radius"];
    const cssString = compile_style_attrs_default.attrsToCssString(css);
    compiler.writeLn(`<table border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">`);
    compiler.writeLn("<tbody>");
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td align="center" bgcolor="${bgColor}" role="presentation" style="border:none;border-radius:${borderRadius};cursor:auto;mso-padding-alt:${padding};background:${bgColor};" valign="middle">`);
    compiler.writeLn(`<a href="${this.url ? this.url : "#"}" style="display:inline-block;margin:0;${cssString}" target="_blank">`);
    compiler.writeLn(this.getVal());
    compiler.writeLn("</a>");
    compiler.writeLn("</td>");
    compiler.writeLn("</tr>");
    compiler.writeLn("</tbody>");
    compiler.writeLn("</table>");
  }
};

// src/nodes/IncludeNode.ts
var fs = __toESM(require("fs"), 1);

// src/lex.ts
function lex(text) {
  return new Lexer().tokenize(text);
}

// src/nodes/DefNode.ts
var DefNode = class _DefNode extends Node {
  defName;
  constructor(defName, value) {
    super(value);
    this.defName = defName;
  }
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "def")) {
      parser.advance();
      if (parser.accept("Ident" /* IDENT */)) {
        let defName = parser.getCurrVal();
        parser.advance();
        if (parser.accept("String" /* STRING */) || parser.accept("Number" /* NUMBER */)) {
          parser.insert(new _DefNode(defName, parser.getCurrVal()));
          parser.advance();
          return true;
        }
      }
    }
    return false;
  }
  compile(compiler) {
    compiler.define(this.defName, this.getVal());
  }
};

// src/nodes/StylePropertyNode.ts
var StylePropertyNode = class _StylePropertyNode extends Node {
  property;
  constructor(property, value) {
    super(value);
    this.property = property;
  }
  static parse(parser) {
    if (parser.accept("Ident" /* IDENT */)) {
      let property = parser.getCurrVal();
      parser.advance();
      if (parser.accept("Number" /* NUMBER */) || parser.accept("String" /* STRING */)) {
        let value = parser.getCurrVal();
        parser.advance();
        parser.insert(new _StylePropertyNode(property, value));
        return true;
      }
    }
    return false;
  }
  compile(compiler) {
    const parent = this.getParent();
    const name = parent.getVal();
    const style = parent.isClass ? compiler.get("classes") : compiler.get("identStyles");
    if (!style[name]) {
      style[name] = [];
    }
    style[name] = [...style[name], [this.property, this.getVal()]];
  }
};

// src/nodes/StyleNode.ts
var StyleNode = class _StyleNode extends Node {
  isClass;
  constructor(name, isClass) {
    super(name);
    this.isClass = isClass;
  }
  static parse(parser) {
    if (parser.skipWithVal("Ident" /* IDENT */, "style")) {
      let identifier = "";
      if (parser.expect("Ident" /* IDENT */)) {
        identifier = parser.getCurrVal();
        parser.advance();
      }
      let className = parseClass(parser);
      let isClass = className !== null;
      if (parser.expectWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        parser.insert(new _StyleNode(className ? className : identifier, isClass));
        parser.in();
      }
      while (StylePropertyNode.parse(parser)) ;
      if (parser.expectWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
        parser.out();
        parser.advance();
      }
      return true;
    }
    return false;
  }
  compile(compiler) {
    this.getChildren().forEach((child) => child.compile(compiler));
  }
};

// src/parser/helpers/parse-head.ts
function parseHead(parser) {
  while (DefNode.parse(parser) || StyleNode.parse(parser) || IncludeNode.parse(parser)) ;
}

// src/events/Manager.ts
var Manager = class {
  /**
   * @private
   */
  static listeners = {};
  /**
   * @private
   */
  static queue = [];
  /**
   * Adds an event listener to the manager
   * @param id
   * @param listener
   */
  static addListener(id, listener) {
    if (!this.listeners[id]) {
      this.listeners[id] = [];
    }
    this.listeners[id] = [
      ...this.listeners[id],
      listener
    ];
  }
  /**
   * Emits an event
   * @param id
   * @param data
   */
  static emit(id, data) {
    if (!this.listeners || !this.listeners[id]) {
      return;
    }
    this.listeners[id].forEach((listener) => this.queue.push([listener, data]));
    this.process();
  }
  /**
   * Process the event queue
   */
  static process() {
    if (!this.queue.length) {
      return;
    }
    this.queue.forEach((queueItem) => {
      const [listener, data] = queueItem;
      listener(data);
    });
    this.queue = [];
  }
};

// src/nodes/IncludeNode.ts
var IncludeNode = class _IncludeNode extends Node {
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "include")) {
      parser.advance();
      parser.expect("String" /* STRING */);
      let textValue = parser.getCurrVal();
      parser.insert(new _IncludeNode(textValue));
      parser.advance();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const path = compiler.get("path");
    const filename = `${path}/${this.getVal()}.elos`;
    const code = fs.readFileSync(filename, "utf8");
    Manager.emit("fileTouch" /* FILE_TOUCH */, {
      filename
    });
    const tokens = lex(code);
    const parser = new Parser();
    parser.setTokenStream(tokens);
    parseHead(parser);
    parseBody(parser);
    const ast = parser.getAst();
    ast.setParent(this.getParent());
    const clonedCompiler = compiler.clone();
    if (this.getParent() instanceof AstNode) {
      clonedCompiler.compile(ast);
    } else {
      compile_with_vgap_default.compileWithVgap(clonedCompiler, ast.getChildren());
    }
    compiler.setMemory(clonedCompiler.getMemory());
    compiler.writeHead(clonedCompiler.getHead());
    compiler.write(clonedCompiler.getBody());
  }
};

// src/parser/helpers/parse-body.ts
function parseBody(parser) {
  while (IncludeNode.parse(parser) || SpaceNode.parse(parser) || ColsNode.parse(parser) || GroupNode.parse(parser) || ImgNode.parse(parser) || LineNode.parse(parser) || TxtNode.parse(parser) || BtnNode.parse(parser) || RawNode.parse(parser)) ;
}

// src/nodes/BodyNode.ts
var BodyNode = class _BodyNode extends Node {
  static parse(parser) {
    if (parser.acceptWithVal("Ident" /* IDENT */, "body")) {
      parser.advance();
      if (parser.acceptWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        parser.insert(new _BodyNode());
        parser.in();
        parseBody(parser);
        if (parser.expectWithVal("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
          parser.out();
          parser.advance();
        }
        return true;
      }
    }
    return false;
  }
  compile(compiler) {
    const preview = compiler.variable("preview");
    const width = parseInt(compiler.variable("width"));
    const edge = parseInt(compiler.variable("edge"));
    const totalWidth = width + edge * 2;
    compiler.remember("currWidth", width);
    if (preview) {
      compiler.writeLn('<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">');
      compiler.writeLn(preview);
      compiler.writeLn(`</div>`);
    }
    compiler.writeLn('<table role="presentation" style="width:100%;border:none;border-spacing:0;">');
    compiler.writeLn("<tr>");
    compiler.writeLn('<td align="center" style="padding:0;">');
    compiler.writeLn(`<table role="presentation" style="width:100%;max-width:${totalWidth}px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
    compiler.writeLn("<tr>");
    compiler.writeLn(`<td width="${edge}">`);
    compiler.writeLn("</td>");
    compiler.writeLn(`<td style="max-width: ${width}px;">`);
    compile_with_vgap_default.compileWithVgap(compiler, this.getChildren());
    compiler.writeLn("</td>");
    compiler.writeLn(`<td width="${edge}">`);
    compiler.writeLn("</td>");
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
    compiler.writeLn("</td>");
    compiler.writeLn("</tr>");
    compiler.writeLn("</table>");
  }
};

// src/nodes/RootNode.ts
var RootNode = class extends Node {
  static parse(parser) {
    while (DefNode.parse(parser) || StyleNode.parse(parser) || IncludeNode.parse(parser)) ;
    if (BodyNode.parse(parser)) {
      parser.advance();
      return true;
    }
    return false;
  }
  compile(compiler) {
  }
};

// src/errors/UnexpectedToken.ts
var UnexpectedToken = class extends Error {
  constructor(expected, got) {
    if (!expected) {
      super(`Unexpected token ${got.type}(${got.value}) at line ${got.line},${got.position}`);
    } else {
      super(`Expected a token with type ${expected ?? "unknown"}, got ${got.type}(${got.value}) at line ${got.line},${got.position}`);
    }
    this.name = "UnexpectedToken";
  }
};

// src/parser/Parser.ts
var Parser = class {
  cursor = 0;
  tokens;
  ast = new AstNode();
  scope = this.ast;
  setTokenStream(tokens) {
    this.tokens = tokens;
  }
  parse(tokens) {
    this.setTokenStream(tokens);
    this.parseAll();
    return this.ast;
  }
  parseAll() {
    if (!this.tokens.length) {
      return;
    }
    if (this.cursor > this.tokens.length - 1) {
      return;
    }
    if (RootNode.parse(this)) {
      this.parseAll();
    }
  }
  getCurrToken() {
    return this.tokens[this.cursor];
  }
  getOffsetToken(offset) {
    return this.tokens[this.cursor + offset];
  }
  setAttribute(name) {
    const last = this.getLastNode();
    this.getScope().removeLastChild();
    this.getScope().setAttribute(name, last);
  }
  getCurrVal() {
    return this.getCurrToken().value;
  }
  advance(offset = 1) {
    this.cursor = this.cursor + offset;
  }
  accept(type) {
    let token = this.getCurrToken();
    return token && token.type === type;
  }
  expect(type) {
    if (this.accept(type)) {
      return true;
    }
    throw new UnexpectedToken(type, this.getCurrToken());
  }
  skip(type) {
    if (this.accept(type)) {
      this.advance();
      return true;
    }
    return false;
  }
  skipWithVal(type, value) {
    if (this.acceptWithVal(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }
  acceptAt(type, offset) {
    const token = this.getOffsetToken(offset);
    return token && token.type === type;
  }
  acceptWithVal(type, value) {
    const token = this.getCurrToken();
    return token && token.type === type && token.value === value;
  }
  expectWithVal(type, value) {
    if (this.acceptWithVal(type, value)) {
      return true;
    }
    throw new UnexpectedToken(type, this.getCurrToken());
  }
  expectAtWithVal(type, offset, value) {
    if (this.acceptAtWithVal(type, offset, value)) {
      return true;
    }
    throw new UnexpectedToken(type, this.getCurrToken());
  }
  acceptAtWithVal(type, offset, value) {
    const token = this.getOffsetToken(offset);
    return token && token.type === type && token.value === value;
  }
  acceptNextChain(...types) {
    let result = true;
    for (let i = 0; i < types.length; i++) {
      let token = this.getOffsetToken(i);
      if (!token) {
        return false;
      }
      result = result && token.type === types[i];
    }
    return result;
  }
  getValAt(offset) {
    let token = this.getOffsetToken(offset);
    if (token) {
      return token.value;
    }
    return null;
  }
  getValChain(amount) {
    let val = "";
    for (let i = 0; i < amount; i++) {
      let token = this.getOffsetToken(i);
      if (!token) {
        return val;
      }
      val += token.value;
    }
    return val;
  }
  in() {
    this.scope = this.getLastNode();
  }
  out() {
    this.scope = this.scope.getParent();
  }
  getScope() {
    return this.scope;
  }
  getLastNode() {
    return this.scope.getChildren()[this.scope.getChildren().length - 1];
  }
  insert(node) {
    node.setParent(this.scope);
    this.scope.addChild(node);
  }
  setScope(node) {
    this.scope = node;
  }
  traverseUp() {
    this.setScope(this.getLastNode());
  }
  traverseDown() {
    this.setScope(this.getScope().getParent());
  }
  wrap(node) {
    const last = this.getLastNode();
    this.getScope().removeLastChild();
    this.insert(node);
    this.traverseUp();
    this.insert(last);
  }
  getAst() {
    return this.ast;
  }
};

// src/Elos.ts
var Elos = class {
  /**
   * @param code
   * @param path
   */
  static make(code, path = "") {
    const tokens = new Lexer().tokenize(code);
    const ast = new Parser().parse(tokens);
    return new Compiler({ path }).compile(ast);
  }
  /**
   * @param eventId
   * @param listener
   */
  static on(eventId, listener) {
    Manager.addListener(eventId, listener);
  }
};

// src/parse.ts
function parse(tokens) {
  return new Parser().parse(tokens);
}

// src/compile.ts
function compile(ast) {
  return new Compiler().compile(ast);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Elos,
  compile,
  lex,
  parse
});
//# sourceMappingURL=index.cjs.map