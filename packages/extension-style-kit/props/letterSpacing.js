import Length from "../values/length";

import { STYLE_PROPS } from "../constants";

class LetterSpacing {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return new Length(0);
    }

    get name() {
        return STYLE_PROPS.LETTER_SPACING;
    }

    hasDefaultValue() {
        return this.value.equals(LetterSpacing.DEFAULT_VALUE);
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, variables) {
        if (this.hasDefaultValue()) {
            return "normal";
        }

        return this.value.toStyleValue(params, variables);
    }
}

export default LetterSpacing;