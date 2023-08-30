"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const structure_1 = require("./structure");
const component_1 = require("./component");
class Field extends structure_1.Structure {
    createChildStructure(content) {
        return new component_1.Component(content, this);
    }
    specialCharPosition() {
        return 1;
    }
    key() {
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
exports.Field = Field;
//# sourceMappingURL=field.js.map