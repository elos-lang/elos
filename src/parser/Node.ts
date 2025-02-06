import {Nullable} from "../types/nullable";
import {AttributeValue} from "../types/attribute";
import Parser from "./Parser";

export default class Node {

    protected value: string;

    protected parent: Nullable<Node> = null;

    protected children: Node[] = [];

    protected attributes: Record<string, AttributeValue> = {};

    constructor(value: string = '') {
        this.value = value;
    }

    getName(): string {
        return this.constructor.name;
    }

    setParent(node: Node) {
        this.parent = node;
    }

    getParent(): Node {
        return this.parent;
    }

    getVal(): string {
        return this.value;
    }

    setVal(value: string) {
        this.value = value;
    }

    addChild(node: Node) {
        this.children.push(node);
    }

    getChildren() {
        return this.children;
    }

    hasChildren() {
        return (this.children.length > 0);
    }

    setAttribute(name: string, value: AttributeValue) {
        this.attributes[name] = value;
    }

    getAttribute(name: string): AttributeValue {
        return this.attributes[name];
    }

    removeLastChild() {
        this.children.pop();
    }

    parse(parser: Parser): boolean {
        return false;
    }

    compile(compiler) {
    }
}
