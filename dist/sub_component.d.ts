import { Structure } from "./structure";
export declare class SubComponent extends Structure<SubComponent> {
    private content;
    constructor(content?: string | Date | Object, parent?: Structure<any>);
    render(): string;
    parse(content: string | Date | Object, parent?: Structure<any> | number): void;
    protected createChildStructure(content: string | Date | Object | undefined): SubComponent;
}
