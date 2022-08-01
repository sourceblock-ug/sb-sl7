
export class RuleSet {
    private _parent : RuleSet | null = null
    private _name : string
    private _anz : string
    private _desc : string = ""
    private children : RuleSet[] = []

    constructor(name: string, desc: string, anz: string) {
        this._name = name
        this._anz = anz
        this._desc = desc
    }

    public position () : number {
        if (this._parent!==null) return this._parent.indexOf(this);
        else return 0; // no Parent? I am the First!
    }

    public indexOf (child: RuleSet) : number {
        return this.children.indexOf(child)
    }

    public ruleSet (path : string|number|null|undefined) : RuleSet {
        if (path===undefined || path==null || path==="") return this;
        const pathNr : number = typeof path === 'string' ? parseInt(path) : path
        if (Number.isInteger(pathNr)) {
            return this.getChild(pathNr);
        }
        if (typeof path === 'string' && path.indexOf(".")>=0) {
            try {
                const pos = parseInt(path.substring(0, path.indexOf(".")))
                return this.getChild(pos).ruleSet(path.substring(path.indexOf(".") + 1));
            } catch (ignored) {}
        }
        return new RuleSet("Unknown " + path, "", "1+")
    }

    public getChild (path: number) {
        if (path>0 && path<this.children.length) {
            return this.children[path];
        } else return new RuleSet("Unknown " + path, "", "1+")
    }

    public setParent (value: RuleSet) {
        this._parent = value
    }

    public getParent () : RuleSet | null {
        return this._parent
    }

    public addChild (child: RuleSet) {
        this.children.push(child);
    }

    public setChild (child: RuleSet, position: number) {
        if (position<0) return; // nothing to do here:
        while (this.children.length<=position) {
            this.children.push(new RuleSet("Empty", "", "1+"));
        }
        // Replace Entry at Position
        this.children.splice(position, 1, child);
        child.setParent(this);
    }

    public getName () : string {
        return this._name
    }

    public setName (value?: string) {
        if (value !== undefined) {
            this._name = value
        } else {
            this._name = ""
        }
    }

    public getAnz () : string {
        return this._anz
    }

    public setAnz (value: string) {
        this._anz = value
    }

    public getDesc () : string {
        return this._desc
    }

    public setDesc (value: string)  {
        this._desc = value
    }

    public cloneRuleSet (name? : string| null, desc? : string| null, anz? : string| null) {
        if (name===undefined || name==null || name === "") name = this._name;
        if (desc===undefined || desc==null || desc === "") desc = this._desc;
        if (anz===undefined  || anz==null  || anz === "" ) anz = this._anz;
        var copy = new RuleSet(name, desc, anz);
        this.children.forEach(function (value) {
            copy.addChild(value.cloneRuleSet())
        });
        return copy;
    }

    private static rules : RuleSet[] = []

    public static addRuleSet (ruleSet : RuleSet) {
        RuleSet.rules.push(ruleSet)
    }

    public static getRuleSet (name: string) : RuleSet {
        for (const rule of RuleSet.rules) {
            if (rule._name === name) {
                return rule
            }
        }

        const ruleSet1 = new RuleSet(name, "", "1+");
        RuleSet.addRuleSet(ruleSet1);
        return ruleSet1
    }
}
