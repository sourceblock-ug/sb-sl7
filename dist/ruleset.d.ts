export declare class RuleSet {
    private _parent;
    private _name;
    private _anz;
    private _desc;
    private children;
    constructor(name: string, desc: string, anz: string);
    position(): number;
    indexOf(child: RuleSet): number;
    ruleSet(path: string | number | null | undefined): RuleSet;
    getChild(path: number): RuleSet;
    setParent(value: RuleSet): void;
    getParent(): RuleSet | null;
    addChild(child: RuleSet): void;
    setChild(child: RuleSet, position: number): void;
    getName(): string;
    setName(value?: string): void;
    getAnz(): string;
    setAnz(value: string): void;
    getDesc(): string;
    setDesc(value: string): void;
    cloneRuleSet(name?: string | null, desc?: string | null, anz?: string | null): RuleSet;
    private static rules;
    static addRuleSet(ruleSet: RuleSet): void;
    static getRuleSet(name: string): RuleSet;
}
