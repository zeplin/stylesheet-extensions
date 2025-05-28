import { STYLE_PROPS } from "../constants";
import { LengthParams, StyleDeclaration } from "../common";
import { Length } from "../values";

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
