import { StyleDeclaration } from "../common";
import { STYLE_PROPS } from "../constants";

const WEIGHT_BOLD = 700;
const WEIGHT_NORMAL = 400;

export type FontWeightValue = number | "normal" | "bold" | "lighter" | "bolder";

export class FontWeight implements StyleDeclaration {
    private value: FontWeightValue;

    constructor(value: FontWeightValue = FontWeight.DEFAULT_VALUE) {
        this.value = value;
    }

    static get DEFAULT_VALUE(): number {
        return WEIGHT_NORMAL;
    }

    get name(): string {
        return STYLE_PROPS.FONT_WEIGHT;
    }

    hasDefaultValue(): boolean {
        return this.value === WEIGHT_NORMAL;
    }

    equals(other: FontWeight): boolean {
        return this.value === other.value;
    }

    getValue(): string | number {
        const { value } = this;

        if (value === WEIGHT_BOLD) {
            return "bold";
        }

        if (value === WEIGHT_NORMAL) {
            return "normal";
        }

        return value;
    }
}
