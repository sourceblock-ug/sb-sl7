import { Structure } from "./structure";
import { Component } from "./component";
export declare class Field extends Structure<Component> {
    createChildStructure(content?: string | Date | unknown): Component;
    specialCharPosition(): number;
    key(): string;
}
//# sourceMappingURL=field.d.ts.map