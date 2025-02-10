import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class.js";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import {Nullable} from "../types/nullable";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import ArrowNode from "./ArrowNode";

export default class TxtNode extends Node {

    private className: Nullable<string>;
    private url: Nullable<string>;

    constructor(value: string, className: string = null, url: string = null) {
        super(value);
        this.className = className;
        this.url = url;
    }

    static parse(parser: Parser): boolean {

        if (parser.acceptWithVal(TokenType.IDENT, 'txt')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect(TokenType.STRING);
            let textValue = parser.getCurrVal();
            parser.advance();

            if (ArrowNode.parse(parser)) {

                parser.expect(TokenType.STRING);
                let urlValue = parser.getCurrVal();

                parser.insert(new TxtNode(textValue, className, urlValue));
                parser.advance();
                return true;
            }

            parser.insert(new TxtNode(textValue, className));
            return true;
        }

        return false;
    }

    compile(compiler) {

        const width = compiler.variable('width');

        const css = styleCompiler.compileStyleAttrs(compiler, 'txt', this.className, {
            'font-size': '12px',
            'color': '#000000',
            'line-height': '16px',
            'text-decoration': 'none'
        });

        const cssString = styleCompiler.attrsToCssString(css);

        compiler.writeLn(`<table cellspacing="0" cellpadding="0" style="max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td style="${cssString}">`);

        if (this.url) {
            compiler.writeLn(`<a href="${this.url}" target="_blank" style="${cssString}">`);
            compiler.writeLn(`${this.getVal()}`);
            compiler.writeLn(`</a>`);
        } else {
            compiler.writeLn(`${this.getVal()}`);
        }

        compiler.writeLn(`</td>`);
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
