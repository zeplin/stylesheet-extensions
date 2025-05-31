import { STYLE_PROPS } from "../constants.js";
import { LengthParams, StyleDeclaration } from "../common.js";
import { Length } from "../values/index.js";

export class BorderWidth implements StyleDeclaration {
    private width: Length;

    constructor(width: Length) {
        this.width = width;
    }

    get name(): string {
        return STYLE_PROPS.BORDER_WIDTH;
    }

    equals(other: BorderWidth): boolean {
        return this.width.equals(other.width);
    }

    getValue(params: LengthParams): string {
        return this.width.toStyleValue(params);
    }
}
