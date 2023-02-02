"use strict";

import Node from "../node.js";
import parseClass from "../helpers/parse-class.js";
import styleCompiler from "../helpers/compile-style-attrs.js";

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

                parser.insert(new Txt(textValue, className, urlValue));
                parser.advance();
                return true;
            }

            parser.insert(new Txt(textValue, className));
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
