import Compiler from "../Compiler";
import Node from "../../parser/Node";
import RawNode from "../../nodes/RawNode";
import {AlignmentOption} from "../../types/alignment-option";

export default {
    compileWithVgap(compiler: Compiler, children: Node[], align: AlignmentOption = AlignmentOption.LEFT) {

        const totalChildrenCount = children.length;
        const rawChildrenCount = children.filter(child => child instanceof RawNode).length;
        const otherChildrenCount = totalChildrenCount - rawChildrenCount;

        const hasOnlyRawChildren = otherChildrenCount === 0;

        const vgap = compiler.variable('vgap');
        const cssString = (align === AlignmentOption.CENTER ? '' : 'width: 100%;');

        if (totalChildrenCount) {

            if (! hasOnlyRawChildren) {
                compiler.writeLn(`<table role="presentation" style="${cssString}border:none;border-spacing:0;text-align:${align};font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);
            }

            let otherChildIndex = 0;
            children.forEach((child, index) => {

                if (child instanceof RawNode) {
                    child.compile(compiler);
                } else {
                    compiler.writeLn('<tr>');
                    compiler.writeLn(`<td align="${align}">`);
                    child.compile(compiler);
                    compiler.writeLn('</td>');
                    compiler.writeLn('</tr>');
                    if (otherChildIndex < otherChildrenCount - 1) {
                        compiler.writeLn(`<tr><td height="${vgap}"></td></tr>`);
                    }

                    otherChildIndex++;
                }
            });

            if (! hasOnlyRawChildren) {
                compiler.writeLn(`</table>`);
            }
        }
    }
};
