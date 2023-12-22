"use strict";

export default class Node {

    constructor(value = '') {
        this.value = value;
        this.parent = null;
        this.children = [];
        this.attributes = {};
    }

    getName() {
        return this.constructor.name;
    }

    setParent(node) {
        this.parent = node;
    }

    getParent() {
        return this.parent;
    }

    getVal() {
        return this.value;
    }

    setVal(value) {
        this.value = value;
    }

    addChild(node) {
        this.children.push(node);
    }

    getChildren() {
        return this.children;
    }

    hasChildren() {
        return (this.children.length > 0);
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    removeLastChild() {
        this.children.pop();
    }

    removeLastChild() {
        this.children.pop();
    }

    parse(parser) {
        return false;
    }

    compile(compiler) {
    }
}
