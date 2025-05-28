import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";
import { Scalar } from "../values";

export class FlexGrow implements StyleDeclaration {
    private value: Scalar;

    constructor(value: Scalar) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.FLEX_GROW;
    }

    equals(other: FlexGrow): boolean {
        return this.value.equals(other.value);
    }

    getValue(): string {
        return this.value.toStyleValue();
    }
}
