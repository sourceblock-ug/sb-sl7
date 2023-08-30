"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structure = void 0;
// noinspection JSUnusedGlobalSymbols
class Structure {
    constructor(content, parent) {
        this.children = [];
        if (content !== undefined) {
            this.parse(content, parent);
        }
    }
    setParent(parent) {
        this.parent = parent;
    }
    getParent() {
        return this.parent;
    }
    chars() {
        let rs = "|^~\\&";
        if (this.parent !== undefined) {
            rs = this.parent.chars();
        }
        return rs;
    }
    ruleSet() {
        if (this.parent !== undefined) {
            return this.parent.ruleSet();
        }
        return null;
    }
    length() {
        return this.children.length;
    }
    getChildren() {
        return this.children;
    }
    childAtIndex(idx) {
        const useIdx = Math.min(this.children.length, Math.max(0, idx));
        return this.children[useIdx];
    }
    addChild(child) {
        child.setParent(this);
        this.children.push(child);
    }
    replaceChild(child, idx) {
        const useIdx = Math.max(0, idx);
        while (this.children.length <= useIdx) {
            this.children.push(this.createChildStructure(undefined));
        }
        this.children.splice(useIdx, 1, child);
    }
    insertChild(child, idx) {
        while (this.children.length < idx) {
            this.children.push(this.createChildStructure(undefined));
        }
        this.children.splice(idx, 0, child);
    }
    getChildIndexOf(child) {
        return this.children.indexOf(child);
    }
    parse(content, parent) {
        let parseField = -1;
        if (parent !== undefined) {
            if (parent instanceof Structure) {
                // Do not Change Parent, if not passed to function
                this.setParent(parent);
            }
            else if (Number.isInteger(parent)) {
                // TODO: Lookup in Ruleset to get Number - if a String?
                parseField = parent;
            }
        }
        if (parseField < 0) {
            const parts = this.parseParts(content);
            this.children = [];
            for (let pIdx = 0; pIdx < parts.length; pIdx += 1) {
                const com = this.createChildStructure(parts[pIdx]);
                this.children.push(com);
            }
        }
        else {
            // Just parse one sub element
            while (this.children.length <= parseField) {
                this.children.push(this.createChildStructure(undefined));
            }
            if (this.children[parseField] !== undefined) {
                this.children[parseField].parse(content);
            }
            else {
                this.children[parseField] = this.createChildStructure(content);
            }
        }
    }
    parseParts(content) {
        const myChar = this.splitChar();
        const escape = this.escapeChar();
        let strContent;
        if (content instanceof Date) {
            strContent = `${content.getFullYear()}${`0${content.getMonth() + 1}`.slice(-2)}${`0${content.getDate()}`.slice(-2)}${`0${content.getHours()}`.slice(-2)}${`0${content.getMinutes()}`.slice(-2)}${`0${content.getSeconds()}`.slice(-2)}`;
        }
        else if (typeof content === "object" &&
            content !== null &&
            "toString" in content &&
            typeof content.toString === "function") {
            strContent = content.toString();
        }
        else {
            strContent = `${content}`;
        }
        let rStr = "";
        if (myChar instanceof Array) {
            for (let mC = 0; mC < myChar.length; mC += 1) {
                rStr += `${Structure.escapeRegExp(myChar[mC])}|`;
            }
            rStr = rStr.substring(0, rStr.length - 1);
        }
        else {
            rStr = Structure.escapeRegExp(myChar);
        }
        const rex = RegExp(rStr);
        const prepare = strContent.split(rex);
        let parts;
        if (escape != null && escape !== "") {
            parts = [];
            // Rejoin Lines ending with escape: maybe there is a better regex only version!
            let t = "";
            for (let pIdx = 0; pIdx < prepare.length; pIdx += 1) {
                const part = prepare[pIdx];
                t += part;
                if (part.endsWith(escape) && !part.endsWith(escape + escape)) {
                    t = t.substring(0, t.length - 1) + myChar;
                }
                else {
                    parts.push(t);
                    t = "";
                }
            }
        }
        else {
            parts = prepare;
        }
        return parts;
    }
    removeLastJoinChar() {
        return true;
    }
    render() {
        const myChar = this.joinChar();
        let str = "";
        for (let idx = 0; idx < this.children.length; idx += 1) {
            let t = this.children[idx] instanceof Object &&
                this.children[idx].render !== undefined
                ? this.children[idx].render()
                : "";
            t = this.escape(t);
            str += t + myChar;
        }
        return this.removeLastJoinChar() ? str.substring(0, str.length - 1) : str; // remove last separator if needed.
    }
    escape(str) {
        const escape = this.escapeChar();
        const myChars = this.joinChar();
        const myChar = typeof myChars === "string" ? myChars : myChars[0];
        let result = str;
        if (escape !== null) {
            result = result.replace(new RegExp(Structure.escapeRegExp(myChar)), escape + myChar);
            if (result.endsWith(escape)) {
                result += escape;
            }
        }
        return result;
    }
    toString() {
        return this.render();
    }
    joinChar() {
        return this.splitChar();
    }
    splitChar() {
        return Structure.charAt(this.chars(), this.specialCharPosition());
    }
    escapeChar() {
        return Structure.charAt(this.chars(), 3);
    }
    specialCharPosition() {
        return 0;
    }
    fieldAtIndex(index, create = false) {
        if (create) {
            while (this.children.length <= index) {
                const items = this.createChildStructure(undefined);
                this.children.push(items);
                items.setParent(this);
            }
        }
        return this.children.length > index ? this.children[index] : null;
    }
    /**
     * @deprecated
     * @param index
     */
    fieldAtIndexIfExists(index) {
        return this.fieldAtIndex(index, false);
    }
    key() {
        let r = "";
        if (this.parent !== undefined) {
            r = this.parent.key();
            if (r !== "") {
                r += ".";
            }
            r += this.parent.children.indexOf(this) + 1;
        }
        return r;
    }
    fieldForKey(key, create = true) {
        const keyNr = typeof key === "string" ? parseInt(key, 10) : key;
        if (Number.isInteger(keyNr)) {
            return this.fieldAtIndex(keyNr - 1, create);
        }
        return null;
    }
    extractParts(selector) {
        // TODO: convert path using ruleSet!?!
        return typeof selector === "string"
            ? selector.replace("\\-", ".").split(".")
            : selector;
    }
    get(selector) {
        const parts = this.extractParts(selector);
        const first = parts.shift();
        if (first !== undefined) {
            const field = this.fieldForKey(first);
            if (field != null) {
                if (parts.length > 0) {
                    return field.get(parts);
                }
                return field;
            }
        }
        return null;
    }
    has(selector) {
        const parts = this.extractParts(selector);
        const first = parts.shift();
        if (first !== undefined) {
            const field = this.fieldForKey(first, false);
            if (field != null) {
                if (parts.length > 0) {
                    return field.has(parts);
                }
                return true;
            }
        }
        return false;
    }
    isEmpty() {
        return (this.children.length === 0 ||
            (this.children.length === 1 && this.children[0].isEmpty()));
    }
    equals(value) {
        if (value === null || value === undefined) {
            return false;
        }
        if (typeof value === "string") {
            return this.render() === value;
        }
        return this.render() === value.render();
    }
    getString(selector) {
        const r = this.get(selector);
        if (r !== null)
            return r.render();
        return "";
    }
    set(selector, content) {
        const field = this.get(selector);
        if (field != null) {
            field.parse(content);
        }
    }
    cleanup() {
        if (this.children.length === 0) {
            return;
        }
        this.children.forEach((value) => value.cleanup());
        if (this.children[this.children.length - 1].isEmpty()) {
            const lastEmptyIndex = this.lastEmptyIndex();
            this.children.splice(lastEmptyIndex, this.children.length - lastEmptyIndex);
        }
    }
    lastEmptyIndex() {
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            if (!this.children[i].isEmpty()) {
                return i + 1;
            }
        }
        return 0;
    }
    static escapeSpecial(str) {
        return str
            .replace(/\\/g, "\\E\\")
            .replace(/\|/g, "\\F\\")
            .replace(/~/g, "\\R\\")
            .replace(/^/g, "\\S\\")
            .replace(/&/g, "\\T\\");
    }
    static unescapeSpecial(str) {
        return str
            .replace(/\\X0A\\/g, "\n")
            .replace(/\\X0D\\/g, "\r")
            .replace(/\\F\\/g, "|")
            .replace(/\\R\\/g, "~")
            .replace(/\\S\\/g, "^")
            .replace(/\\T\\/g, "&")
            .replace(/\\E\\/g, "\\");
    }
    static dateFromStringOrNow(str) {
        if (str !== undefined && str !== "" && str.length >= 14) {
            return new Date(parseInt(str.substring(0, 4), 10), parseInt(str.substring(4, 4 + 2), 10), parseInt(str.substring(6, 6 + 2), 10), parseInt(str.substring(8, 8 + 2), 10), parseInt(str.substring(10, 10 + 2), 10), parseInt(str.substring(12, 12 + 2), 10));
        }
        return new Date();
    }
    static charAt(chars, p) {
        return chars.substring(p, p + 1);
    }
    /*
     * taken from https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
     */
    static escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
}
exports.Structure = Structure;
//# sourceMappingURL=structure.js.map