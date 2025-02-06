import Node from "../Node";
import parseClass from "../helpers/parse-class.js";
import styleCompiler from "../helpers/compile-style-attrs.js";
import {Nullable} from "../../types/nullable";
import Parser from "../Parser";
import {TokenType} from "../../types/token-type";

export default class SpaceNode extends Node {

    private className: Nullable<string>;

    constructor(value: string, className: string = null) {
        super(value);
        this.className = className;
    }

    static parse(parser: Parser): boolean {

        if (parser.acceptWithVal(TokenType.IDENT, 'space')) {
            parser.advance();
            let className = parseClass(parser);
            parser.insert(new SpaceNode('', className));
            return true;
        }

        return false;
    }

    compile(compiler) {

        const width = compiler.variable('width');

        const css = styleCompiler.compileStyleAttrs(compiler, 'space', this.className,{
            'height': '25px'
        });

        const cssString = styleCompiler.attrsToCssString(css);

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td style="${cssString}"></td>`);
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
