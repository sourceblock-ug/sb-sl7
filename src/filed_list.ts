import { Structure } from "./structure";
import { Field } from "./field";

export class FieldList extends Structure<Field> {
  createChildStructure(content?: string | Date | unknown): Field {
    return new Field(content, this);
  }

  specialCharPosition(): number {
    return 2;
  }

  key(): string {
    let r = "";
    if (this.parent !== undefined) {
      r = this.parent.key();
      if (r !== "") r += "-";
      r += this.parent.getChildIndexOf(this) + 1;
    }
    return r;
  }
}
