"use strict";

export default {
    compileWithVgap(compiler, children, center = false) {

        const childCount = children.length;
        const vgap = compiler.variable('vgap');

        const cssString = (center ? '' : 'width: 100%;');

        if (childCount) {
            compiler.writeLn(`<table role="presentation" style="${cssString}border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">`);

            children.forEach((child, i) => {

                compiler.writeLn('<tr>');
                compiler.writeLn('<td>');
                child.compile(compiler);
                compiler.writeLn('</td>');
                compiler.writeLn('</tr>');

                if (i < childCount-1) {
                    compiler.writeLn(`<tr><td height="${vgap}"></td></tr>`);
                }
            });

            compiler.writeLn(`</table>`);
        }
    }
};
