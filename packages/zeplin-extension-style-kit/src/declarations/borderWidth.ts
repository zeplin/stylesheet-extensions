import { STYLE_PROPS } from "../constants";
import { LengthParams, StyleDeclaration } from "../common";
import { Length } from "../values";

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
