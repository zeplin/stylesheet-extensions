import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";

type BorderStyleValue =
    | "none"
    | "hidden"
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";

export class BorderStyle implements StyleDeclaration {
    private value: BorderStyleValue;

    constructor(value: BorderStyleValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.BORDER_STYLE;
    }

    equals(other: BorderStyle): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return this.value;
    }
}
