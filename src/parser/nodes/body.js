"use strict";

import Node from "../node.js";
import parseAll from "../parse-all.js";

export default class Body extends Node {

    static name = 'body';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'body')) {
            parser.advance();

            if (parser.acceptWithVal('symbol','[')) {
                parser.advance();

                parser.insert(new Body());
                parser.in();

                parseAll(parser);

                if (parser.acceptWithVal('symbol',']')) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }
        }

        return false;
    }

    compile(compiler) {

        const width = parseInt(compiler.get('width'));
        const edge = parseInt(compiler.get('edge'));
        const totalWidth = width+edge*2;

        compiler.writeLn('<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">');
        compiler.writeLn(compiler.get('preview'));
        compiler.writeLn(`</div>`);

        compiler.writeLn('<table role="presentation" style="width:100%;border:none;border-spacing:0;">');
        compiler.writeLn('<tr>');
        compiler.writeLn('<td align="center" style="padding:0;">');

        compiler.writeLn(`<table role="presentation" style="width:100%;max-width:${totalWidth}px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td width="${edge}">`);
        compiler.writeLn('</td>');
        compiler.writeLn(`<td style="max-width: ${width}px;">`);

        this.getChildren().forEach(child => {
            child.compile(compiler);
        });

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
