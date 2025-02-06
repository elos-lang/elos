import Node from "../Node";
import parseBody from "../helpers/parse-body";
import styleCompiler from "../helpers/compile-style-attrs.js";
import parseClass from "../helpers/parse-class.js";
import config from "../../grammar.js";
import compilerHelpers from "../../compiler/helpers/compile-with-vgap.js";
import {TokenType} from "../../types/token-type";
import Parser from "../Parser";

export default class GroupNode extends Node {

    private className: string;

    constructor(value: string, className: string) {
        super(value);
        this.className = className;
    }

    static parse(parser: Parser) {

        if (parser.acceptWithVal(TokenType.IDENT, 'group')) {
            parser.advance();

            let className = parseClass(parser);

            if (parser.acceptWithVal(TokenType.SYMBOL, config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new GroupNode('', className));
                parser.in();

                parseBody(parser);

                if (parser.acceptWithVal(TokenType.SYMBOL, config.BLOCK_CLOSE_SYMBOL)) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }
        }

        return false;
    }

    compile(compiler) {

        const css = styleCompiler.compileStyleAttrs(compiler, 'group', this.className,{
            'background-color': '#f0f0f0',
            'padding': '25px',
            'text-align': 'left'
        });

        const bgColor = css['background-color'];
        const padding = parseInt(css['padding']);
        const align = css['text-align'];

        const currWidth = parseInt(compiler.get('currWidth'));
        compiler.remember('currWidth', currWidth - (padding*2));

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width:100%;max-width:${currWidth}px;border:none;border-spacing:0;text-align:left;">`);

        compiler.writeLn('<tr>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn('</tr>');

        compiler.writeLn('<tr>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" align="${align}">`);

        compilerHelpers.compileWithVgap(compiler, this.getChildren(), (align === 'center'));

        compiler.writeLn('</td>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn('</tr>');

        compiler.writeLn('<tr>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn('</tr>');

        compiler.writeLn('</table>');

        compiler.remember('currWidth', currWidth);
    }
}
