"use strict";

export default class Compiler {

    constructor() {
        this.head = '';
        this.body = '';
        this.memory = {
            colsId: 0,
            edge: 35,
            gap: 10,
            width: 650
        };
    }

    write(string) {
        this.body += string;
    }

    writeLn(string) {
        this.write('\n'+string);
    }

    writeHead(string) {
        this.head += string;
    }

    writeLnHead(string) {
        this.writeHead('\n'+string);
    }

    define(name, value) {
        this.memory[name] = value;
        return value;
    }

    get(name) {
        return (typeof this.memory[name] === 'undefined' ? null : this.memory[name]);
    }

    compile(ast) {

        ast.compile(this);

        return `
            <!doctype html>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <!--[if !mso]><!-->
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <!--<![endif]-->
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style type="text/css">
                          * { padding: 0; margin: 0; }
                          #outlook a { padding:0; }
                          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
                          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
                          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
                          p { display:block;margin:13px 0; }
                        </style>
                    ${this.head}
                </head>
                <body>
                    ${this.body}
                </body>
            </html>
        `;
    }
}
