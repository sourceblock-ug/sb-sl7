import {Structure} from "./structure";
import {FieldList} from "./filed_list";
import {Field} from "./field";
import {Component} from "./component";
import {SubComponent} from "./sub_component";

export class Part extends Structure<FieldList> {
    private _type : string = 'MSH'
    private _msh : SubComponent


    constructor(content?: string | Date | Object, parent?: Structure<any>) {
        super(undefined, undefined);
        this._msh = new SubComponent('', this)
        if (content !== undefined ) {
            this.parse(content, parent)
        } else if (parent !== undefined) {
            this.setParent(parent)
        }
    }

    createChildStructure(content?: string | Date | Object): FieldList {
        return new FieldList(content, this)
    }


    parseParts(content: string | Date | Object): string[] {
        const parseParts : string[] = super.parseParts(content)
        if (parseParts.length>0) {
            const parsePart = parseParts[0];
            if (parsePart.length===3) {
                this._type = parsePart;
                parseParts.splice(0, 1);
            }
            if (this._type === 'MSH' && parsePart.length>0) {
                this._msh.parse(parseParts[0])
                parseParts.splice(0, 1)
            }
        }
        return parseParts
    }


    render(): string {
        const str = super.render()
        return this._type + (this._type === 'MSH' ? this.joinChar() + this._msh.render() : '') + this.joinChar() + str
    }


    key(): string {
        var r = "";
        if (this.parent !== undefined) {
            r = this.parent .key();
            if (r!=="") r+=".";

            let found = 0;
            let p = -1;
            r += this._type;
            for (let i = 0; i < this.parent.length(); i++) {
                const child = this.parent.childAtIndex(i)
                if (child instanceof Part) {
                    const childField : Part = child as Part
                    if (childField._type === this._type) {
                        found++;
                    }
                }
                if (child===this) {
                    p = found;
                }
            }
            if (p>1) {
                r+="[" + p + "]";
            }
        }
        return r;
    }


    fieldForKey(key: number | string): Structure<any> | null {
        let item = 0;
        if (typeof key === "string" && key.indexOf("[")>=0) {
            const s = key.substring(key.indexOf("[")+1, key.indexOf("]"));
            item = Math.max(0, parseInt(s)-1);
            key = key.substring(0, key.indexOf("["))
        }

        const isMsh = this._type === 'MSH';
        const keyNr : number = typeof key === 'string' ? parseInt(key) : key
        if (!isNaN(keyNr)) {
            if (isMsh && keyNr === 1) {
                return this._msh
            } else if (isMsh && keyNr === 0) {
                return new SubComponent(this.joinChar(), this)
            }
            const child = this.fieldAtIndex(keyNr - (isMsh?2:1));
            if(child != null) {
                return child.fieldAtIndex(item);
            }
        }
        return null;
    }

// @ts-ignore
    get type(): string {
        return this._type;
    }

    // @ts-ignore
    set type(value: string) {
        if (value.length===3) {
            this._type = value;
        }
    }
}
