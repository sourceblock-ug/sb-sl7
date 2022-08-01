import { Structure } from "./structure";
import { Component } from "./component";
export declare class Field extends Structure<Component> {
    createChildStructure(content?: string | Date | Object): Component;
    specialCharPosition(): number;
    key(): string;
}
