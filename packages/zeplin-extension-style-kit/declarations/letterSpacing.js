import Length from "../values/length";

import { STYLE_PROPS } from "../constants";

class LetterSpacing {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return 0;
    }

    get name() {
        return STYLE_PROPS.LETTER_SPACING;
    }

    hasDefaultValue() {
        return this.value === LetterSpacing.DEFAULT_VALUE;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue(params) {
        if (this.hasDefaultValue()) {
            return "normal";
        }

        const value = new Length(this.value, { precision: 2 });

        return value.toStyleValue(params);
    }
}

export default LetterSpacing;
