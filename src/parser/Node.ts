import {Nullable} from "../types/nullable";
import {AttributeValue} from "../types/attribute";
import Parser from "./Parser";
import Compiler from "../compiler/Compiler";
import ExpressionNode from "../nodes/ExpressionNode";

export default class Node {

    /**
     *
     * @protected
     */
    protected value: string;

    /**
     *
     * @protected
     */
    protected parent: Nullable<Node> = null;

    /**
     *
     * @protected
     */
    protected children: Node[] = [];

    /**
     *
     * @protected
     */
    protected attributes: Record<string, AttributeValue> = {};

    /**
     *
     * @param value
     */
    constructor(value: string = '') {
        this.value = value;
    }

    /**
     *
     */
    getName(): string {
        return this.constructor.name;
    }

    /**
     *
     * @param node
     */
    setParent(node: Node) {
        this.parent = node;
    }

    /**
     *
     */
    getParent(): Node {
        return this.parent;
    }

    /**
     *
     */
    getValue(): string {
        return this.value;
    }

    /**
     *
     * @param value
     */
    setValue(value: string) {
        this.value = value;
    }

    /**
     *
     * @param node
     */
    addChild(node: Node) {
        this.children.push(node);
    }

    /**
     *
     */
    getChildren() {
        return this.children;
    }

    /**
     *
     */
    hasChildren() {
        return (this.children.length > 0);
    }

    /**
     *
     * @param name
     * @param value
     */
    setAttribute(name: string, value: AttributeValue) {
        this.attributes[name] = value;
    }

    /**
     *
     * @param name
     */
    getAttribute(name: string): Nullable<AttributeValue> {
        return this.attributes[name] || null;
    }

    /**
     *
     */
    getAttributes(): Record<string, AttributeValue> {
        return this.attributes;
    }

    /**
     *
     */
    removeLastChild() {
        this.children.pop();
    }

    /**
     *
     * @param parser
     */
    parse(parser: Parser): boolean {
        return false;
    }

    /**
     *
     * @param compiler
     */
    compile(compiler: Compiler) {
    }

    print(): string {

        const printNode = (node: Node, indentAmount: number = 0): string => {

            const nodeName = node.getName();
            const nodeValue = node.getValue();

            let attributes = node.getAttributes();
            let attributesString = [];
            for (let attribute in attributes) {
                let attrValue = attributes[attribute];
                if (attrValue instanceof Node) {
                    const attrNodeValue = attrValue.getValue();
                    attrValue = `${attrValue.getName()}${attrNodeValue ? `(${attrNodeValue})` : ''}`;
                }
                attributesString.push(`${attribute}=${attrValue}`);
            }

            let tabs = indentAmount > 0 ? "   ".repeat(indentAmount - 1) + "└──" : "";
            let output = [`${tabs}${nodeName}${nodeValue ? `(${nodeValue})` : ''} ${attributesString.join(' ')}`];

            node.getChildren().forEach(childNode => {
                output.push(printNode(childNode, indentAmount + 1));
            });

            return output.join("\n");
        };

        return printNode(this);
    }
}
