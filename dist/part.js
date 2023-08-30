"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part = void 0;
const structure_1 = require("./structure");
const filed_list_1 = require("./filed_list");
const sub_component_1 = require("./sub_component");
class Part extends structure_1.Structure {
    constructor(content, parent) {
        super(undefined, undefined);
        this._type = "MSH";
        this._msh = new sub_component_1.SubComponent("", this);
        if (content !== undefined) {
            this.parse(content, parent);
        }
        else if (parent !== undefined) {
            this.setParent(parent);
        }
    }
    createChildStructure(content) {
        return new filed_list_1.FieldList(content, this);
    }
    parseParts(content) {
        const parseParts = super.parseParts(content);
        if (parseParts.length > 0) {
            const parsePart = parseParts[0];
            if (parsePart.length === 3) {
                this._type = parsePart;
                parseParts.splice(0, 1);
            }
            if (this._type === "MSH" && parsePart.length > 0) {
                this._msh.parse(parseParts[0]);
                parseParts.splice(0, 1);
            }
        }
        return parseParts;
    }
    render() {
        const str = super.render();
        return (this._type +
            (this._type === "MSH" ? this.joinChar() + this._msh.render() : "") +
            this.joinChar() +
            str);
    }
    key() {
        let r = "";
        if (this.parent !== undefined) {
            r = this.parent.key();
            if (r !== "")
                r += ".";
            let found = 0;
            let p = -1;
            r += this._type;
            for (let i = 0; i < this.parent.length(); i += 1) {
                const child = this.parent.childAtIndex(i);
                if (child instanceof Part) {
                    const childField = child;
                    if (childField._type === this._type) {
                        found += 1;
                    }
                }
                if (child === this) {
                    p = found;
                }
            }
            if (p > 1) {
                r += `[${p}]`;
            }
        }
        return r;
    }
    fieldForKey(key, create = true) {
        let item = 0;
        if (typeof key === "string" && key.indexOf("[") >= 0) {
            const s = key.substring(key.indexOf("[") + 1, key.indexOf("]"));
            item = Math.max(0, parseInt(s, 10) - 1);
            key = key.substring(0, key.indexOf("["));
        }
        const isMsh = this._type === "MSH";
        const keyNr = typeof key === "string" ? parseInt(key, 10) : key;
        if (!Number.isNaN(keyNr)) {
            if (isMsh && keyNr === 1) {
                return this._msh;
            }
            if (isMsh && keyNr === 0) {
                return new sub_component_1.SubComponent(this.joinChar(), this);
            }
            const child = this.fieldAtIndex(keyNr - (isMsh ? 2 : 1), create);
            if (child != null) {
                return child.fieldAtIndex(item, create);
            }
        }
        return null;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        if (value.length === 3) {
            this._type = value;
        }
    }
}
exports.Part = Part;
//# sourceMappingURL=part.js.map