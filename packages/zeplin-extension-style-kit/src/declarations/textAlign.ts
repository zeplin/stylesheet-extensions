import { StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";

type TextAlignValue = "left" | "right" | "center" | "justify" | "start" | "end";

export class TextAlign implements StyleDeclaration {
    private value: TextAlignValue;

    constructor(value: TextAlignValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.TEXT_ALIGN;
    }

    equals(other: TextAlign): boolean {
        return this.value === other.value;
    }

    getValue(): TextAlignValue {
        return this.value;
    }
}
