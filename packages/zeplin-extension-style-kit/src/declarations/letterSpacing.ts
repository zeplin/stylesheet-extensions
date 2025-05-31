import { STYLE_PROPS } from "../constants.js";
import { LengthParams, StyleDeclaration } from "../common.js";
import { Length } from "../values/index.js";

export class LetterSpacing implements StyleDeclaration {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    static get DEFAULT_VALUE(): number {
        return 0;
    }

    get name(): string {
        return STYLE_PROPS.LETTER_SPACING;
    }

    hasDefaultValue(): boolean {
        return this.value === LetterSpacing.DEFAULT_VALUE;
    }

    equals(other: LetterSpacing): boolean {
        return this.value === other.value;
    }

    getValue(params: LengthParams): string {
        if (this.hasDefaultValue()) {
            return "normal";
        }

        const value = new Length(this.value, { precision: 2 });

        return value.toStyleValue(params);
    }
}
