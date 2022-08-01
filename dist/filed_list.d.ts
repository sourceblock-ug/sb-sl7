import { Structure } from "./structure";
import { Field } from "./field";
export declare class FieldList extends Structure<Field> {
    createChildStructure(content?: string | Date | Object): Field;
    specialCharPosition(): number;
    key(): string;
}
