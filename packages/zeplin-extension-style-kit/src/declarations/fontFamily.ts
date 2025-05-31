import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";

export class FontFamily implements StyleDeclaration {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.FONT_FAMILY;
    }

    equals(other: FontFamily): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return this.value;
    }
}
