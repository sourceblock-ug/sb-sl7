import {Structure} from "./structure";

export class SubComponent extends Structure<SubComponent> {
    private content : string | Buffer


    constructor(content?: string | Date | Object, parent?: Structure<any>) {
        super(undefined, undefined);
        this.content = ''
        if (content != undefined) {
            this.parse(content, parent)
        }
    }

    public render(): string {
            if (this.content !== null && this.content !== undefined) {
                if (this.content instanceof Buffer) {
                    this.content = this.content.toString();
                }

                return (this.content + "")
                    .replace(/\n/g, "\\X0A\\")
                    .replace(/\r/g, "\\X0D\\")
                    ;
            } else {
                return "";
            }
    }


    parse(content: string | Date | Object, parent?: Structure<any> | number) {
        if (parent!==undefined && parent instanceof Structure) {
            this.setParent(parent);
        }

        this.content = (content + "")
            .replace( /\\X0A\\/g, "\n")
            .replace( /\\X0D\\/g, "\r")
        ;
    }

    protected createChildStructure(content: string | Date | Object | undefined): SubComponent {
        return new SubComponent(content, this);
    }
}
