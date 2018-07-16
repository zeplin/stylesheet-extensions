import { STYLE_PROPS } from "../constants";

class LetterSpacing {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return "normal";
    }

    get name() {
        return STYLE_PROPS.LETTER_SPACING;
    }

    hasDefaultValue() {
        return this.value === LetterSpacing.DEFAULT_VALUE;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, variables) {
        if (this.hasDefaultValue()) {
            return this.value;
        }

        return this.value.getValue(params, variables);
    }
}

export default LetterSpacing;