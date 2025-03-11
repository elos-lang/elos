// src/runtime/Store.ts
var Store = class {
  /**
   * @private
   */
  items = {};
  /**
   * @param items
   */
  constructor(items = {}) {
    this.items = items;
  }
  /**
   * Sets a value by name
   * @param name
   * @param value
   */
  set(name, value) {
    this.items[name] = value;
    return value;
  }
  /**
   * Gets a value by name
   * @param name
   */
  get(name) {
    return this.items[name];
  }
  /**
   * Gets all items as an object
   */
  getAll() {
    return this.items;
  }
  /**
   * Extends the items by an object of other items
   * @param items
   */
  extend(items) {
    Object.assign(this.items, items);
  }
};

// src/runtime/Runtime.ts
var Runtime = class _Runtime {
  internal = new Store({
    path: "",
    colsId: 0,
    imgId: 0,
    classes: {},
    identStyles: {}
  });
  variables = new Store({
    preview: "",
    edge: 35,
    hgap: 10,
    vgap: 10,
    bgcolor: "#ffffff",
    width: 650
  });
  setVariable(name, value) {
    return this.variables.set(name, value);
  }
  getVariable(name) {
    return this.variables.get(name);
  }
  getVariables() {
    return this.variables;
  }
  setInternalMemoryItem(name, value) {
    return this.internal.set(name, value);
  }
  getInternalMemoryItem(name) {
    return this.internal.get(name);
  }
  getInternalMemory() {
    return this.internal;
  }
  clone() {
    const runtime = new _Runtime();
    runtime.import(this);
    return runtime;
  }
  import(runtime) {
    this.internal.extend(runtime.getInternalMemory().getAll());
    this.variables.extend(runtime.getVariables().getAll());
  }
};

// src/compiler/OutputBuffer.ts
var OutputBuffer = class {
  /**
   *
   * @private
   */
  head = [];
  /**
   *
   * @private
   */
  body = [];
  /**
   *
   * @private
   */
  foot = [];
  /**
   *
   * @param string
   */
  writeBody(string) {
    this.body.push(string);
  }
  /**
   *
   * @param string
   */
  writeHead(string) {
    this.head.push(string);
  }
  /**
   *
   * @param string
   */
  writeFoot(string) {
    this.foot.push(string);
  }
  /**
   *
   */
  getHead() {
    return this.head.join("");
  }
  /**
   *
   */
  getBody() {
    return this.body.join("");
  }
  /**
   *
   */
  getFoot() {
    return this.foot.join("");
  }
};

// src/compiler/OutputRenderer.ts
var OutputRenderer = class {
  render(buffer, variables) {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
		${buffer.getHead()}
	</head>
	<body bgcolor="${variables.get("bgcolor")}">
		${buffer.getBody()}
	</body>
</html>
        `;
  }
};

// src/compiler/Compiler.ts
var Compiler = class _Compiler {
  /**
   *
   * @private
   */
  runtime;
  /**
   * @private
   */
  buffer;
  /**
   * @private
   */
  renderer;
  /**
   * @param runtime
   */
  constructor(runtime = null) {
    this.runtime = runtime ? runtime : new Runtime();
    this.buffer = new OutputBuffer();
    this.renderer = new OutputRenderer();
  }
  /**
   *
   */
  clone() {
    return new _Compiler(this.runtime.clone());
  }
  /**
   *
   * @param compiler
   */
  import(compiler) {
    this.runtime.import(compiler.getRuntime());
  }
  /**
   *
   */
  getRuntime() {
    return this.runtime;
  }
  /**
   *
   * @param string
   */
  write(string) {
    this.buffer.writeBody(string);
  }
  writeHead(string) {
    this.buffer.writeHead(string);
  }
  writeLineToBody(string) {
    this.buffer.writeBody("\n" + string);
  }
  writeLineToHead(string) {
    this.buffer.writeHead("\n" + string);
  }
  define(name, value) {
    this.runtime.setVariable(name, value);
    return value;
  }
  variable(name) {
    return this.runtime.getVariable(name);
  }
  remember(name, value) {
    return this.runtime.setInternalMemoryItem(name, value);
  }
  get(name) {
    return this.runtime.getInternalMemoryItem(name);
  }
  getHead() {
    return this.buffer.getHead();
  }
  getBody() {
    return this.buffer.getBody();
  }
  compile(ast) {
    ast.compile(this);
    return this.renderer.render(this.buffer, this.runtime.getVariables());
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
  REGEX_VAR: /[a-zA-Z_-]/,
  REGEX_VAR_START: /\$/,
  REGEX_COLOR: /[0-9a-fA-F]/,
  REGEX_COLOR_START: /\#/,
  COMMENT_SYMBOL: "/",
  BLOCK_OPEN_SYMBOL: "{",
  BLOCK_CLOSE_SYMBOL: "}",
  STRING_ESCAPE_SYMBOL: "\\"
};

// src/lexer/Lexer.ts
var Lexer = class {
  /**
   * The source code to tokenize
   * @private
   */
  source;
  /**
   * The current mode of lexing
   * @private
   */
  mode = 0 /* ALL */;
  /**
   * The current position of the cursor
   * @private
   */
  cursor = 0;
  /**
   * The position of the cursor at the start of the mode
   * @private
   */
  modeStartCursor = 0;
  /**
   * The current line, starting at line 1
   * @private
   */
  line = 1;
  /**
   * The current position on the current line, starting at 1
   * @private
   */
  column = 1;
  /**
   * The current character
   * @private
   */
  character = "";
  /**
   * The next character, handy for simple look-ahead
   * @private
   */
  nextCharacter = "";
  /**
   * The index of the last character, also the amount of characters
   * @private
   */
  end = 0;
  /**
   * The current token stream being created
   * @private
   */
  tokens = [];
  /**
   * The current value being lexed
   * @private
   */
  value = "";
  /**
   * The current delimiter (e.g. string delimiter or boundary)
   * @private
   */
  delimiter = "";
  /**
   * Transforms code into a TokenStream
   * @param text
   */
  tokenize(text) {
    this.source = text;
    this.end = this.source.length;
    while (this.cursor < this.end) {
      this.character = this.source[this.cursor];
      this.nextCharacter = this.source[this.cursor + 1] || null;
      if (this.mode === 0 /* ALL */) {
        this.mode = this.determineMode();
        this.modeStartCursor = this.cursor;
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
        case 8 /* VAR */:
          this.lexVariable();
          break;
        case 9 /* COLOR */:
          this.lexColor();
          break;
        case 10 /* COMMENT */:
          this.lexComment();
          break;
        case 1 /* UNKNOWN */:
          this.lexUnknown();
          break;
      }
    }
    return this.tokens;
  }
  /**
   * @private
   */
  atEnd(accountForDelimiter = false) {
    const offset = accountForDelimiter ? 1 : 0;
    return this.cursor + offset >= this.end;
  }
  /**
   * Determines the lexing mode based on the current character
   * @private
   */
  determineMode() {
    this.value = "";
    if (this.character === grammar_default.COMMENT_SYMBOL && this.nextCharacter === grammar_default.COMMENT_SYMBOL) {
      return 10 /* COMMENT */;
    }
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
    if (grammar_default.REGEX_COLOR_START.exec(this.character)) {
      return 9 /* COLOR */;
    }
    if (grammar_default.REGEX_VAR_START.exec(this.character)) {
      return 8 /* VAR */;
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
  /**
   * Tokenize identifier
   * @private
   */
  lexIdent() {
    this.value += this.character;
    this.cursor++;
    if (!this.nextCharacter || !grammar_default.REGEX_IDENT.exec(this.nextCharacter)) {
      this.tokens.push({
        type: "Ident" /* IDENT */,
        value: this.value,
        line: this.line,
        position: this.column,
        end: this.atEnd()
      });
      this.column += this.value.length;
      this.mode = 0 /* ALL */;
    }
  }
  /**
   * Tokenize string
   * @private
   */
  lexString() {
    let escSequence = this.character === grammar_default.STRING_ESCAPE_SYMBOL;
    if (escSequence) {
      this.cursor += 1;
      this.character = this.source[this.cursor];
      this.nextCharacter = this.source[this.cursor + 1] || null;
    }
    if (this.character !== this.delimiter || escSequence) {
      this.value += this.character;
    }
    this.cursor++;
    if (this.nextCharacter === this.delimiter) {
      this.tokens.push({
        type: "String" /* STRING */,
        value: this.value,
        line: this.line,
        position: this.column,
        end: this.atEnd(true)
      });
      this.cursor++;
      this.column += this.cursor - this.modeStartCursor;
      this.mode = 0 /* ALL */;
      this.delimiter = "";
    }
  }
  /**
   * Tokenize number
   * @private
   */
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
      this.column += this.cursor - this.modeStartCursor;
      this.mode = 0 /* ALL */;
    }
  }
  /**
   * Tokenize symbol
   * @private
   */
  lexSymbol() {
    this.cursor++;
    this.tokens.push({
      type: "Symbol" /* SYMBOL */,
      value: this.character,
      line: this.line,
      position: this.column,
      end: this.atEnd()
    });
    this.column++;
    this.mode = 0 /* ALL */;
  }
  /**
   * Tokenize newline
   * @private
   */
  lexNewline() {
    this.cursor++;
    this.line++;
    this.column = 1;
    this.mode = 0 /* ALL */;
  }
  /**
   * Tokenize whitespace
   * @private
   */
  lexWhitespace() {
    this.cursor++;
    this.column++;
    this.mode = 0 /* ALL */;
  }
  /**
   * Tokenize color
   * @private
   */
  lexColor() {
    if (grammar_default.REGEX_COLOR.exec(this.character)) {
      this.value += this.character;
    }
    this.cursor++;
    if (!this.nextCharacter || this.value.length === 6 || !grammar_default.REGEX_COLOR.exec(this.nextCharacter)) {
      this.tokens.push({
        type: "Color" /* COLOR */,
        value: this.value,
        line: this.line,
        position: this.column,
        end: this.atEnd()
      });
      this.mode = 0 /* ALL */;
      this.column += this.cursor - this.modeStartCursor;
      this.delimiter = "";
    }
  }
  /**
   * Tokenize variable
   * @private
   */
  lexVariable() {
    if (grammar_default.REGEX_VAR.exec(this.character)) {
      this.value += this.character;
    }
    this.cursor++;
    if (!this.nextCharacter || !grammar_default.REGEX_VAR.exec(this.nextCharacter)) {
      this.tokens.push({
        type: "Var" /* VAR */,
        value: this.value,
        line: this.line,
        position: this.column,
        end: this.atEnd()
      });
      this.mode = 0 /* ALL */;
      this.column += this.cursor - this.modeStartCursor;
      this.delimiter = "";
    }
  }
  /**
   * Tokenize unknown
   * @private
   */
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
  /**
   * Tokenize comment
   * @private
   */
  lexComment() {
    this.cursor++;
    if (grammar_default.REGEX_NEWLINE.exec(this.nextCharacter)) {
      this.mode = 0 /* ALL */;
      this.column++;
    }
  }
};

// src/parser/Node.ts
var Node = class _Node {
  /**
   *
   * @protected
   */
  value;
  /**
   *
   * @protected
   */
  parent = null;
  /**
   *
   * @protected
   */
  children = [];
  /**
   *
   * @protected
   */
  attributes = {};
  /**
   *
   * @param value
   */
  constructor(value = "") {
    this.value = value;
  }
  /**
   *
   */
  getName() {
    return this.constructor.name;
  }
  /**
   *
   * @param node
   */
  setParent(node) {
    this.parent = node;
  }
  /**
   *
   */
  getParent() {
    return this.parent;
  }
  /**
   *
   */
  getValue() {
    return this.value;
  }
  /**
   *
   * @param value
   */
  setValue(value) {
    this.value = value;
  }
  /**
   *
   * @param node
   */
  addChild(node) {
    this.children.push(node);
  }
  /**
   *
   */
  getChildren() {
    return this.children;
  }
  /**
   *
   */
  hasChildren() {
    return this.children.length > 0;
  }
  /**
   *
   * @param name
   * @param value
   */
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  /**
   *
   * @param name
   */
  getAttribute(name) {
    return this.attributes[name] || null;
  }
  /**
   *
   */
  getAttributes() {
    return this.attributes;
  }
  /**
   *
   */
  removeLastChild() {
    this.children.pop();
  }
  /**
   *
   * @param parser
   */
  parse(parser) {
    return false;
  }
  /**
   *
   * @param compiler
   */
  compile(compiler) {
  }
  print() {
    const printNode = (node, indentAmount = 0) => {
      const nodeName = node.getName();
      const nodeValue = node.getValue();
      let attributes = node.getAttributes();
      let attributesString = [];
      for (let attribute in attributes) {
        let attrValue = attributes[attribute];
        if (attrValue instanceof _Node) {
          const attrNodeValue = attrValue.getValue();
          attrValue = `${attrValue.getName()}${attrNodeValue ? `(${attrNodeValue})` : ""}`;
        }
        attributesString.push(`${attribute}=${attrValue}`);
      }
      let tabs = indentAmount > 0 ? "   ".repeat(indentAmount - 1) + "\u2514\u2500\u2500" : "";
      let output = [`${tabs}${nodeName}${nodeValue ? `(${nodeValue})` : ""} ${attributesString.join(" ")}`];
      node.getChildren().forEach((childNode) => {
        output.push(printNode(childNode, indentAmount + 1));
      });
      return output.join("\n");
    };
    return printNode(this);
  }
};

// src/nodes/primitives/ColorPrimitiveNode.ts
var ColorPrimitiveNode = class _ColorPrimitiveNode extends Node {
  static parse(parser) {
    if (parser.accept("Color" /* COLOR */)) {
      parser.insert(new _ColorPrimitiveNode(parser.getCurrentValue()));
      parser.advance();
      return true;
    }
    return false;
  }
  compile(compiler) {
    compiler.write(`#${this.getValue()}`);
  }
};

// src/nodes/primitives/StringPrimitiveNode.ts
var StringPrimitiveNode = class _StringPrimitiveNode extends Node {
  static parse(parser) {
    if (parser.accept("String" /* STRING */)) {
      parser.insert(new _StringPrimitiveNode(parser.getCurrentValue()));
      parser.advance();
      return true;
    }
    return false;
  }
  compile(compiler) {
    compiler.write(this.value);
  }
};

// src/nodes/primitives/VariablePrimitiveNode.ts
var VariablePrimitiveNode = class _VariablePrimitiveNode extends Node {
  static parse(parser) {
    if (parser.accept("Var" /* VAR */)) {
      parser.insert(new _VariablePrimitiveNode(parser.getCurrentValue()));
      parser.advance();
      return true;
    }
    return false;
  }
  compile(compiler) {
    compiler.write(compiler.variable(this.value));
  }
};

// src/nodes/OperatorNode.ts
var OperatorNode = class _OperatorNode extends Node {
  static parse(parser) {
    if (parser.skipWithValue("Symbol" /* SYMBOL */, "+")) {
      parser.insert(new _OperatorNode("+"));
      return true;
    }
    return false;
  }
  compile(compiler) {
  }
};

// src/nodes/primitives/NumberPrimitiveNode.ts
var NumberPrimitiveNode = class _NumberPrimitiveNode extends Node {
  static parse(parser) {
    if (parser.accept("Number" /* NUMBER */)) {
      parser.insert(new _NumberPrimitiveNode(parser.getCurrentValue()));
      parser.advance();
      return true;
    }
    return false;
  }
  compile(compiler) {
    compiler.write(this.value);
  }
};

// src/nodes/ExpressionNode.ts
var ExpressionNode = class _ExpressionNode extends Node {
  static parse(parser) {
    if (NumberPrimitiveNode.parse(parser) || VariablePrimitiveNode.parse(parser) || ColorPrimitiveNode.parse(parser) || StringPrimitiveNode.parse(parser)) {
      if (parser.getScope().getName() !== this.name) {
        parser.wrap(new _ExpressionNode());
      }
      if (OperatorNode.parse(parser)) {
        if (!this.parse(parser)) {
          throw new Error("Unexpected token " + parser.getCurrentToken().type);
        }
      } else {
        parser.traverseDown();
      }
      return true;
    }
    return false;
  }
  compile(compiler) {
    this.getChildren().forEach((child, i) => {
      child.compile(compiler);
    });
  }
};

// src/compiler/helpers/compile-expression-into-value.ts
var compile_expression_into_value_default = {
  compileExpressionIntoValue(compiler, expression) {
    if (!expression) {
      return null;
    }
    const compilerClone = compiler.clone();
    expression.compile(compilerClone);
    return compilerClone.getBody();
  }
};

// src/nodes/DefNode.ts
var DefNode = class _DefNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "def")) {
      parser.advance();
      const defNode = new _DefNode();
      parser.insert(defNode);
      parser.traverseUp();
      if (parser.expect("Var" /* VAR */)) {
        defNode.setValue(parser.getCurrentValue());
        parser.advance();
      }
      if (!ExpressionNode.parse(parser)) {
        throw new Error("Expected an expression");
      }
      parser.setAttribute("value");
      parser.traverseDown();
      return true;
    }
    return false;
  }
  getVariableName() {
    return this.getValue();
  }
  compile(compiler) {
    const value = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("value"));
    compiler.define(this.getVariableName(), value);
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
      let property = parser.getCurrentValue();
      parser.advance();
      if (parser.accept("Number" /* NUMBER */) || parser.accept("String" /* STRING */)) {
        let value = parser.getCurrentValue();
        parser.advance();
        parser.insert(new _StylePropertyNode(property, value));
        return true;
      }
    }
    return false;
  }
  compile(compiler) {
    const parent = this.getParent();
    const name = parent.getValue();
    const style = parent.isClass ? compiler.get("classes") : compiler.get("identStyles");
    if (!style[name]) {
      style[name] = [];
    }
    style[name] = [...style[name], [this.property, this.getValue()]];
  }
};

// src/parser/helpers/parse-class.ts
function parseClass(parser) {
  if (parser.skipWithValue("Symbol" /* SYMBOL */, ".")) {
    parser.expect("Ident" /* IDENT */);
    let className = parser.getCurrentValue();
    parser.advance();
    return className;
  }
  return null;
}

// src/nodes/StyleNode.ts
var StyleNode = class _StyleNode extends Node {
  isClass;
  constructor(name, isClass) {
    super(name);
    this.isClass = isClass;
  }
  static parse(parser) {
    if (parser.skipWithValue("Ident" /* IDENT */, "style")) {
      let identifier = "";
      if (parser.expect("Ident" /* IDENT */)) {
        identifier = parser.getCurrentValue();
        parser.advance();
      }
      let className = parseClass(parser);
      let isClass = className !== null;
      if (parser.expectWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        parser.insert(new _StyleNode(className ? className : identifier, isClass));
        parser.in();
      }
      while (StylePropertyNode.parse(parser)) ;
      if (parser.expectWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
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

// src/nodes/IncludeNode.ts
import * as fs from "node:fs";

// src/nodes/ArrowNode.ts
var ArrowNode = class extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Symbol" /* SYMBOL */, "-") && parser.expectAtWithValue("Symbol" /* SYMBOL */, 1, ">")) {
      parser.advance(2);
      return true;
    }
    return false;
  }
};

// src/nodes/ImgNode.ts
var ImgNode = class _ImgNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "img")) {
      parser.advance();
      parser.insert(new _ImgNode());
      parser.traverseUp();
      let className = parseClass(parser);
      if (className) {
        parser.setAttribute("className", className);
      }
      if (!ExpressionNode.parse(parser)) {
        throw new Error("Expected an expression");
      }
      parser.setAttribute("src");
      if (ArrowNode.parse(parser)) {
        if (!ExpressionNode.parse(parser)) {
          throw new Error("Expected an expression");
        }
        parser.setAttribute("url");
      }
      parser.traverseDown();
      return true;
    }
  }
  compile(compiler) {
    const src = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("src"));
    const className = this.getAttribute("className");
    const url = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("url"));
    const scrollBarWidth = 15;
    const width = parseInt(compiler.variable("width"));
    const mediaQueryWidth = width + parseInt(compiler.variable("edge")) * 2 + scrollBarWidth;
    const imgId = compiler.remember("imgId", parseInt(compiler.get("imgId")) + 1);
    const currWidth = parseInt(compiler.get("currWidth"));
    compiler.writeLineToHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
    compiler.writeLineToHead(`.elos-img-${imgId} {`);
    compiler.writeLineToHead(`width: ${currWidth}px !important;`);
    compiler.writeLineToHead("}");
    compiler.writeLineToHead("</style>");
    if (url) {
      compiler.writeLineToBody(`<a href="${url}" target="_blank" style="text-decoration: none;">`);
    }
    compiler.writeLineToBody(`<img class="elos-img-${imgId}" border="0" src="${src}" style="display:block; border: 0; width: 100%;"/>`);
    if (url) {
      compiler.writeLineToBody(`</a>`);
    }
  }
};

// src/parser/helpers/compile-style-attrs.ts
var propMap = {
  font: {
    type: "string",
    cssProperty: "font-family"
  },
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
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "line")) {
      parser.advance();
      parser.insert(new _LineNode());
      parser.traverseUp();
      let className = parseClass(parser);
      if (className) {
        parser.setAttribute("className", className);
      }
      parser.traverseDown();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const className = this.getAttribute("className") || null;
    const width = parseInt(compiler.variable("width"));
    const css = compile_style_attrs_default.compileStyleAttrs(
      compiler,
      "line",
      className,
      {
        height: "2px",
        "background-color": "#000000"
      }
    );
    const cssString = compile_style_attrs_default.attrsToCssString(css);
    compiler.writeLineToBody(
      `<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`
    );
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td style="${cssString}"></td>`);
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
  }
};

// src/nodes/TxtNode.ts
var TxtNode = class _TxtNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "txt")) {
      parser.advance();
      parser.insert(new _TxtNode());
      parser.traverseUp();
      let className = parseClass(parser);
      if (className) {
        parser.setAttribute("className", className);
      }
      if (!ExpressionNode.parse(parser)) {
        throw new Error("Expected an expression");
      }
      parser.setAttribute("text");
      if (ArrowNode.parse(parser)) {
        if (!ExpressionNode.parse(parser)) {
          throw new Error("Expected an expression");
        }
        parser.setAttribute("url");
      }
      parser.traverseDown();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const text = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("text"));
    const className = this.getAttribute("className");
    const url = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("url"));
    const width = compiler.variable("width");
    const css = compile_style_attrs_default.compileStyleAttrs(compiler, "txt", className, {
      "font-family": "Arial",
      "font-size": "12px",
      "color": "#000000",
      "line-height": "16px",
      "text-decoration": "none"
    });
    const cssString = compile_style_attrs_default.attrsToCssString(css);
    compiler.writeLineToBody(`<table cellspacing="0" cellpadding="0" style="max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td style="${cssString}">`);
    if (url) {
      compiler.writeLineToBody(`<a href="${url}" target="_blank" style="${cssString}">`);
    }
    compiler.writeLineToBody(text);
    if (url) {
      compiler.writeLineToBody(`</a>`);
    }
    compiler.writeLineToBody(`</td>`);
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
  }
};

// src/nodes/RawNode.ts
var RawNode = class _RawNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "raw")) {
      parser.advance();
      parser.insert(new _RawNode());
      parser.traverseUp();
      if (!ExpressionNode.parse(parser)) {
        throw new Error("Expected an expression");
      }
      parser.setAttribute("expression");
      parser.traverseDown();
      return true;
    }
    return false;
  }
  compile(compiler) {
    this.getAttribute("expression").compile(compiler);
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
        compiler.writeLineToBody(`<table role="presentation" style="${cssString}border:none;border-spacing:0;text-align:${align};font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
      }
      let otherChildIndex = 0;
      children.forEach((child, index) => {
        if (child instanceof RawNode) {
          child.compile(compiler);
        } else {
          compiler.writeLineToBody("<tr>");
          compiler.writeLineToBody(`<td align="${align}">`);
          child.compile(compiler);
          compiler.writeLineToBody("</td>");
          compiler.writeLineToBody("</tr>");
          if (otherChildIndex < otherChildrenCount - 1) {
            compiler.writeLineToBody(`<tr><td height="${vgap}"></td></tr>`);
          }
          otherChildIndex++;
        }
      });
      if (!hasOnlyRawChildren) {
        compiler.writeLineToBody(`</table>`);
      }
    }
  }
};

// src/nodes/GroupNode.ts
var GroupNode = class _GroupNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "group")) {
      parser.advance();
      let className = parseClass(parser);
      if (parser.expectWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        const groupNode = new _GroupNode();
        if (className) {
          groupNode.setAttribute("className", className);
        }
        parser.insert(groupNode);
        parser.in();
        parseBody(parser);
        if (parser.expectWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
          parser.out();
          parser.advance();
        }
        return true;
      }
    }
    return false;
  }
  compile(compiler) {
    const currentWidth = compiler.get("currWidth");
    const className = this.getAttribute("className") || null;
    const css = compile_style_attrs_default.compileStyleAttrs(compiler, "group", className, {
      "background-color": "#f0f0f0",
      "padding": "25px",
      "text-align": "left"
    });
    const bgColor = css["background-color"];
    const padding = parseInt(css["padding"]);
    const align = css["text-align"];
    const currWidth = parseInt(currentWidth);
    compiler.remember("currWidth", currWidth - padding * 2);
    compiler.writeLineToBody(`<table width="100%;" cellspacing="0" cellpadding="0" style="width:100%;max-width:${currWidth}px;border:none;border-spacing:0;text-align:${align};">`);
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" align="${align}">`);
    compile_with_vgap_default.compileWithVgap(compiler, this.getChildren(), align);
    compiler.writeLineToBody("</td>");
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
    compiler.writeLineToBody(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
    compiler.remember("currWidth", currWidth);
  }
};

// src/nodes/ColNode.ts
var ColNode = class _ColNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "col")) {
      parser.advance();
      if (parser.acceptWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        parser.insert(new _ColNode());
        parser.in();
        parseBody(parser);
        if (parser.acceptWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
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
    if (parser.acceptWithValue("Ident" /* IDENT */, "cols")) {
      parser.advance();
      let className = parseClass(parser);
      if (parser.expectWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        const colsNode = new _ColsNode();
        if (className) {
          colsNode.setAttribute("className", className);
        }
        parser.insert(colsNode);
        parser.in();
        while (ColNode.parse(parser)) ;
        if (parser.expectWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
          parser.out();
          parser.advance();
        }
        return true;
      }
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
    compiler.writeLineToBody(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${currWidth}px;border:none;border-spacing:0;text-align:left;">`);
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody("<td>");
    compiler.writeLineToBody("<!--[if mso]>");
    compiler.writeLineToBody('<table role="presentation" width="100%">');
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody("<![endif]-->");
    this.getChildren().forEach((child, i) => {
      compiler.remember("currWidth", colWidth);
      compiler.writeLineToHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
      compiler.writeLineToHead(`.elos-col-${colsId}-${i} {`);
      compiler.writeLineToHead(`float: left;`);
      compiler.writeLineToHead(`max-width: ${colWidth}px !important;`);
      compiler.writeLineToHead(`margin-bottom: 0 !important;`);
      if (i < colCount - 1) {
        compiler.writeLineToHead(`padding-right: ${gap}px !important;`);
      }
      if (i === 0) {
      }
      compiler.writeLineToHead("}");
      compiler.writeLineToHead("</style>");
      compiler.writeLineToBody("<!--[if mso]>");
      compiler.writeLineToBody(`<td style="width: ${colWidth}px; padding: 0;" align="left" valign="top">`);
      compiler.writeLineToBody("<![endif]-->");
      compiler.writeLineToBody(`<div class="elos-col-${colsId}-${i}" style="display:inline-block; margin-bottom: ${gap}px; width:100%; vertical-align:top; text-align:left;">`);
      child.compile(compiler);
      compiler.writeLineToBody("</div>");
      compiler.writeLineToBody("<!--[if mso]>");
      compiler.writeLineToBody("</td>");
      compiler.writeLineToBody("<![endif]-->");
    });
    compiler.remember("currWidth", currWidth);
    compiler.writeLineToBody("<!--[if mso]>");
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
    compiler.writeLineToBody("<![endif]-->");
    compiler.writeLineToBody("</td>");
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
  }
};

// src/nodes/SpaceNode.ts
var SpaceNode = class _SpaceNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "space")) {
      parser.advance();
      parser.insert(new _SpaceNode());
      parser.traverseUp();
      let className = parseClass(parser);
      if (className) {
        parser.setAttribute("className", className);
      }
      parser.traverseDown();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const className = this.getAttribute("className") || null;
    const vgap = compiler.variable("vgap");
    const width = compiler.variable("width");
    const css = compile_style_attrs_default.compileStyleAttrs(compiler, "space", className, {
      "height": `${vgap}px`
    });
    const cssString = compile_style_attrs_default.attrsToCssString(css);
    compiler.writeLineToBody(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td style="${cssString}"></td>`);
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
  }
};

// src/nodes/BtnNode.ts
var BtnNode = class _BtnNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "btn")) {
      parser.advance();
      parser.insert(new _BtnNode());
      parser.traverseUp();
      let className = parseClass(parser);
      if (className) {
        parser.setAttribute("className", className);
      }
      if (!ExpressionNode.parse(parser)) {
        throw new Error("Expected an expression");
      }
      parser.setAttribute("text");
      if (ArrowNode.parse(parser)) {
        if (!ExpressionNode.parse(parser)) {
          throw new Error("Expected an expression");
        }
        parser.setAttribute("url");
      }
      parser.traverseDown();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const expression = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("text"));
    const className = this.getAttribute("className");
    const url = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("url"));
    const width = compiler.get("currWidth");
    let css = compile_style_attrs_default.compileStyleAttrs(compiler, "btn", className, {
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
    compiler.writeLineToBody(`<table border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">`);
    compiler.writeLineToBody("<tbody>");
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td align="center" bgcolor="${bgColor}" role="presentation" style="border:none;border-radius:${borderRadius};cursor:auto;mso-padding-alt:${padding};background:${bgColor};" valign="middle">`);
    compiler.writeLineToBody(`<a href="${url ? url : "#"}" style="display:inline-block;margin:0;${cssString}" target="_blank">`);
    compiler.writeLineToBody(expression);
    compiler.writeLineToBody("</a>");
    compiler.writeLineToBody("</td>");
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</tbody>");
    compiler.writeLineToBody("</table>");
  }
};

// src/parser/helpers/parse-body.ts
function parseBody(parser) {
  while (IncludeNode.parse(parser) || SpaceNode.parse(parser) || ColsNode.parse(parser) || GroupNode.parse(parser) || ImgNode.parse(parser) || LineNode.parse(parser) || TxtNode.parse(parser) || BtnNode.parse(parser) || RawNode.parse(parser)) ;
}

// src/nodes/FontNode.ts
var FontNode = class _FontNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "font")) {
      parser.advance();
      parser.insert(new _FontNode());
      parser.traverseUp();
      if (!ExpressionNode.parse(parser)) {
        throw new Error("Expected an expression");
      }
      parser.setAttribute("fontSrc");
      parser.traverseDown();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const fontSrc = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("fontSrc"));
    compiler.writeHead(`
			<style>
			@import url('${fontSrc}');
			</style>
		`);
  }
};

// src/parser/helpers/parse-head.ts
function parseHead(parser) {
  while (DefNode.parse(parser) || StyleNode.parse(parser) || IncludeNode.parse(parser) || FontNode.parse(parser)) ;
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
    if (parser.acceptWithValue("Ident" /* IDENT */, "include")) {
      parser.advance();
      parser.insert(new _IncludeNode());
      parser.traverseUp();
      if (!ExpressionNode.parse(parser)) {
        throw new Error("Expected an expression");
      }
      parser.setAttribute("fileName");
      parser.traverseDown();
      return true;
    }
    return false;
  }
  compile(compiler) {
    const file = compile_expression_into_value_default.compileExpressionIntoValue(compiler, this.getAttribute("fileName"));
    const path = compiler.get("path");
    const filename = `${path}/${file}.elos`;
    const code = fs.readFileSync(filename, "utf8");
    Manager.emit("fileTouch" /* FILE_TOUCH */, {
      filename
    });
    const tokens = new Lexer().tokenize(code);
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
    compiler.import(clonedCompiler);
    compiler.writeHead(clonedCompiler.getHead());
    compiler.write(clonedCompiler.getBody());
  }
};

// src/nodes/BodyNode.ts
var BodyNode = class _BodyNode extends Node {
  static parse(parser) {
    if (parser.acceptWithValue("Ident" /* IDENT */, "body")) {
      parser.advance();
      if (parser.acceptWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_OPEN_SYMBOL)) {
        parser.advance();
        parser.insert(new _BodyNode());
        parser.in();
        parseBody(parser);
        if (parser.expectWithValue("Symbol" /* SYMBOL */, grammar_default.BLOCK_CLOSE_SYMBOL)) {
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
      compiler.writeLineToBody('<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">');
      compiler.writeLineToBody(preview);
      compiler.writeLineToBody(`</div>`);
    }
    compiler.writeLineToBody('<table role="presentation" style="width:100%;border:none;border-spacing:0;">');
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody('<td align="center" style="padding:0;">');
    compiler.writeLineToBody(`<table role="presentation" style="width:100%;max-width:${totalWidth}px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
    compiler.writeLineToBody("<tr>");
    compiler.writeLineToBody(`<td width="${edge}">`);
    compiler.writeLineToBody("</td>");
    compiler.writeLineToBody(`<td style="max-width: ${width}px;">`);
    compile_with_vgap_default.compileWithVgap(compiler, this.getChildren());
    compiler.writeLineToBody("</td>");
    compiler.writeLineToBody(`<td width="${edge}">`);
    compiler.writeLineToBody("</td>");
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
    compiler.writeLineToBody("</td>");
    compiler.writeLineToBody("</tr>");
    compiler.writeLineToBody("</table>");
  }
};

// src/parser/AstNode.ts
var AstNode = class extends Node {
  static parse(parser) {
    while (DefNode.parse(parser) || StyleNode.parse(parser) || IncludeNode.parse(parser) || FontNode.parse(parser)) ;
    if (BodyNode.parse(parser)) {
      parser.advance();
      return true;
    }
    return false;
  }
  compile(compiler) {
    this.getChildren().forEach((child) => child.compile(compiler));
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
  /**
   *
   * @private
   */
  cursor = 0;
  /**
   *
   * @private
   */
  tokens;
  /**
   *
   * @private
   */
  ast = new AstNode();
  /**
   *
   * @private
   */
  scope = this.ast;
  /**
   *
   * @param tokens
   */
  setTokenStream(tokens) {
    this.tokens = tokens;
  }
  /**
   *
   * @param tokens
   */
  parse(tokens) {
    this.setTokenStream(tokens);
    this.parseAll();
    return this.ast;
  }
  /**
   *
   */
  parseAll() {
    if (!this.tokens.length) {
      return;
    }
    if (this.cursor > this.tokens.length - 1) {
      return;
    }
    if (AstNode.parse(this)) {
      this.parseAll();
    }
  }
  /**
   *
   */
  getCurrentToken() {
    return this.tokens[this.cursor];
  }
  /**
   *
   * @param offset
   */
  getOffsetToken(offset) {
    return this.tokens[this.cursor + offset];
  }
  /**
   *
   * @param name
   * @param value
   */
  setAttribute(name, value = null) {
    if (value === null) {
      value = this.getLastNode();
      this.getScope().removeLastChild();
    }
    this.getScope().setAttribute(name, value);
  }
  /**
   *
   */
  getCurrentValue() {
    return this.getCurrentToken().value;
  }
  /**
   *
   * @param offset
   */
  advance(offset = 1) {
    this.cursor = this.cursor + offset;
  }
  /**
   *
   * @param type
   */
  accept(type) {
    let token = this.getCurrentToken();
    return token && token.type === type;
  }
  /**
   *
   * @param type
   */
  expect(type) {
    if (this.accept(type)) {
      return true;
    }
    throw new UnexpectedToken(type, this.getCurrentToken());
  }
  /**
   *
   * @param type
   */
  skip(type) {
    if (this.accept(type)) {
      this.advance();
      return true;
    }
    return false;
  }
  /**
   *
   * @param type
   * @param value
   */
  skipWithValue(type, value) {
    if (this.acceptWithValue(type, value)) {
      this.advance();
      return true;
    }
    return false;
  }
  /**
   *
   * @param type
   * @param offset
   */
  acceptAt(type, offset) {
    const token = this.getOffsetToken(offset);
    return token && token.type === type;
  }
  /**
   *
   * @param type
   * @param value
   */
  acceptWithValue(type, value) {
    const token = this.getCurrentToken();
    return token && token.type === type && token.value === value;
  }
  /**
   *
   * @param type
   * @param value
   */
  expectWithValue(type, value) {
    if (this.acceptWithValue(type, value)) {
      return true;
    }
    throw new UnexpectedToken(type, this.getCurrentToken());
  }
  /**
   *
   * @param type
   * @param offset
   * @param value
   */
  expectAtWithValue(type, offset, value) {
    if (this.acceptAtWithValue(type, offset, value)) {
      return true;
    }
    throw new UnexpectedToken(type, this.getCurrentToken());
  }
  /**
   *
   * @param type
   * @param offset
   * @param value
   */
  acceptAtWithValue(type, offset, value) {
    const token = this.getOffsetToken(offset);
    return token && token.type === type && token.value === value;
  }
  /**
   *
   */
  in() {
    this.scope = this.getLastNode();
  }
  /**
   *
   */
  out() {
    this.scope = this.scope.getParent();
  }
  /**
   *
   */
  getScope() {
    return this.scope;
  }
  /**
   *
   */
  getLastNode() {
    return this.scope.getChildren()[this.scope.getChildren().length - 1];
  }
  /**
   *
   * @param node
   */
  insert(node) {
    node.setParent(this.scope);
    this.scope.addChild(node);
  }
  /**
   *
   * @param node
   */
  setScope(node) {
    this.scope = node;
  }
  /**
   *
   */
  traverseUp() {
    this.setScope(this.getLastNode());
  }
  /**
   *
   */
  traverseDown() {
    this.setScope(this.getScope().getParent());
  }
  /**
   *
   * @param node
   */
  wrap(node) {
    const last = this.getLastNode();
    this.getScope().removeLastChild();
    this.insert(node);
    this.traverseUp();
    this.insert(last);
  }
  /**
   *
   */
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
    const runtime = new Runtime();
    runtime.setInternalMemoryItem("path", path);
    return new Compiler(runtime).compile(ast);
  }
  /**
   * @param eventId
   * @param listener
   */
  static on(eventId, listener) {
    Manager.addListener(eventId, listener);
  }
};
export {
  Elos
};
//# sourceMappingURL=index.js.map