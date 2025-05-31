import { StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";

export type FontStyleValue = "normal" | "italic" | "oblique";

export class FontStyle implements StyleDeclaration {
    private value: FontStyleValue;

    constructor(value: FontStyleValue = FontStyle.DEFAULT_VALUE) {
        this.value = value as FontStyleValue;
    }

    static get DEFAULT_VALUE(): FontStyleValue {
        return "normal";
    }

    get name(): string {
        return STYLE_PROPS.FONT_STYLE;
    }

    equals(other: FontStyle): boolean {
        return this.value === other.value;
    }

    hasDefaultValue(): boolean {
        return this.value === FontStyle.DEFAULT_VALUE;
    }

    getValue(): string {
        if (this.hasDefaultValue()) {
            return FontStyle.DEFAULT_VALUE;
        }

        return this.value;
    }
}
