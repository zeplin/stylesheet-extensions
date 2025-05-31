import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";
import { Length } from "../values/index.js";

export class BorderRadius implements StyleDeclaration {
    private value: Length;

    constructor(value: Length) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.BORDER_RADIUS;
    }

    equals(other: BorderRadius): boolean {
        return this.value.equals(other.value);
    }

    getValue(params: any): string {
        return this.value.toStyleValue(params);
    }
}
