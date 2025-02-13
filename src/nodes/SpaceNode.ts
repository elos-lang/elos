import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class.js";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class SpaceNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithVal(TokenType.IDENT, 'space')) {
            parser.advance();
            let className = parseClass(parser);

            const spaceNode = new SpaceNode();

            if (className) {
                spaceNode.setAttribute('className', className);
            }

            parser.insert(spaceNode);
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        const className = this.getAttribute('className') as string || null;
        const vgap = compiler.variable('vgap') as string;
        const width = compiler.variable('width') as string;

        const css = styleCompiler.compileStyleAttrs(compiler, 'space', className,{
            'height': `${vgap}px`
        });

        const cssString = styleCompiler.attrsToCssString(css);

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td style="${cssString}"></td>`);
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
