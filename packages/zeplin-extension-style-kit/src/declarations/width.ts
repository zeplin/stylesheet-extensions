import { STYLE_PROPS } from "../constants.js";
import { LengthParams, StyleDeclaration } from "../common.js";
import { Length } from "../values/index.js";

export class Width implements StyleDeclaration {
    private value: Length;

    constructor(value: Length) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.WIDTH;
    }

    equals(other: Width): boolean {
        return this.value.equals(other.value);
    }

    getValue(params: LengthParams): string {
        return this.value.toStyleValue(params);
    }
}
