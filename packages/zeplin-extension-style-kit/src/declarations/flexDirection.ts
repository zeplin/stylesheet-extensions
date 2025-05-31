import { STYLE_PROPS } from "../constants.js";
import { StyleDeclaration } from "../common.js";

type FlexDirectionValue = "row" | "row-reverse" | "column" | "column-reverse";

export class FlexDirection implements StyleDeclaration {
    private value: FlexDirectionValue;

    constructor(value: FlexDirectionValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.FLEX_DIRECTION;
    }

    equals(other: FlexDirection): boolean {
        return this.value === other.value;
    }

    getValue(): string {
        return this.value;
    }
}
