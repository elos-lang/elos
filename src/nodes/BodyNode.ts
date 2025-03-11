import Node from "../parser/Node";
import parseBody from "../parser/helpers/parse-body";
import compilerHelpers from "../compiler/helpers/compile-with-vgap";
import config from "../grammar";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class BodyNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'body')) {
            parser.advance();

            if (parser.acceptWithValue(TokenType.SYMBOL, config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new BodyNode());
                parser.in();

                parseBody(parser);

                if (parser.expectWithValue(TokenType.SYMBOL, config.BLOCK_CLOSE_SYMBOL)) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }
        }

        return false;
    }

    compile(compiler: Compiler) {

        const preview = compiler.variable('preview') as string;

        const width = parseInt(compiler.variable('width') as string);
        const edge = parseInt(compiler.variable('edge') as string);
        const totalWidth = width+edge*2;

        compiler.remember('currWidth', width);

        if (preview) {
            compiler.writeLineToBody('<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">');
            compiler.writeLineToBody(preview);
            compiler.writeLineToBody(`</div>`);
        }

        compiler.writeLineToBody('<table role="presentation" style="width:100%;border:none;border-spacing:0;">');
        compiler.writeLineToBody('<tr>');
        compiler.writeLineToBody('<td align="center" style="padding:0;">');

        compiler.writeLineToBody(`<table role="presentation" style="width:100%;max-width:${totalWidth}px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
        compiler.writeLineToBody('<tr>');
        compiler.writeLineToBody(`<td width="${edge}">`);
        compiler.writeLineToBody('</td>');
        compiler.writeLineToBody(`<td style="max-width: ${width}px;">`);

        compilerHelpers.compileWithVgap(compiler, this.getChildren());

        compiler.writeLineToBody('</td>');
        compiler.writeLineToBody(`<td width="${edge}">`);
        compiler.writeLineToBody('</td>');
        compiler.writeLineToBody('</tr>');
        compiler.writeLineToBody('</table>');

        compiler.writeLineToBody('</td>');
        compiler.writeLineToBody('</tr>');
        compiler.writeLineToBody('</table>');
    }
}
