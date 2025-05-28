import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";
import { Scalar } from "../values";

export class BorderImageSlice implements StyleDeclaration {
    private value: Scalar;

    constructor(value: Scalar) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.BORDER_IMAGE_SLICE;
    }

    equals(other: BorderImageSlice): boolean {
        return this.value.equals(other.value);
    }

    getValue(): string {
        return this.value.toStyleValue();
    }
}
