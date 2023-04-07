"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const structure_1 = require("./structure");
const ruleset_1 = require("./ruleset");
const part_1 = require("./part");
const decoder_1 = __importDefault(require("./decoder"));
class Message extends structure_1.Structure {
    constructor(content) {
        super(undefined, undefined);
        this.messageChars = "|^~\\&";
        this.msgRuleSet = null;
        if (content instanceof ruleset_1.RuleSet) {
            this.msgRuleSet = content;
        }
        else if (content !== undefined) {
            this.parse(content, undefined);
        }
        else {
            this.addPart(new part_1.Part("MSH" + this.messageChars));
        }
    }
    getMessageChars(idx) {
        if (idx === undefined || idx < 0 || idx > 4) {
            return this.messageChars;
        }
        else {
            return this.messageChars.substring(idx, idx + 1);
        }
    }
    parse(content, parent) {
        if (content instanceof Buffer) {
            // PreFlight for Encoding in Buffer
            content = Message.encodingPreFlight(content);
        }
        super.parse(content, parent);
    }
    static encodingPreFlight(buffer) {
        let msgStr = buffer.toString();
        if (msgStr.startsWith("MSH") && msgStr.length > 5) {
            const mySplit = msgStr.substring(3, 4);
            const parts = msgStr.split(mySplit);
            let encoding = null;
            if (parts.length >= 19) {
                encoding = parts[18];
            }
            if (encoding !== null &&
                encoding !== '' &&
                encoding !== 'UNICODE UTF-8') {
                msgStr = (0, decoder_1.default)(buffer, encoding);
            }
        }
        return msgStr;
    }
    msh() {
        for (let idx = 0; idx < this.length(); idx++) {
            const part = this.childAtIndex(idx);
            if (part.type !== null && part.type.toUpperCase() === "MSH") {
                return part;
            }
        }
        // insert a msh at first position
        const msh = new part_1.Part("MSH|");
        this.insertChild(msh, 0);
        return msh;
    }
    addPart(part) {
        this.addChild(part);
    }
    joinChar() {
        return "\r";
    }
    splitChar() {
        return ["\r\n", "\r", "\n"];
    }
    removeLastJoinChar() {
        return false;
    }
    escapeChar() {
        return null;
    }
    createChildStructure(content) {
        return new part_1.Part(content, this);
    }
    ruleSet() {
        return this.msgRuleSet;
    }
    chars() {
        return this.messageChars;
    }
    parseParts(content) {
        const parseParts = super.parseParts(content);
        for (let i = 0; i < parseParts.length; i++) {
            if (parseParts[i].length > 9 && parseParts[i].toUpperCase().startsWith("MSH")) {
                const length = 5;
                const tc = parseParts[i].substring(3, 3 + 1);
                let c = parseParts[i].substring(3, 3 + length);
                if (c.indexOf(tc) > 0) {
                    // TODO:
                    c = c.substring(0, c.indexOf(tc)) + this.messageChars.substring(c.indexOf(tc));
                }
                this.messageChars = c;
                i = parseParts.length; // abort
            }
        }
        // remove empty at the End
        while (parseParts[parseParts.length - 1] === '') {
            parseParts.splice(parseParts.length - 1, 1);
        }
        return parseParts;
    }
    fieldForKey(key) {
        let item = 0;
        if (typeof key === 'string' && key.indexOf("[") >= 0) {
            item = Math.max(0, parseInt(key.substring(key.indexOf("[") + 1, key.indexOf("]"))) - 1);
            key = key.substring(0, key.indexOf("["));
        }
        const keyNr = typeof key === 'string' ? parseInt(key) : key;
        if (Number.isInteger(keyNr)) {
            return this.fieldAtIndex(keyNr - 1);
        }
        else if (typeof key === 'string') {
            let found = -1;
            for (var i = 0; i < this.length(); i++) {
                const loopPart = this.childAtIndex(i);
                if (loopPart.type.toUpperCase() === key.toUpperCase()) {
                    found++;
                    if (found === item) {
                        return loopPart;
                    }
                }
            }
            // console.error("Missing Part " + key + " in Message, adding empty one");
            // console.trace("Missing part " + key + " were added here: ");
            const part = new part_1.Part(undefined, this);
            part.type = key;
            /* var ruleSet = RuleSet.getRuleSet(key);
            if (ruleSet!=null) {
                ruleSet.applyRuleSet(part);
            } */
            this.addChild(part);
            return part;
        }
        return null;
    }
    get(selector) {
        if (typeof selector === "string") {
            // TODO: convert path using ruleSet!?!
            var isMSH = selector.toLowerCase().startsWith("msh");
            selector = selector.replace("-", ".").split(".");
            if (isMSH) {
                if (selector[1].indexOf("[") >= 0) {
                    const item = Math.max(0, parseInt(selector[1].substring(selector[1].indexOf("[") + 1, selector[1].indexOf("]"))));
                    const key = selector[1].substring(0, selector[1].indexOf("["));
                    selector[1] = (parseInt(key) - 1) + "[" + item + "]";
                }
                else {
                    // MSH Fields are one off - due to the numbering of the Seperator String!
                    selector[1] = (parseInt(selector[1]) - 1) + '';
                }
            }
        }
        const first = selector.shift();
        if (first !== undefined) {
            const field = this.fieldForKey(first);
            if (field != null) {
                if (selector.length > 0) {
                    return field.get(selector);
                }
                else {
                    return field;
                }
            }
        }
        return null;
    }
    debug() {
        return this.render().replace(/\r/g, "\n");
    }
    static formatDate(dt) {
        if (!(dt instanceof Date)) {
            dt = new Date();
        }
        return dt.getFullYear() + "" +
            ("0" + (dt.getMonth() + 1)).slice(-2) + "" +
            ("0" + dt.getDate()).slice(-2) + "" +
            ("0" + dt.getHours()).slice(-2) + "" +
            ("0" + dt.getMinutes()).slice(-2) + "" +
            ("0" + dt.getSeconds()).slice(-2);
    }
    static createResponse(source, code, message) {
        const msg = (source instanceof Message) ? source : new Message(source);
        code = code || "AA";
        message = message || "";
        const ack = new Message(msg.msh().render());
        const msgId = ack.getString("MSH-10");
        const app = ack.getString("MSH-3");
        const facc = ack.getString("MSH-4");
        const dt = Message.formatDate(new Date());
        const nid = (dt + Math.random()).substring(0, 22);
        ack.set("MSH-3", ack.getString("MSH-5"));
        ack.set("MSH-4", ack.getString("MSH-6"));
        ack.set("MSH-5", app);
        ack.set("MSH-6", facc);
        ack.set("MSH-7", dt);
        ack.set("MSH-9", "ACK");
        ack.set("MSH-10", nid);
        // AS
        ack.set("MSA-1", code);
        ack.set("MSA-2", msgId);
        ack.set("MSA-3", message);
        return ack;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map