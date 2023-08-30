import { Structure } from "./structure";
export declare class SubComponent extends Structure<SubComponent> {
    private content;
    constructor(content?: string | Date | unknown, parent?: Structure<any>);
    render(): string;
    isEmpty(): boolean;
    parse(content: string | Date | unknown, parent?: Structure<any> | number): void;
    protected createChildStructure(content: string | Date | unknown | undefined): SubComponent;
}
//# sourceMappingURL=sub_component.d.ts.map