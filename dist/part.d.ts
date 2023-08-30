import { Structure } from "./structure";
import { FieldList } from "./filed_list";
export declare class Part extends Structure<FieldList> {
    private _type;
    private _msh;
    constructor(content?: string | Date | unknown, parent?: Structure<any>);
    createChildStructure(content?: string | Date | unknown): FieldList;
    parseParts(content: string | Date | unknown): string[];
    render(): string;
    key(): string;
    fieldForKey(key: number | string, create?: boolean): Structure<any> | null;
    get type(): string;
    set type(value: string);
}
//# sourceMappingURL=part.d.ts.map