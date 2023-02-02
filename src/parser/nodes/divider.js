"use strict";

import Node from "../node.js";
import parseClass from "../helpers/parse-class.js";
import styleCompiler from "../helpers/compile-style-attrs.js";

export default class Divider extends Node {

    static name = 'divider';

    constructor(value, className) {
        super(value);
        this.className = className;
    }

    static parse(parser) {

        if (parser.acceptWithVal('symbol', '-')) {
            parser.advance();
            let className = parseClass(parser);
            parser.insert(new Divider('', className));
            return true;
        }

        return false;
    }

    compile(compiler) {

        const width = parseInt(compiler.variable('width'));

        const css = styleCompiler.compileStyleAttrs(compiler, 'divider', this.className,{
            "height": '3px',
            "background-color": '#000000'
        });

        const cssString = styleCompiler.attrsToCssString(css);

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td style="${cssString}"></td>`);
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
