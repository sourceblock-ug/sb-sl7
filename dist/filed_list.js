"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldList = void 0;
const structure_1 = require("./structure");
const field_1 = require("./field");
class FieldList extends structure_1.Structure {
    createChildStructure(content) {
        return new field_1.Field(content, this);
    }
    specialCharPosition() {
        return 2;
    }
    key() {
        let r = "";
        if (this.parent !== undefined) {
            r = this.parent.key();
            if (r !== "")
                r += "-";
            r += (this.parent.getChildIndexOf(this) + 1);
        }
        return r;
    }
}
exports.FieldList = FieldList;
//# sourceMappingURL=filed_list.js.map