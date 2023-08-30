import { Structure } from "./structure";
import { SubComponent } from "./sub_component";
export declare class Component extends Structure<SubComponent> {
    specialCharPosition(): number;
    createChildStructure(content?: string | Date | unknown): SubComponent;
}
//# sourceMappingURL=component.d.ts.map