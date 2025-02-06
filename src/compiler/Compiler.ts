import {AttributeValue} from "../types/attribute";
import AstNode from "../parser/AstNode";

export default class Compiler {

    private head: string = '';

    private body: string = '';

    private memory: Record<string, any> = {
        variables: {
            preview: '',
            edge: 35,
            hgap: 10,
            vgap: 10,
            width: 650
        },
        colsId: 0,
        imgId: 0,
        classes: {},
        identStyles: {}
    };

    constructor(memory: Record<string, any> = null) {
        if (memory) {
            this.setMemory(memory);
        }
    }

    getMemory(): Record<string, any> {
        return this.memory;
    }

    setMemory(memory: Record<string, any>) {
        this.memory = memory;
    }

    write(string: string) {
        this.body += string;
    }

    writeLn(string: string) {
        this.write('\n'+string);
    }

    writeHead(string: string) {
        this.head += string;
    }

    writeLnHead(string: string) {
        this.writeHead('\n'+string);
    }

    define(name: string, value: AttributeValue) {
        this.memory.variables[name] = value;
        return value;
    }

    variable(name: string): AttributeValue {
        return (typeof this.memory.variables[name] === 'undefined' ? null : this.memory.variables[name]);
    }

    remember(name: string, value: AttributeValue) {
        this.memory[name] = value;
        return value;
    }

    get(name: string): AttributeValue {
        return (typeof this.memory[name] === 'undefined' ? null : this.memory[name]);
    }

    getHead(): string {
        return this.head;
    }

    getBody(): string {
        return this.body;
    }

    clone(): Compiler {
        return new Compiler(this.memory);
    }

    compile(ast: AstNode) {

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
                    ${this.getHead()}
                </head>
                <body>
                    ${this.getBody()}
                </body>
            </html>
        `;
    }
}
