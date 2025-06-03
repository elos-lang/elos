import {AttributeValue} from "../types/attribute";
import Node from "../parser/Node";
import Runtime from "../runtime/Runtime";
import OutputBuffer from "./OutputBuffer";
import OutputRenderer from "./OutputRenderer";

export default class Compiler {

    /**
     *
     * @private
     */
    private runtime: Runtime;

    /**
     * @private
     */
    private buffer: OutputBuffer;

    /**
     * @private
     */
    private renderer: OutputRenderer;

    /**
     * @param runtime
     */
    constructor(runtime: Runtime = null) {
        this.runtime = runtime ? runtime : new Runtime();
        this.buffer = new OutputBuffer();
        this.renderer = new OutputRenderer();
    }

    /**
     *
     */
    clone(): Compiler {
        return new Compiler(this.runtime.clone());
    }

    /**
     *
     * @param compiler
     */
    import(compiler: Compiler) {
        this.runtime.import(compiler.getRuntime());
    }

    /**
     *
     */
    getRuntime(): Runtime {
        return this.runtime;
    }

    /**
     *
     * @param string
     */
    write(string: string) {
        this.buffer.writeBody(string);
    }

    writeHead(string: string) {
        this.buffer.writeHead(string);
    }

    writeLineToBody(string: string) {
        this.buffer.writeBody('\n'+string);
    }

    writeLineToHead(string: string) {
        this.buffer.writeHead('\n'+string);
    }

    define(name: string, value: AttributeValue): AttributeValue {
        this.runtime.setVariable(name, value);
        return value;
    }

    variable(name: string): AttributeValue {
        return this.runtime.getVariable(name);
    }

    remember(name: string, value: AttributeValue) {
        return this.runtime.setInternalMemoryItem(name, value);
    }

    get(name: string): AttributeValue {
        return this.runtime.getInternalMemoryItem(name);
    }

    getHead(): string {
        return this.buffer.getHead();
    }

    getBody(): string {
        return this.buffer.getBody();
    }

    compile(ast: Node) {
        ast.compile(this);
        return this.renderer.render(this.buffer, this.runtime.getVariables());
    }
}
