import { LengthParams, StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";
import { Length } from "../values/index.js";

export class ColumnGap implements StyleDeclaration {
    private value: Length;

    constructor(value: Length) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.COLUMN_GAP;
    }

    equals(other: ColumnGap): boolean {
        return this.value.equals(other.value);
    }

    getValue(params: LengthParams): string {
        return this.value.toStyleValue(params);
    }
}
