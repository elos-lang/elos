"use strict";

import Node from "../node.js";
import parseClass from "../helpers/parse-class.js";
import compileClassAttrs from "../helpers/compile-class-attrs.js";

export default class Space extends Node {

    static name = 'space';

    constructor(value, className) {
        super(value);
        this.className = className;
    }

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'space')) {
            parser.advance();
            let className = parseClass(parser);
            parser.insert(new Space('', className));
            return true;
        }

        return false;
    }

    compile(compiler) {

        let css = compileClassAttrs(compiler, this.className,{
            "height": '25px'
        });

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${compiler.get('width')}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td style="${css}"></td>`);
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
