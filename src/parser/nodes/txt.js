"use strict";

import Node from "../node.js";

export default class Txt extends Node {

    static name = 'txt';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'txt')) {
            parser.advance();

            parser.expect('string');
            parser.insert(new Txt(parser.getCurrVal()));
            parser.advance();

            return true;
        }

        return false;
    }

    compile(compiler) {

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${compiler.get('width')}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td>${this.getVal()}</td>`);
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
