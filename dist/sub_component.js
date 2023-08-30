"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubComponent = void 0;
const structure_1 = require("./structure");
class SubComponent extends structure_1.Structure {
    constructor(content, parent) {
        super(undefined, undefined);
        this.content = "";
        if (content !== undefined) {
            this.parse(content, parent);
        }
    }
    render() {
        if (this.content !== null && this.content !== undefined) {
            if (this.content instanceof Buffer) {
                this.content = this.content.toString();
            }
            return `${this.content}`
                .replace(/\n/g, "\\X0A\\")
                .replace(/\r/g, "\\X0D\\");
        }
        return "";
    }
    isEmpty() {
        if (this.content === undefined || this.content === null) {
            return super.isEmpty();
        }
        return this.content.length === 0;
    }
    parse(content, parent) {
        if (parent !== undefined && parent instanceof structure_1.Structure) {
            this.setParent(parent);
        }
        this.content = `${content}`
            .replace(/\\X0A\\/g, "\n")
            .replace(/\\X0D\\/g, "\r");
    }
    createChildStructure(content) {
        return new SubComponent(content, this);
    }
}
exports.SubComponent = SubComponent;
//# sourceMappingURL=sub_component.js.map