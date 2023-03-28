import { Structure } from "./structure";
import { RuleSet } from "./ruleset";
import { Part } from "./part";
export declare class Message extends Structure<Part> {
    private messageChars;
    private msgRuleSet;
    constructor(content?: string | Date | Object);
    getMessageChars(idx?: number): string;
    parse(content: string | Date | Object, parent?: Structure<any> | number): void;
    private static encodingPreFlight;
    msh(): Part;
    addPart(part: Part): void;
    joinChar(): string | Array<string>;
    splitChar(): string | Array<string>;
    removeLastJoinChar(): boolean;
    escapeChar(): string | null;
    createChildStructure(content?: string | Date | Object): Part;
    ruleSet(): RuleSet | null;
    chars(): string;
    parseParts(content: string | Date | Object): string[];
    fieldForKey(key: number | string): Structure<any> | null;
    get(selector: string | Array<string>): Structure<any> | null;
    debug(): string;
    static formatDate(dt?: Date): string;
    static createResponse(source: Message | string | Object, code?: string, message?: string): Message;
}
