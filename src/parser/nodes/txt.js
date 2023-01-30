"use strict";

import Node from "../node.js";
import parseClass from "../helpers/parse-class.js";
import compileClassAttrs from "../helpers/compile-class-attrs.js";

export default class Txt extends Node {

    static name = 'txt';

    constructor(value, className, url = null) {
        super(value);
        this.className = className;
        this.url = url;
    }

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'txt')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect('string');
            let textValue = parser.getCurrVal();
            parser.advance();

            if (
                parser.accept('symbol', '-') &&
                parser.acceptAtWithVal('symbol', 1, '>')
            ) {
                parser.advance();
                parser.advance();

                parser.expect('string');
                let urlValue = parser.getCurrVal();
                parser.advance();

                parser.insert(new Txt(textValue, className, urlValue));
                return true;
            }

            parser.insert(new Txt(textValue, className));
            return true;
        }

        return false;
    }

    compile(compiler) {

        let css = compileClassAttrs(compiler, this.className, {
            'font-size': '12px',
            'color': '#000000',
            'line-height': '16px',
            'text-decoration': 'none'
        });

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${compiler.get('width')}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td style="${css}">`);
        if (this.url) {
            compiler.writeLn(`<a href="${this.url}" target="_blank" style="${css}">`);
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
