"use strict";

export default class Node {

    constructor(value = '') {
        this.value = value;
        this.parent = null;
        this.children = [];
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

    parse(parser) {
        return false;
    }

    compile(compiler) {
    }
}
