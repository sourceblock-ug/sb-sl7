import { RuleSet } from "./ruleset";
export declare abstract class Structure<T extends Structure<any>> {
    protected parent?: Structure<any>;
    protected children: T[];
    constructor(content?: string | Date | Object, parent?: Structure<any>);
    setParent(parent?: Structure<any>): void;
    getParent(): Structure<any> | undefined;
    chars(): string;
    ruleSet(): RuleSet | null;
    length(): number;
    getChildren(): T[];
    childAtIndex(idx: number): T;
    addChild(child: T): void;
    replaceChild(child: T, idx: number): void;
    insertChild(child: T, idx: number): void;
    getChildIndexOf(child: T): number;
    parse(content: string | Date | Object, parent?: Structure<any> | number): void;
    parseParts(content: string | Date | Object): string[];
    removeLastJoinChar(): boolean;
    render(): string;
    escape(str: string): string;
    toString(): string;
    joinChar(): string | Array<string>;
    splitChar(): string | Array<string>;
    escapeChar(): string | null;
    protected abstract createChildStructure(content?: string | Date | Object): T;
    specialCharPosition(): number;
    fieldAtIndex(index: number): T;
    key(): string;
    fieldForKey(key: number | string): Structure<any> | null;
    get(selector: string | Array<string>): Structure<any> | null;
    has(selector: string | Array<string>): boolean;
    isEmpty(): boolean;
    equals(value: null | undefined | Structure<any> | string): boolean;
    getString(selector: string | Array<string>): string;
    set(selector: string | Array<string>, content: string | Date | Object): void;
    cleanup(): void;
    private lastEmptyIndex;
    static escapeSpecial(str: string): string;
    static unescapeSpecial(str: string): string;
    static dateFromStringOrNow(str?: string): Date;
    static charAt(chars: string, p: number): string;
    static escapeRegExp(string: string): string;
}
