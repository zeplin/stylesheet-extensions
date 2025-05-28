import { LengthParams, StyleDeclaration } from "../common";
import { STYLE_PROPS } from "../constants";
import { Length } from "../values";

export class Gap implements StyleDeclaration {
    private value: Length;

    constructor(value: Length) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.GAP;
    }

    equals(other: Gap): boolean {
        return this.value.equals(other.value);
    }

    getValue(params: LengthParams): string {
        return this.value.toStyleValue(params);
    }
}
