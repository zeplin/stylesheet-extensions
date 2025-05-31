import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";
import { Length } from "../values/index.js";

export class FontSize implements StyleDeclaration {
    private value: Length | "normal";

    constructor(value: Length | "normal") {
        this.value = value;
    }

    static get DEFAULT_VALUE(): string {
        return "normal";
    }

    get name(): string {
        return STYLE_PROPS.FONT_SIZE;
    }

    hasDefaultValue(): boolean {
        return this.value === FontSize.DEFAULT_VALUE;
    }

    equals(other: FontSize): boolean {
        if (this.hasDefaultValue() && other.hasDefaultValue()) {
            return true;
        }
        return !this.hasDefaultValue() && !other.hasDefaultValue() && (this.value as Length).equals(other.value as Length);
    }

    getValue(params: any): string {
        if (this.hasDefaultValue()) {
            return FontSize.DEFAULT_VALUE;
        }

        return (this.value as Length).toStyleValue(params);
    }
}
