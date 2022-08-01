"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleSet = void 0;
class RuleSet {
    constructor(name, desc, anz) {
        this._parent = null;
        this._desc = "";
        this.children = [];
        this._name = name;
        this._anz = anz;
        this._desc = desc;
    }
    position() {
        if (this._parent !== null)
            return this._parent.indexOf(this);
        else
            return 0; // no Parent? I am the First!
    }
    indexOf(child) {
        return this.children.indexOf(child);
    }
    ruleSet(path) {
        if (path === undefined || path == null || path === "")
            return this;
        const pathNr = typeof path === 'string' ? parseInt(path) : path;
        if (Number.isInteger(pathNr)) {
            return this.getChild(pathNr);
        }
        if (typeof path === 'string' && path.indexOf(".") >= 0) {
            try {
                const pos = parseInt(path.substring(0, path.indexOf(".")));
                return this.getChild(pos).ruleSet(path.substring(path.indexOf(".") + 1));
            }
            catch (ignored) { }
        }
        return new RuleSet("Unknown " + path, "", "1+");
    }
    getChild(path) {
        if (path > 0 && path < this.children.length) {
            return this.children[path];
        }
        else
            return new RuleSet("Unknown " + path, "", "1+");
    }
    setParent(value) {
        this._parent = value;
    }
    getParent() {
        return this._parent;
    }
    addChild(child) {
        this.children.push(child);
    }
    setChild(child, position) {
        if (position < 0)
            return; // nothing to do here:
        while (this.children.length <= position) {
            this.children.push(new RuleSet("Empty", "", "1+"));
        }
        // Replace Entry at Position
        this.children.splice(position, 1, child);
        child.setParent(this);
    }
    getName() {
        return this._name;
    }
    setName(value) {
        if (value !== undefined) {
            this._name = value;
        }
        else {
            this._name = "";
        }
    }
    getAnz() {
        return this._anz;
    }
    setAnz(value) {
        this._anz = value;
    }
    getDesc() {
        return this._desc;
    }
    setDesc(value) {
        this._desc = value;
    }
    cloneRuleSet(name, desc, anz) {
        if (name === undefined || name == null || name === "")
            name = this._name;
        if (desc === undefined || desc == null || desc === "")
            desc = this._desc;
        if (anz === undefined || anz == null || anz === "")
            anz = this._anz;
        var copy = new RuleSet(name, desc, anz);
        this.children.forEach(function (value) {
            copy.addChild(value.cloneRuleSet());
        });
        return copy;
    }
    static addRuleSet(ruleSet) {
        RuleSet.rules.push(ruleSet);
    }
    static getRuleSet(name) {
        for (const rule of RuleSet.rules) {
            if (rule._name === name) {
                return rule;
            }
        }
        const ruleSet1 = new RuleSet(name, "", "1+");
        RuleSet.addRuleSet(ruleSet1);
        return ruleSet1;
    }
}
exports.RuleSet = RuleSet;
RuleSet.rules = [];
//# sourceMappingURL=ruleset.js.map