"use strict";

import Node from "../node.js";
import parseAll from "../helpers/parse-all.js";
import compilerHelpers from "../../compiler/helpers/compile-with-vgap.js";
import config from "../../config.js";

export default class Body extends Node {

    static name = 'body';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'body')) {
            parser.advance();

            if (parser.acceptWithVal('symbol', config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new Body());
                parser.in();

                parseAll(parser);

                if (parser.acceptWithVal('symbol',config.BLOCK_CLOSE_SYMBOL)) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }
        }

        return false;
    }

    compile(compiler) {

        const width = parseInt(compiler.variable('width'));
        const edge = parseInt(compiler.variable('edge'));
        const totalWidth = width+edge*2;

        compiler.remember('currWidth', width);

        compiler.writeLn('<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">');
        compiler.writeLn(compiler.variable('preview'));
        compiler.writeLn(`</div>`);

        compiler.writeLn('<table role="presentation" style="width:100%;border:none;border-spacing:0;">');
        compiler.writeLn('<tr>');
        compiler.writeLn('<td align="center" style="padding:0;">');

        compiler.writeLn(`<table role="presentation" style="width:100%;max-width:${totalWidth}px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td width="${edge}">`);
        compiler.writeLn('</td>');
        compiler.writeLn(`<td style="max-width: ${width}px;">`);

        compilerHelpers.compileWithVgap(compiler, this.getChildren());

        compiler.writeLn('</td>');
        compiler.writeLn(`<td width="${edge}">`);
        compiler.writeLn('</td>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');

        compiler.writeLn('</td>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
