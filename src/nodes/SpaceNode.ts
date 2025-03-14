import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class";
import styleCompiler from "../parser/helpers/compile-style-attrs";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class SpaceNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'space')) {

            parser.advance();
            parser.insert(new SpaceNode());
            parser.traverseUp();

            let className = parseClass(parser);
            if (className) {
                parser.setAttribute('className', className);
            }

            parser.traverseDown();
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

        compiler.writeLineToBody(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLineToBody('<tr>');
        compiler.writeLineToBody(`<td style="${cssString}"></td>`);
        compiler.writeLineToBody('</tr>');
        compiler.writeLineToBody('</table>');
    }
}
