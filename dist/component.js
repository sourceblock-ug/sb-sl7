"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const structure_1 = require("./structure");
const sub_component_1 = require("./sub_component");
class Component extends structure_1.Structure {
    specialCharPosition() {
        return 4;
    }
    createChildStructure(content) {
        return new sub_component_1.SubComponent(content, this);
    }
}
exports.Component = Component;
//# sourceMappingURL=component.js.map