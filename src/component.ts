import { Structure } from "./structure";
import { SubComponent } from "./sub_component";

export class Component extends Structure<SubComponent> {
  specialCharPosition(): number {
    return 4;
  }

  createChildStructure(content?: string | Date | unknown): SubComponent {
    return new SubComponent(content, this);
  }
}
