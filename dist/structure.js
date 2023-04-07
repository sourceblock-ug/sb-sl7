"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structure = void 0;
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
        let rs = '|^~\\&';
        if (this.parent !== undefined) {
            rs = this.parent.chars();
        }
        return rs;
    }
    ruleSet() {
        if (this.parent != undefined) {
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
        idx = Math.min(this.children.length, Math.max(0, idx));
        return this.children[idx];
    }
    addChild(child) {
        child.setParent(this);
        this.children.push(child);
    }
    replaceChild(child, idx) {
        idx = Math.max(0, idx);
        while (this.children.length <= idx) {
            this.children.push(this.createChildStructure(undefined));
        }
        this.children.splice(idx, 1, child);
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
            else {
                // TODO: Lookup in Ruleset to get Number - if a String?
                if (Number.isInteger(parent)) {
                    parseField = parent;
                }
            }
        }
        if (parseField < 0) {
            let parts = this.parseParts(content);
            this.children = [];
            for (let pIdx = 0; pIdx < parts.length; pIdx++) {
                let com = this.createChildStructure(parts[pIdx]);
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
            strContent = content.getFullYear() + "" +
                ("0" + (content.getMonth() + 1)).slice(-2) + "" +
                ("0" + content.getDate()).slice(-2) + "" +
                ("0" + content.getHours()).slice(-2) + "" +
                ("0" + content.getMinutes()).slice(-2) + "" +
                ("0" + content.getSeconds()).slice(-2);
        }
        else if (typeof content === 'object' && typeof content.toString === 'function') {
            strContent = content.toString();
        }
        else {
            strContent = content + "";
        }
        let rStr = "";
        if (myChar instanceof Array) {
            for (let mC = 0; mC < myChar.length; mC++) {
                rStr += Structure.escapeRegExp(myChar[mC]) + "|";
            }
            rStr = rStr.substring(0, rStr.length - 1);
        }
        else {
            rStr = Structure.escapeRegExp(myChar);
        }
        let rex = RegExp(rStr);
        let prepare = strContent.split(rex);
        let parts;
        if (escape != null && escape !== "") {
            parts = [];
            // Rejoin Lines ending with escape: maybe there is a better regex only version!
            let t = "";
            for (let pIdx = 0; pIdx < prepare.length; pIdx++) {
                let part = prepare[pIdx];
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
        for (let idx = 0; idx < this.children.length; idx++) {
            let t = (this.children[idx] instanceof Object && this.children[idx].render !== undefined) ? this.children[idx].render() : "";
            t = this.escape(t);
            str += t + myChar;
        }
        return this.removeLastJoinChar() ? str.substring(0, str.length - 1) : str; // remove last separator if needed.
    }
    escape(str) {
        const escape = this.escapeChar();
        let myChars = this.joinChar();
        const myChar = typeof myChars === 'string' ? myChars : myChars[0];
        if (escape !== null) {
            str = str.replace(new RegExp(Structure.escapeRegExp(myChar)), escape + myChar);
            if (str.endsWith(escape)) {
                str += escape;
            }
        }
        return str;
    }
    ;
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
    fieldAtIndex(index) {
        while (this.children.length <= index) {
            let items = this.createChildStructure(undefined);
            this.children.push(items);
            items.setParent(this);
        }
        return this.children[index];
    }
    key() {
        let r = "";
        if (this.parent !== undefined) {
            r = this.parent.key();
            if (r !== "") {
                r += ".";
            }
            r += (this.parent.children.indexOf(this) + 1);
        }
        return r;
    }
    fieldForKey(key) {
        const keyNr = typeof key === 'string' ? parseInt(key) : key;
        if (Number.isInteger(keyNr)) {
            return this.fieldAtIndex(keyNr - 1);
        }
        return null;
    }
    get(selector) {
        // TODO: convert path using ruleSet!?!
        const parts = typeof selector === 'string'
            ? selector.replace("\\-", ".").split(".")
            : selector;
        const first = parts.shift();
        if (first !== undefined) {
            let field = this.fieldForKey(first);
            if (field != null) {
                if (parts.length > 0) {
                    return field.get(parts);
                }
                else {
                    return field;
                }
            }
        }
        return null;
    }
    has(selector) {
        return this.get(selector) !== null;
    }
    isEmpty() {
        return this.children.length === 0 || (this.children.length === 1 && this.children[0].isEmpty());
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
        return '';
    }
    set(selector, content) {
        let field = this.get(selector);
        if (field != null) {
            field.parse(content);
        }
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
            return new Date(parseInt(str.substring(0, 4)), parseInt(str.substring(4, 4 + 2)), parseInt(str.substring(6, 6 + 2)), parseInt(str.substring(8, 8 + 2)), parseInt(str.substring(10, 10 + 2)), parseInt(str.substring(12, 12 + 2)));
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
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}
exports.Structure = Structure;
//# sourceMappingURL=structure.js.map