import { LengthParams, StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";
import { Length } from "../values/index.js";

export class Height implements StyleDeclaration {
    private value: Length;

    constructor(value: Length) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.HEIGHT;
    }

    equals(other: Height): boolean {
        return this.value.equals(other.value);
    }

    getValue(params: LengthParams): string {
        return this.value.toStyleValue(params);
    }
}
