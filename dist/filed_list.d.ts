import { Structure } from "./structure";
import { Field } from "./field";
export declare class FieldList extends Structure<Field> {
    createChildStructure(content?: string | Date | unknown): Field;
    specialCharPosition(): number;
    key(): string;
}
//# sourceMappingURL=filed_list.d.ts.map