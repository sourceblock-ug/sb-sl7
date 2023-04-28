import {RuleSet} from "./ruleset";

export abstract class Structure<T extends Structure<any>> {
    protected parent? : Structure<any>
    protected children: T[] = []

    constructor(content?: string | Date | Object, parent?: Structure<any>) {
        if (content !== undefined) {
            this.parse(content, parent)
        }
    }

    public setParent (parent?: Structure<any>) {
        this.parent = parent
    }

    public getParent () : Structure<any> | undefined {
        return this.parent
    }

    public chars () : string {
        let rs = '|^~\\&';
        if (this.parent!==undefined) {
            rs = this.parent.chars();
        }
        return rs;
    }

    public ruleSet () : RuleSet | null {
        if (this.parent !== undefined) {
            return this.parent.ruleSet()
        }
        return null;
    }

    public length() : number {
        return this.children.length
    }

    public getChildren() : T[] {
        return this.children
    }

    public childAtIndex( idx: number) : T {
        idx = Math.min(this.children.length, Math.max(0, idx))
        return this.children[idx]
    }

    public addChild (child: T) : void {
        child.setParent(this)
        this.children.push(child)
    }

    public replaceChild(child: T, idx: number) {
        idx = Math.max(0, idx)
        while (this.children.length<=idx) {
            this.children.push(this.createChildStructure(undefined))
        }
        this.children.splice(idx, 1, child)
    }

    public insertChild(child: T, idx: number) {
        while (this.children.length<idx) {
            this.children.push(this.createChildStructure(undefined))
        }
        this.children.splice(idx, 0, child);
    }

    public getChildIndexOf(child: T) : number {
        return this.children.indexOf(child)
    }

    public parse (content: string | Date | Object, parent? : Structure<any> | number ) {
        let parseField = -1;
        if (parent!==undefined) {
            if (parent instanceof Structure) {
                // Do not Change Parent, if not passed to function
                this.setParent(parent);
            } else {
                // TODO: Lookup in Ruleset to get Number - if a String?
                if (Number.isInteger(parent)) {
                    parseField = parent;
                }
            }
        }

        if (parseField<0) {
            let parts = this.parseParts(content);

            this.children = [];
            for (let pIdx=0;pIdx<parts.length;pIdx++) {
                let com = this.createChildStructure(parts[pIdx]);
                this.children.push(com);
            }
        } else {
            // Just parse one sub element
            while(this.children.length<=parseField) {
                this.children.push(this.createChildStructure(undefined));
            }
            if (this.children[parseField] !== undefined) {
                this.children[parseField].parse(content);
            } else {
                this.children[parseField] = this.createChildStructure(content);
            }
        }
    }

    public parseParts (content: string | Date | Object) : string[] {
        const myChar : string | Array<string> = this.splitChar();
        const escape : string | null = this.escapeChar();
        let strContent : string;
        if (content instanceof Date) {
            strContent =   content.getFullYear() + "" +
                ("0" + (content.getMonth()+1)).slice(-2) + "" +
                ("0" +  content.getDate()).slice(-2) + "" +
                ("0" +  content.getHours()).slice(-2) + "" +
                ("0" +  content.getMinutes()).slice(-2) + "" +
                ("0" +  content.getSeconds()).slice(-2);
        } else if (typeof content === 'object' && typeof content.toString === 'function') {
            strContent = content.toString();
        } else {
            strContent = content + "";
        }
        let rStr = "";
        if (myChar instanceof Array) {
            for(let mC=0;mC<myChar.length;mC++) {
                rStr += Structure.escapeRegExp(myChar[mC]) + "|";
            }
            rStr = rStr.substring(0, rStr.length - 1);
        } else {
            rStr = Structure.escapeRegExp(myChar);
        }
        let rex = RegExp(rStr);
        let prepare = strContent.split(rex);
        let parts : string[];

        if (escape != null && escape !== "") {
            parts = [];
            // Rejoin Lines ending with escape: maybe there is a better regex only version!
            let t = "";
            for(let pIdx=0;pIdx<prepare.length;pIdx++) {
                let part = prepare[pIdx];
                t += part;
                if (part.endsWith(escape) && !part.endsWith(escape + escape)) {
                    t = t.substring(0, t.length - 1) + myChar;
                } else {
                    parts.push(t);
                    t = "";
                }
            }
        } else {
            parts = prepare;
        }
        return parts;
    }

    public removeLastJoinChar () : boolean {
        return true
    }

    public render () {
        const myChar = this.joinChar();
        let str = "";

        for(let idx=0;idx<this.children.length;idx++) {
            let t = (this.children[idx] instanceof Object && this.children[idx].render!==undefined)?this.children[idx].render():"";
            t = this.escape(t);
            str += t + myChar;
        }

        return this.removeLastJoinChar()?str.substring(0,str.length-1):str; // remove last separator if needed.
    }

    public escape (str: string) : string {
        const escape = this.escapeChar();
        let myChars = this.joinChar();
        const myChar = typeof myChars === 'string' ? myChars : myChars[0]
        if (escape!==null) {
            str = str.replace(new RegExp(Structure.escapeRegExp(myChar)), escape + myChar);
            if (str.endsWith(escape)) {
                str += escape;
            }
        }
        return str;
    };

    public toString () : string {
        return this.render()
    }

    public joinChar () : string | Array<string> {
        return this.splitChar()
    }

    public splitChar () : string | Array<string> {
        return Structure.charAt(this.chars(), this.specialCharPosition());
    }

    public escapeChar () : string | null {
        return Structure.charAt(this.chars(), 3);
    }

    protected abstract createChildStructure (content?: string | Date | Object) : T;

    public specialCharPosition () : number {
        return 0
    }

    public fieldAtIndex (index: number) : T {
        while (this.children.length<=index) {
            let items = this.createChildStructure(undefined);
            this.children.push(items);
            items.setParent(this);
        }
        return this.children[index];
    }

    public key () : string {
        let r = ""
        if (this.parent !== undefined) {
            r = this.parent.key();
            if (r!=="") {
                r+=".";
            }
            r += (this.parent.children.indexOf(this) + 1);
        }
        return r;
    }

    public fieldForKey (key: number | string) : Structure<any> | null {
        const keyNr : number = typeof key === 'string' ? parseInt(key) : key
        if (Number.isInteger(keyNr)) {
            return this.fieldAtIndex(keyNr - 1);
        }
        return null
    }

    public get (selector : string | Array<string> ) : Structure<any> | null {
        // TODO: convert path using ruleSet!?!
        const parts : string[] = typeof selector === 'string'
            ? selector.replace("\\-", ".").split(".")
            : selector

        const first = parts.shift();
        if (first!==undefined) {
            let field = this.fieldForKey(first);
            if (field!=null) {
                if (parts.length>0) {
                    return field.get(parts);
                }
                else {
                    return field;
                }
            }
        }
        return null;
    }

    public has (selector : string | Array<string> ) :boolean {
        return this.get(selector) !== null
    }

    public isEmpty(): boolean {
        return this.children.length === 0 || (this.children.length === 1 && this.children[0].isEmpty());
    }

    public equals(value: null | undefined  | Structure<any> | string) {
        if (value === null || value === undefined) {
            return false
        }
        if (typeof value === "string") {
            return this.render() === value;
        }
        return this.render() === value.render();
    }

    public getString (selector : string | Array<string> ) :string {
        const r : Structure<any> | null = this.get(selector)
        if (r !== null ) return r.render()
        return ''
    }

    public set (selector: string | Array<string>, content: string | Date | Object) :void {
        let field = this.get(selector);
        if (field!=null) {
            field.parse(content);
        }
    }

    public cleanup(): void {
        if (this.children.length === 0) {
            return;
        }
        this.children.forEach(value => value.cleanup());
        if (this.children[this.children.length-1].isEmpty()) {
            const lastEmptyIndex = this.lastEmptyIndex();
            this.children.splice(lastEmptyIndex, this.children.length - lastEmptyIndex);
        }
    }

    private lastEmptyIndex(): number {
        for (let i = this.children.length - 1; i >= 0; i--) {
            if (!this.children[i].isEmpty()) {
                return i+1;
            }
        }
        return 0;
    }

    public static escapeSpecial (str: string) {
        return str
            .replace(/\\/g, "\\E\\")
            .replace(/\|/g, "\\F\\")
            .replace(/~/g, "\\R\\")
            .replace(/^/g, "\\S\\")
            .replace(/&/g, "\\T\\")
    }

    public static unescapeSpecial (str: string) {
        return str
            .replace(/\\X0A\\/g, "\n")
            .replace(/\\X0D\\/g, "\r")
            .replace(/\\F\\/g, "|")
            .replace(/\\R\\/g, "~")
            .replace(/\\S\\/g, "^")
            .replace(/\\T\\/g, "&")
            .replace(/\\E\\/g, "\\")
    }

    public static dateFromStringOrNow (str?: string) {
        if (str !== undefined && str !== "" && str.length >=14) {
            return new Date(
                parseInt(str.substring(0, 4)),
                parseInt(str.substring(4, 4 + 2)),
                parseInt(str.substring(6, 6 + 2)),
                parseInt(str.substring(8, 8 + 2)),
                parseInt(str.substring(10, 10 + 2)),
                parseInt(str.substring(12, 12 + 2)),
            );
        } return new Date();
    }

    public static charAt(chars : string, p : number): string {
        return chars.substring(p,p+1)
    }

    /*
     * taken from https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
     */
    public static escapeRegExp (string: string) :string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
}
