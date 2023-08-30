import { Structure } from "./structure";
import { Component } from "./component";

export class Field extends Structure<Component> {
  createChildStructure(content?: string | Date | unknown): Component {
    return new Component(content, this);
  }

  specialCharPosition(): number {
    return 1;
  }

  key(): string {
    let r = "";
    if (this.parent !== undefined) {
      r = this.parent.key();
      if (this.parent.length() > 1) {
        // if there is only one Field then no extra [...] for position
        r += `[${this.parent.getChildIndexOf(this) + 1}]`;
      }
    }
    return r;
  }
}
