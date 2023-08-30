import { Structure } from "./structure";
import { RuleSet } from "./ruleset";
import { Part } from "./part";
export declare class Message extends Structure<Part> {
    private messageChars;
    private msgRuleSet;
    constructor(content?: string | Date | unknown);
    getMessageChars(idx?: number): string;
    parse(content: string | Date | unknown, parent?: Structure<any> | number): void;
    private static encodingPreFlight;
    msh(): Part;
    addPart(part: Part): void;
    joinChar(): string | Array<string>;
    splitChar(): string | Array<string>;
    removeLastJoinChar(): boolean;
    escapeChar(): string | null;
    createChildStructure(content?: string | Date | unknown): Part;
    ruleSet(): RuleSet | null;
    chars(): string;
    parseParts(content: string | Date | unknown): string[];
    fieldForKey(key: number | string, create?: boolean): Structure<any> | null;
    protected extractParts(selector: string | Array<string>): string[];
    debug(): string;
    static formatDate(dt?: Date): string;
    static createResponse(source: Message | string | unknown, code?: string, message?: string): Message;
}
//# sourceMappingURL=message.d.ts.map