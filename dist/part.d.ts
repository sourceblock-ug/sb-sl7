import { Structure } from "./structure";
import { FieldList } from "./filed_list";
export declare class Part extends Structure<FieldList> {
    private _type;
    private _msh;
    constructor(content?: string | Date | Object, parent?: Structure<any>);
    createChildStructure(content?: string | Date | Object): FieldList;
    parseParts(content: string | Date | Object): string[];
    render(): string;
    key(): string;
    fieldForKey(key: number | string): Structure<any> | null;
    get type(): string;
    set type(value: string);
}
